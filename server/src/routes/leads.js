import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { pool } from "../db/pool.js";
import { openai } from "../services/openai.js";
import { getRecentMessages } from "../services/sessions.js";

export const leadsRouter = Router();

const LeadsBody = z.object({
  sessionId: z.string().uuid(),
  name: z.string().min(1).max(120).optional(),
  businessName: z.string().min(1).max(200),
  websiteUrl: z.string().url(),
  email: z.string().email(),
  notes: z.string().max(2000).optional(),
});

async function maybeMakeTranscriptSummary(sessionId) {
  try {
    const recent = await getRecentMessages(sessionId, 12);
    const transcript = recent
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n")
      .slice(0, 4000);

    if (!transcript.trim()) return null;

    const res = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Summarize the chat in 1-2 short sentences for internal lead notes. Do not include sensitive data beyond what the user shared.",
        },
        { role: "user", content: transcript },
      ],
    });
    return res.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

leadsRouter.post("/leads", async (req, res) => {
  const parsed = LeadsBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { sessionId, name, businessName, websiteUrl, email, notes } = parsed.data;

  try {
    const transcriptSummary = await maybeMakeTranscriptSummary(sessionId);

    const { rows } = await pool.query(
      "insert into public.leads (session_id, name, business_name, website_url, email, notes, transcript_summary) values ($1,$2,$3,$4,$5,$6,$7) returning id",
      [sessionId, name || null, businessName, websiteUrl, email, notes || null, transcriptSummary],
    );

    res.json({ ok: true, leadId: rows[0]?.id });
  } catch (err) {
    console.error("Leads error:", err);
    const detail =
      process.env.NODE_ENV !== "production" ? err?.message || String(err) : undefined;
    res.status(500).json({ ok: false, detail });
  }
});
