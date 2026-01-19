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

export const chatRouter = Router();

const ChatBody = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(1000),
});

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

chatRouter.post("/chat", async (req, res) => {
  const parsed = ChatBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const sessionId = parsed.data.sessionId || randomUUID();
  const message = parsed.data.message.trim();

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

    const queryEmbedding = await embedText(message);
    const docs = await retrieveKb(queryEmbedding, 6);
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
      "Rules: reply under 60 words, ask one question at a time.",
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

    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Could you share a bit more detail?";
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
      retrieved: docs.map((d) => ({ title: d.title, similarity: d.similarity })).slice(0, 6),
    });
  } catch (err) {
    console.error("Chat error:", err);
    const detail =
      process.env.NODE_ENV !== "production" ? err?.message || String(err) : undefined;
    res.status(500).json({ error: "Server error", detail });
  }
});
