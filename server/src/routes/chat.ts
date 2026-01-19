import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { openai } from "../services/openai.js";
import { embedText } from "../services/embeddings.js";
import { buildContext, retrieveKb } from "../services/rag.js";
import { appendMessage, getOrCreateSession, getRecentMessages } from "../services/sessions.js";
import { extractFieldsFromText } from "../services/leadScoring.js";
import { buildFactsContext, getAssistantFacts } from "../services/assistantFacts.js";
import { getCachedContext, setCachedContext } from "../services/contextCache.js";

export const chatRouter = Router();

const ChatBody = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(1000),
  stream: z.boolean().optional(),
});

const MAX_CHAT_TOKENS = 260;

const faqFallbacks: { test: RegExp; reply: string }[] = [
  {
    test: /how fast|timeline|speed|turnaround/i,
    reply: "We rebuild and relaunch in 7 days: day 1 kickoff, days 2-4 design + copy, days 5-6 build + QA, day 7 launch with analytics and SEO in place.",
  },
  {
    test: /pricing|cost|charge/i,
    reply: "Flat project rate with no retainers. You get design, copy, build, speed/SEO tuning, analytics, and launch support. Share your site and goals and I’ll confirm scope.",
  },
  {
    test: /what'?s included|include|deliverable|scope/i,
    reply: "Included: refreshed design, conversion-focused copy, mobile and speed tuning, on-page SEO, analytics + lead tracking, and launch support. One-week turnaround.",
  },
  {
    test: /how do i start|get started|begin|next step/i,
    reply: "Share your business name, website URL, and best email and I’ll review your site, confirm scope, and lock your 7-day slot.",
  },
];

function pickFaqFallback(message) {
  const hit = faqFallbacks.find(({ test }) => test.test(message));
  return hit?.reply || null;
}

function leadIntentFromFields(fields) {
  const hasWebsite = Boolean(fields.websiteUrl);
  const hasEmail = Boolean(fields.email);
  const hasBusiness = Boolean(fields.businessName);
  if (hasWebsite && hasEmail && hasBusiness) return "ready_to_submit";
  if (!hasEmail) return "collect_email";
  if (!hasWebsite) return "collect_website";
  if (!hasBusiness) return "collect_business";
  return "qualify";
}

function shouldSkipRag(message) {
  const wordCount = message.split(/\s+/).filter(Boolean).length;
  // Only skip for empty inputs; otherwise always retrieve KB for better answers.
  return wordCount === 0 && message.length === 0;
}

function writeNdjson(res, payload) {
  res.write(`${JSON.stringify(payload)}\n`);
}

function replaceVagueReply(reply, message) {
  const trimmed = String(reply || "").trim();
  const needsReplace = /more detail|share.*detail|elaborate/i.test(trimmed);
  if (!needsReplace) return trimmed;
  const faq = pickFaqFallback(message);
  if (faq) return faq;
  return (
    trimmed ||
    "Quick recap: we rebuild your site in 7 days with design, copy, speed/SEO tuning, analytics, and launch support. What’s your site URL so I can tailor the plan?"
  );
}

chatRouter.post("/chat", async (req, res) => {
  const parsed = ChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const sessionId = parsed.data.sessionId || randomUUID();
  const message = parsed.data.message.trim();
  const stream = Boolean(parsed.data.stream);

  try {
    try {
      await getOrCreateSession(sessionId);
    } catch (error) {
      console.error("[chat_sessions] query failed:", {
        message: error?.message,
        details: error?.details ?? error?.detail,
        hint: error?.hint,
        code: error?.code,
      });
      throw error;
    }
    await appendMessage(sessionId, "user", message);

    const factsPromise = getAssistantFacts(18);
    const recentPromise = getRecentMessages(sessionId, 8);

    let docs = [];
    if (!shouldSkipRag(message)) {
      const queryEmbedding = await embedText(message);
      docs = await retrieveKb(queryEmbedding, 8);
    }

    const context = buildContext(docs);

    let facts = [];
    try {
      facts = await factsPromise;
    } catch (error) {
      console.error("[assistant_facts] query failed:", {
        message: error?.message,
        details: error?.details ?? error?.detail,
        hint: error?.hint,
        code: error?.code,
      });
    }
    const factsContext = buildFactsContext(facts);

    const recent = await recentPromise;

    const system = [
      "You are a brief website consultant.",
      "Rules: reply under 80 words, answer the user's question directly with 1-2 concrete specifics from the site facts or knowledge base, then ask one qualifying question.",
      "If the question is unclear, offer a best-effort concise answer plus one clarifying question instead of asking for more detail first.",
      "Do not mention any tech stack or implementation details.",
      "Use the knowledge base context when relevant.",
      'Single CTA: "free website review".',
      "Goal: answer FAQ briefly then qualify for business name, website URL, and email.",
    ].join(" ");

    const messages = [
      { role: "system", content: system },
      ...(factsContext ? [{ role: "system", content: `Site facts:\n${factsContext}` }] : []),
      ...(context ? [{ role: "system", content: `Knowledge base context:\n${context}` }] : []),
      ...recent.map((m) => ({ role: m.role, content: m.content })),
    ];

    const completionArgs = {
      model: env.OPENAI_MODEL,
      messages,
      max_completion_tokens: MAX_CHAT_TOKENS,
    };

    if (stream) {
      res.setHeader("Content-Type", "application/x-ndjson");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      let fullReply = "";
      let aborted = false;
      req.on("close", () => {
        aborted = true;
      });

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

        const faqFallback = pickFaqFallback(message);
        const finalReply = fullReply.trim() || faqFallback || "Could you share a bit more detail?";
        const usableReply = replaceVagueReply(finalReply, message);
        if (!aborted) {
          await appendMessage(sessionId, "assistant", usableReply);
        }

        const extracted = extractFieldsFromText(
          recent.map((m) => m.content).join("\n") + "\n" + message + "\n" + usableReply,
        );
        const suggestedFields = Object.fromEntries(
          Object.entries(extracted).filter(([, v]) => Boolean(v)),
        );
        const leadIntent = leadIntentFromFields(extracted);

        if (!aborted) {
          writeNdjson(res, {
            type: "final",
            sessionId,
            reply: usableReply,
            suggestedFields,
            leadIntent,
            retrieved: docs.map((d) => ({ title: d.title, similarity: d.similarity })).slice(0, 3),
          });
        }
      } catch (error) {
        console.error("Chat stream error:", error);
        const detail =
          process.env.NODE_ENV !== "production" ? error?.message || String(error) : undefined;
        if (!aborted) {
          writeNdjson(res, { type: "error", error: "Server error", detail });
        }
      } finally {
        if (!aborted) res.end();
      }
      return;
    }

    const completion = await openai.chat.completions.create(completionArgs);

    const faqFallback = pickFaqFallback(message);

    const rawReply =
      completion.choices?.[0]?.message?.content?.trim() || faqFallback || "Could you share a bit more detail?";
    const reply = replaceVagueReply(rawReply, message);
    await appendMessage(sessionId, "assistant", reply);

    const extracted = extractFieldsFromText(
      recent.map((m) => m.content).join("\n") + "\n" + message + "\n" + reply,
    );

    const suggestedFields = Object.fromEntries(
      Object.entries(extracted).filter(([, v]) => Boolean(v)),
    );

    const leadIntent = leadIntentFromFields(extracted);

    res.json({
      sessionId,
      reply,
      suggestedFields,
      leadIntent,
      retrieved: docs.map((d) => ({ title: d.title, similarity: d.similarity })).slice(0, 3),
    });
  } catch (err) {
    console.error("Chat error:", err);
    const detail =
      process.env.NODE_ENV !== "production" ? err?.message || String(err) : undefined;
    res.status(500).json({ error: "Server error", detail });
  }
});
