import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { env } from "../config/env.js";
import { openai } from "../services/openai.js";
import { embedText } from "../services/embeddings.js";
import { buildContext, retrieveKb } from "../services/rag.js";
import {
  appendMessage,
  getOrCreateSession,
  getRecentMessages,
  upsertChatSession,
} from "../services/sessions.js";
import { extractFieldsFromText } from "../services/leadScoring.js";
import { buildFactsContext, getAssistantFacts } from "../services/assistantFacts.js";

export const chatRouter = Router();

const ChatBody = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(800),
  pagePath: z.string().max(120).optional(),
  stream: z.boolean().optional(),
});

const CTA = { label: "Request 5-minute review", href: "#contact" };
const CTA_LINE = "Want to request the 5-minute review?";
const LEAD_CAPTURE_LINE =
  "Perfect - the form takes ~30 seconds. Drop your site URL and I'll send the review.";
const MAX_CHAT_TOKENS = 160;
const MIN_SIMILARITY = 0.78;
const MATCH_COUNT = 4;
const GOALS = ["more calls", "more leads", "more sales"];

const REDIRECT_PATTERNS = [
  /can you build an app/i,
  /\bseo\b/i,
  /\bads?\b/i,
  /\blogo\b/i,
  /\bbranding\b/i,
  /what stack/i,
  /\breact\b/i,
];

const ALLOW_RAG_PATTERNS = [
  /price|cost|how much|pricing/i,
  /timeline|turnaround|response time|how fast/i,
  /include|included|not included|scope|deliverable/i,
  /privacy|data policy|gdpr/i,
  /review|loom/i,
  /process|steps?/i,
];

const LEAD_CAPTURE_PATTERNS = [
  /\byes\b|\bsure\b|\bsounds good\b|\blet'?s go\b|\bdo it\b|\bsend it\b/i,
  /how do i start/i,
  /where'?s the form/i,
  /can you look at my site/i,
];

const TAG_RULES = [
  { tag: "site:pricing", test: /price|cost|pricing|how much/i },
  { tag: "site:process", test: /process|timeline|turnaround|response time|how fast/i },
  { tag: "site:privacy", test: /privacy|data policy|gdpr/i },
  { tag: "site:offer", test: /include|included|not included|deliverable|scope/i },
  { tag: "site:cta", test: /review|loom|form|cta/i },
];

const SYSTEM_PROMPT = [
  "You are Relay, a small assistant on a website that offers a 5-minute website review.",
  "Your job is to reduce friction and guide the visitor to request the 5-minute review.",
  "Rules (must follow):",
  "- Keep responses under 60 words.",
  "- Use at most 1 short paragraph OR 2 short paragraphs.",
  "- One idea per reply; stay focused.",
  "- No bullet lists unless explicitly asked.",
  "- Do NOT explain multiple service options or compare tiers.",
  "- Do NOT negotiate pricing or timelines beyond what the site already states.",
  "- If the user asks anything outside: review, process, included/not included, privacy, timeline, or fit -> redirect to the 5-minute review form.",
  "- Always re-anchor to the 5-minute review with a gentle CTA (or one clarifying question if absolutely required).",
  "- If you use provided context, paraphrase it briefly; do not quote large sections.",
].join("\n");

function writeNdjson(res, payload) {
  res.write(`${JSON.stringify(payload)}\n`);
}

function ensureCta(reply: string, ctaLine = CTA_LINE) {
  const trimmed = String(reply || "").trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  const hasReview = lower.includes("review");
  const hasAsk = lower.includes("request") || lower.includes("form");
  if (hasReview && hasAsk) return trimmed;
  const spacer = trimmed.endsWith(".") || trimmed.endsWith("?") ? " " : ". ";
  return `${trimmed}${spacer}${ctaLine}`;
}

function clampReply(reply: string, ctaLine = CTA_LINE) {
  const normalized = String(reply || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const sentences = normalized.match(/[^.!?]+[.!?]?/g) || [normalized];
  const limited = sentences.slice(0, 2).join(" ").trim();
  const capped =
    limited.length > 420 ? `${limited.slice(0, 400).trim().replace(/[.!?]*$/, "")}.` : limited;
  return ensureCta(capped, ctaLine);
}

function buildRedirectReply() {
  return "I can help with that, but the fastest first step is the 5-minute review so you know what to fix first. Want to request it now?";
}

function noContextReply() {
  return "I can cover that in a quick 5-minute review and point to the fixes that matter most. Want to request it?";
}

function detectTags(message: string) {
  const lower = String(message || "");
  const matches = TAG_RULES.filter(({ test }) => test.test(lower)).map(({ tag }) => tag);
  return Array.from(new Set(matches));
}

function classifyIntent(message: string, fields: ReturnType<typeof extractFieldsFromText>) {
  const allowRag = ALLOW_RAG_PATTERNS.some((regex) => regex.test(message));
  const leadCapture =
    LEAD_CAPTURE_PATTERNS.some((regex) => regex.test(message)) || Boolean(fields.websiteUrl);
  const redirect = REDIRECT_PATTERNS.some((regex) => regex.test(message)) || (!allowRag && !leadCapture);
  return {
    allowRag,
    leadCapture,
    redirect,
    tags: allowRag ? detectTags(message) : [],
  };
}

function collectChunkTags(docs) {
  const tags = docs
    .flatMap((doc) => (Array.isArray(doc.tags) ? doc.tags : []))
    .filter((tag) => typeof tag === "string");
  return Array.from(new Set(tags));
}

chatRouter.post("/chat", async (req, res) => {
  const parsed = ChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid input" });
  }

  const sessionId = parsed.data.sessionId || randomUUID();
  const message = parsed.data.message.trim();
  const messageLower = message.toLowerCase();
  const stream = Boolean(parsed.data.stream);

  let sessionGoal: string | null = null;

  try {
    const session = await getOrCreateSession(sessionId);

    const detectedGoal = GOALS.find((g) => messageLower.includes(g)) || null;
    const resolvedGoal = detectedGoal || session.goal || null;

    if (detectedGoal && detectedGoal !== session.goal) {
      await upsertChatSession(sessionId, { goal: detectedGoal });
    }
    sessionGoal = resolvedGoal;
  } catch (error) {
    console.error("[chat_sessions] query failed:", {
      message: error?.message,
      details: error?.details ?? error?.detail,
      hint: error?.hint,
      code: error?.code,
    });
    return res.status(500).json({ ok: false, error: "Server error" });
  }

  let aborted = false;
  if (stream) {
    res.setHeader("Content-Type", "application/x-ndjson");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    req.on("close", () => {
      aborted = true;
    });
  }

  try {
    await appendMessage(sessionId, "user", message);

    const fields = extractFieldsFromText(message);
    const intent = classifyIntent(messageLower, fields);

    const factsPromise = getAssistantFacts(12);
    const recentPromise = getRecentMessages(sessionId, 8);

    let docs = [];
    let kbContext = "";
    let usedKb = false;
    let chunkTags = [];

    if (intent.allowRag) {
      try {
        const queryEmbedding = await embedText(message);
        docs = await retrieveKb(queryEmbedding, {
          matchCount: MATCH_COUNT,
          minSimilarity: MIN_SIMILARITY,
          tags: intent.tags,
        });
        if (docs.length) {
          usedKb = true;
          chunkTags = collectChunkTags(docs);
          kbContext = buildContext(docs);
        }
      } catch (error) {
        console.error("[rag] retrieval failed:", {
          message: error?.message,
          details: error?.details ?? error?.detail,
          hint: error?.hint,
          code: error?.code,
        });
      }
    }

    let factsContext = "";
    try {
      const facts = await factsPromise;
      factsContext = buildFactsContext(facts);
    } catch (error) {
      console.error("[assistant_facts] query failed:", {
        message: error?.message,
        details: error?.details ?? error?.detail,
        hint: error?.hint,
        code: error?.code,
      });
    }

    const recent = await recentPromise;
    const metaBase = { usedKb, chunks: usedKb ? chunkTags : [] };

    const sendReply = async (replyText: string, options: { meta?: any; ctaLine?: string } = {}) => {
      const finalReply = clampReply(replyText, options.ctaLine ?? CTA_LINE);
      if (aborted) return;
      await appendMessage(sessionId, "assistant", finalReply);
      const meta = options.meta ?? metaBase;
      if (stream) {
        writeNdjson(res, { type: "final", ok: true, sessionId, reply: finalReply, cta: CTA, meta });
        res.end();
      } else {
        res.json({ ok: true, sessionId, reply: finalReply, cta: CTA, meta });
      }
    };

    if (intent.leadCapture) {
      return sendReply(LEAD_CAPTURE_LINE, { meta: { usedKb: false, chunks: [] } });
    }

    if (intent.redirect) {
      return sendReply(buildRedirectReply(), { meta: { usedKb: false, chunks: [] } });
    }

    if (intent.allowRag && !usedKb) {
      return sendReply(noContextReply(), { meta: { usedKb: false, chunks: [] } });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(sessionGoal
        ? [
            {
              role: "system",
              content: `Known user goal: ${sessionGoal}. Keep answers brief and avoid repeating it.`,
            },
          ]
        : []),
      ...(factsContext ? [{ role: "system", content: `Site facts:\n${factsContext}` }] : []),
      ...(kbContext
        ? [
            { role: "system", content: `Context snippets:\n${kbContext}` },
            {
              role: "system",
              content:
                "Use the KB context only for what's included/not included, process, timeline/response time, pricing, or privacy. Paraphrase and stay concise.",
            },
          ]
        : []),
      ...recent.map((m) => ({ role: m.role, content: m.content })),
    ];

    const completionArgs = {
      model: env.OPENAI_MODEL,
      messages,
      max_completion_tokens: MAX_CHAT_TOKENS,
      temperature: 0.3,
    };

    if (stream) {
      let fullReply = "";
      try {
        const streamResp = await openai.chat.completions.create({
          ...completionArgs,
          stream: true,
        });

        for await (const part of streamResp) {
          if (aborted) break;
          const token = part.choices?.[0]?.delta?.content || "";
          if (!token) continue;
          fullReply += token;
          writeNdjson(res, { type: "token", token });
        }

        const finalReply = clampReply(fullReply || noContextReply());

        if (!aborted) {
          await appendMessage(sessionId, "assistant", finalReply);
          writeNdjson(res, {
            type: "final",
            ok: true,
            sessionId,
            reply: finalReply,
            cta: CTA,
            meta: metaBase,
          });
        }
      } catch (error) {
        console.error("Chat stream error:", error);
        const detail =
          process.env.NODE_ENV !== "production" ? error?.message || String(error) : undefined;
        if (!aborted) {
          writeNdjson(res, { type: "error", ok: false, error: "Server error", detail });
        }
      } finally {
        if (!aborted) res.end();
      }
      return;
    }

    const completion = await openai.chat.completions.create(completionArgs);

    const rawReply = completion.choices?.[0]?.message?.content?.trim() || noContextReply();
    const reply = clampReply(rawReply);
    await appendMessage(sessionId, "assistant", reply);

    res.json({
      ok: true,
      sessionId,
      reply,
      cta: CTA,
      meta: metaBase,
    });
  } catch (err) {
    console.error("Chat error:", err);
    const detail =
      process.env.NODE_ENV !== "production" ? err?.message || String(err) : undefined;
    if (stream) {
      if (!aborted) {
        writeNdjson(res, { type: "error", ok: false, error: "Server error", detail });
        res.end();
      }
      return;
    }
    res.status(500).json({ ok: false, error: "Server error", detail });
  }
});
