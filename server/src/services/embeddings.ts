import { env } from "../config/env.js";
import { openai } from "./openai.js";

export async function embedText(text) {
  const input = String(text || "").trim();
  if (!input) throw new Error("embedText: empty input");

  const res = await openai.embeddings.create({
    model: env.OPENAI_EMBED_MODEL,
    input,
  });

  const embedding = res.data?.[0]?.embedding;
  if (!Array.isArray(embedding)) throw new Error("embedText: missing embedding");
  return embedding;
}

export function toVectorLiteral(embedding) {
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("toVectorLiteral: invalid embedding");
  }
  return `[${embedding.map((v) => Number(v).toString()).join(",")}]`;
}

