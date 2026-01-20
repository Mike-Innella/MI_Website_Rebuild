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
  markLeadEmailSent,
  markSessionLead,
} from "../services/sessions.js";
import { detectLeadSignals } from "../services/leadSignals.js";
import { sendLeadAlertEmail } from "../services/mailer.js";

export const chatRouter = Router();

const ChatBody = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(800),
  pagePath: z.string().max(120).optional(),
  stream: z.boolean().optional(),
});

const SYSTEM_PROMPT = [
  "You are Relay, a concise business-only assistant for a website rebuild service.",
  "Answer only business questions about offers, pricing ranges, timelines/process, support plans, policies, and how to contact the team.",
  "Politely refuse website reviews or audits and restate that you only provide business info.",
  "Do not sell or push scheduling, demos, or forms; keep a neutral, helpful tone.",
  "Keep replies short (2-6 sentences) and paraphrase any provided context without bullet lists unless explicitly requested.",
].join(" ");
const BASELINE_CONTEXT = [
  "Service: 5-page business website rebuilds focused on clarity, credibility, and conversion.",
  "Delivery: Typical turnaround is 7 days.",
  "Pricing: Most projects land between $1,000-$1,500; pricing floors pre-qualify serious projects.",
  "Support: Optional ongoing support at $100/month covering hosting and small content/text updates.",
  "Process: 1) Audit your current site, 2) Rewrite structure and messaging, 3) Rebuild with conversion focus, 4) Launch with analytics in place.",
].join("\n");
const REVIEW_REFUSAL =
  "I can't review websites or judge design quality. I only cover business details like offers, pricing ranges, timelines, support, and policies.";
const FALLBACK_REPLY =
  "I can help with your website rebuild—scope, pricing, timeline, support, and policies. What do you want to know?";
const OFFTOPIC_REPLY =
  "I only handle questions about the website rebuild—scope, pricing, timeline, support, or policies. I can't help with unrelated topics.";
const REVIEW_PATTERNS =
  /\b(review|audit|critique|look at (my|our) site|look at my website|assess my website)\b/i;
const MAX_CHAT_TOKENS = 180;
const MATCH_COUNT = 6;
const MIN_SIMILARITY = 0.0;

function writeNdjson(res, payload) {
  res.write(`${JSON.stringify(payload)}\n`);
}

function normalizeReply(reply: string) {
  const normalized = String(reply || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const sentences = normalized.match(/[^.!?]+[.!?]?/g) || [normalized];
  const limited = sentences.slice(0, 6).join(" ").trim();
  return limited.length > 720 ? `${limited.slice(0, 700).trim().replace(/[.!?]*$/, "")}.` : limited;
}

function collectChunkTags(docs) {
  const tags = docs
    .flatMap((doc) => (Array.isArray(doc.tags) ? doc.tags : []))
    .filter((tag) => typeof tag === "string");
  return Array.from(new Set(tags));
}

const SPECIFICITY_RULES = [
  { topic: "pricing", test: /price|pricing|cost|budget|quote|estimate/i },
  { topic: "timeline", test: /timeline|turnaround|how fast|deadline|how long|lead time/i },
  { topic: "stack", test: /\bstack\b|tech stack|technology|framework|react|next\.?js?|supabase|postgres|openai/i },
  { topic: "scope", test: /include|included|scope|deliverables?|pages?|what's included|what is included/i },
  { topic: "support", test: /support|maintenance|updates|hosting|care plan/i },
  { topic: "policy", test: /privacy|gdpr|data policy|terms|refund|guarantee/i },
  { topic: "start", test: /how do i start|how to start|get started|next steps|kickoff|begin/i },
];

function detectSpecificity(message: string) {
  const lower = String(message || "");
  const hits = SPECIFICITY_RULES.filter(({ test }) => test.test(lower)).map((r) => r.topic);
  return { forceKb: hits.length > 0, topics: Array.from(new Set(hits)) };
}

function isGreeting(message: string) {
  const normalized = String(message || "").trim().toLowerCase();
  if (normalized.length > 24) return false;
  return /^(hi|hello|hey|yo|howdy|sup|hola|hiya)\b/.test(normalized);
}

function shouldOfferForm(message: string, specificity: { forceKb: boolean; topics: string[] }) {
  const lower = String(message || "").toLowerCase();
  if (specificity.topics.includes("start")) return true;
  if (/\b(next steps?|how do i start|how to start|how to proceed|ready to start|let'?s go|proceed|get started)\b/i.test(lower))
    return true;
  return false;
}

function buildSpecificReply(topics: string[]) {
  const set = new Set(topics || []);
  if (set.has("pricing")) {
    return "Most 5-page rebuilds land around $1,000–$1,500 with a ~7-day turnaround. Optional support is $100/month for hosting plus small text/content updates.";
  }
  if (set.has("scope")) {
    return "Scope: 5-page business site rebuilt for clarity and conversion. Includes an audit of your current site, rewritten structure/messaging, the rebuild itself, and launch with analytics. Optional support is $100/month for hosting and small updates.";
  }
  if (set.has("timeline")) {
    return "Turnaround is typically ~7 days after kickoff. The workflow is audit → rewrite structure/messaging → rebuild → launch with analytics. Optional support is $100/month for hosting and small updates.";
  }
  if (set.has("support")) {
    return "Ongoing support is optional at $100/month; it covers hosting and small text/content updates. The core rebuild is a 5-page site delivered in about 7 days.";
  }
  if (set.has("policy")) {
    return "I can share business details like scope, pricing, and timeline. If you need specifics on privacy or data handling, let me know and I’ll outline what’s available.";
  }
  if (set.has("stack")) {
    return "I focus on delivering a fast, conversion-oriented 5-page site in ~7 days. If you need stack specifics, I can confirm them, but most clients just want the outcome: clearer messaging, faster load, and analytics in place.";
  }
  if (set.has("start")) {
    return "To start, share your business name, site URL, and goals. I’ll audit your current site, rewrite the structure and messaging, rebuild a 5-page site for clarity and conversion, then launch with analytics—usually in about 7 days.";
  }
  return FALLBACK_REPLY;
}

function isOnTopic(message: string, usedKb: boolean, specificity: { forceKb: boolean; topics: string[] }) {
  if (usedKb || specificity.forceKb) return true;
  const lower = String(message || "");
  return /\b(site|website|rebuild|page|pricing|price|cost|timeline|turnaround|process|support|hosting|policy|privacy|start|kickoff|scope|deliverable|stack|tech)\b/i.test(
    lower,
  );
}

chatRouter.post("/chat", async (req, res) => {
  const parsed = ChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid input" });
  }

  const sessionId = parsed.data.sessionId || randomUUID();
  const message = parsed.data.message.trim();
  const streamRequested = Boolean(parsed.data.stream);
  const stream = false; // disable streaming to avoid chunk issues; client handles JSON fallback
  const specificity = detectSpecificity(message);
  const greeting = isGreeting(message);

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
    await getOrCreateSession(sessionId);
    await appendMessage(sessionId, "user", message);
  } catch (error) {
    console.error("[chat_sessions] query failed:", {
      message: error?.message,
      details: error?.details ?? error?.detail,
      hint: error?.hint,
      code: error?.code,
    });
    if (stream) {
      writeNdjson(res, { type: "error", ok: false, error: "Server error" });
      res.end();
      return;
    }
    return res.status(500).json({ ok: false, error: "Server error" });
  }

  const recentPromise = getRecentMessages(sessionId, 20);

  let usedKb = false;
  let chunkTags: string[] = [];
  let kbContext = "";

  if (!greeting) {
    try {
      const queryEmbedding = await embedText(message);
      const docs = await retrieveKb(queryEmbedding, {
        matchCount: MATCH_COUNT,
        minSimilarity: MIN_SIMILARITY,
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

  if (!usedKb && specificity.forceKb) {
    try {
      const queryEmbedding = await embedText(message);
      const docs = await retrieveKb(queryEmbedding, {
        matchCount: MATCH_COUNT + 2,
        minSimilarity: null,
      });
      if (docs.length) {
        usedKb = true;
        chunkTags = collectChunkTags(docs);
        kbContext = buildContext(docs);
      }
    } catch (error) {
      console.error("[rag] secondary retrieval failed:", {
        message: error?.message,
        details: error?.details ?? error?.detail,
        hint: error?.hint,
        code: error?.code,
      });
    }
  }

  const recent = await recentPromise;
  const userQuestionCount = recent.filter((m) => m.role === "user").length;
  const lead = detectLeadSignals(message);
  let leadScore = lead.score;
  let leadSignals = [...lead.signals];

  if (userQuestionCount >= 3) {
    leadScore += 2;
    leadSignals = Array.from(new Set([...leadSignals, "multi_question"]));
  }

  if (leadScore >= 3) {
    console.log("[lead] lead candidate", { sessionId, leadScore, leadSignals, fields: lead.fields });
    markSessionLead(sessionId, { score: leadScore, signals: leadSignals })
      .then(async ({ becameLeadNow }) => {
        if (!becameLeadNow) return;
        const sent = await sendLeadAlertEmail({
          sessionId,
          score: leadScore,
          signals: leadSignals,
          fields: lead.fields,
          preview: message.slice(0, 280),
        });
        if (sent) {
          await markLeadEmailSent(sessionId);
        } else {
          console.warn("[lead-email] send skipped or failed; not marking sent", {
            sessionId,
            leadScore,
          });
        }
      })
      .catch((err) => console.error("[lead] mark/email failed", err?.message));
  }

  const metaBase = { usedKb, chunks: usedKb ? chunkTags : [] };
  const offerForm = shouldOfferForm(message, specificity);

  const sendReply = async (replyText: string, meta = metaBase) => {
    let finalReply = normalizeReply(replyText || FALLBACK_REPLY);
    if (
      (replyText === FALLBACK_REPLY || finalReply.includes("Here are the basics")) &&
      specificity.topics.length > 0
    ) {
      finalReply = normalizeReply(buildSpecificReply(specificity.topics));
    }
    if (offerForm && !/review form/i.test(finalReply)) {
      const spacer = finalReply.endsWith(".") ? " " : ". ";
      finalReply = `${finalReply}${spacer}If you want to proceed, I can point you to the quick review form.`;
    }
    if (aborted) return;
    await appendMessage(sessionId, "assistant", finalReply);
    if (stream) {
      writeNdjson(res, { type: "final", ok: true, sessionId, reply: finalReply, meta });
      res.end();
    } else {
      res.json({ ok: true, sessionId, reply: finalReply, meta });
    }
  };

  if (greeting && !specificity.forceKb && specificity.topics.length === 0) {
    return sendReply(
      "Hey! I can cover your website rebuild questions—what’s included, pricing, timelines, support, or policies. What should we start with?",
      { usedKb: false, chunks: [] },
    );
  }

  if (!isOnTopic(message, usedKb, specificity)) {
    return sendReply(OFFTOPIC_REPLY, { usedKb: false, chunks: [] });
  }

  if (REVIEW_PATTERNS.test(message)) {
    return sendReply(`${REVIEW_REFUSAL} What business details can I clarify?`, {
      usedKb: false,
      chunks: [],
    });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: `Baseline business details:\n${BASELINE_CONTEXT}` },
    ...(kbContext ? [{ role: "system", content: `Context snippets:\n${kbContext}` }] : []),
    ...recent.map((m) => ({ role: m.role, content: m.content })),
  ];

  const completionArgs = {
    model: env.OPENAI_MODEL,
    messages,
    max_completion_tokens: MAX_CHAT_TOKENS,
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

      let finalReply = normalizeReply(fullReply || FALLBACK_REPLY);
      if (
        (fullReply === FALLBACK_REPLY || finalReply.includes("Here are the basics")) &&
        specificity.topics.length > 0
      ) {
        finalReply = normalizeReply(buildSpecificReply(specificity.topics));
      }

      if (!aborted) {
        const replyWithForm =
          offerForm && !/review form/i.test(finalReply)
            ? `${finalReply}${finalReply.endsWith(".") ? " " : ". "}If you want to proceed, I can point you to the quick review form.`
            : finalReply;
        await appendMessage(sessionId, "assistant", replyWithForm);
        writeNdjson(res, {
          type: "final",
          ok: true,
          sessionId,
          reply: replyWithForm,
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

  try {
    const completion = await openai.chat.completions.create(completionArgs);
    const rawReply = completion.choices?.[0]?.message?.content?.trim() || FALLBACK_REPLY;
    let reply = normalizeReply(rawReply);
    if (
      (rawReply === FALLBACK_REPLY || reply.includes("Here are the basics")) &&
      specificity.topics.length > 0
    ) {
      reply = normalizeReply(buildSpecificReply(specificity.topics));
    }
    if (offerForm && !/review form/i.test(reply)) {
      reply = `${reply}${reply.endsWith(".") ? " " : ". "}If you want to proceed, I can point you to the quick review form.`;
    }
    await appendMessage(sessionId, "assistant", reply);

    res.json({
      ok: true,
      sessionId,
      reply,
      meta: metaBase,
    });
  } catch (err) {
    console.error("Chat error:", err);
    const detail = process.env.NODE_ENV !== "production" ? err?.message || String(err) : undefined;
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
