import nodemailer from "nodemailer";
import { env } from "../config/env.js";

type LeadAlertPayload = {
  sessionId: string;
  score: number;
  signals: string[];
  fields?: {
    email?: string;
    websiteUrl?: string;
    businessName?: string;
    name?: string;
  };
  preview?: string;
};

function hasSmtpConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!hasSmtpConfigured()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendLeadAlertEmail(payload: LeadAlertPayload) {
  try {
    const to = env.LEAD_ALERT_EMAIL;
    const from = env.EMAIL_FROM || "Relay <no-reply@yourdomain.com>";

    if (!to) {
      console.warn("[lead-email] LEAD_ALERT_EMAIL missing; skipping send");
      return false;
    }

    const tx = getTransporter();
    if (!tx) {
      console.warn("[lead-email] SMTP not configured; skipping send");
      return false;
    }

    const subject = `Relay lead flagged (score ${payload.score})`;

    const lines: string[] = [];
    lines.push(`Session: ${payload.sessionId}`);
    lines.push(`Score: ${payload.score}`);
    lines.push(`Signals: ${(payload.signals || []).join(", ") || "none"}`);
    lines.push("");
    if (payload.fields?.businessName) lines.push(`Business: ${payload.fields.businessName}`);
    if (payload.fields?.name) lines.push(`Name: ${payload.fields.name}`);
    if (payload.fields?.email) lines.push(`Email: ${payload.fields.email}`);
    if (payload.fields?.websiteUrl) lines.push(`Website: ${payload.fields.websiteUrl}`);
    if (payload.preview) {
      lines.push("");
      lines.push("Message preview:");
      lines.push(payload.preview);
    }

    await tx.sendMail({
      from,
      to,
      subject,
      text: lines.join("\n"),
    });

    console.log("[lead-email] sent", { sessionId: payload.sessionId, score: payload.score });
    return true;
  } catch (err: any) {
    console.error("[lead-email] failed", { message: err?.message });
    return false;
  }
}
