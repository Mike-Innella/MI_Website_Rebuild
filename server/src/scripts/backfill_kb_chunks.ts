import "dotenv/config";
import { pool } from "../db/pool.js";
import { embedText, toVectorLiteral } from "../services/embeddings.js";
import { logDbTarget, logEnvPresence, logError, logHeader, time } from "./_debug.js";

function parseIntEnv(key, fallback) {
  const raw = process.env[key];
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) return fallback;
  return n;
}

function chunkText(raw, { maxChars = 1100, overlap = 150 } = {}) {
  const text = String(raw || "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  if (text.length <= maxChars) return [text];

  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(text.length, start + maxChars);
    chunks.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks.filter(Boolean);
}

async function detectKbChunksColumns() {
  const { rows } = await pool.query(
    `
    select column_name
    from information_schema.columns
    where table_schema='public' and table_name='kb_chunks'
    `,
  );
  return new Set(rows.map((r) => r.column_name));
}

async function ensureKbChunksExists() {
  const { rows } = await pool.query(
    `
    select to_regclass('public.kb_chunks') as reg
    `,
  );
  if (!rows?.[0]?.reg) {
    throw new Error(
      "Missing table public.kb_chunks. Create it in Supabase before running backfill.",
    );
  }
}

async function run() {
  logHeader("backfill:chunks");
  logEnvPresence(["DATABASE_URL_POOLER", "OPENAI_API_KEY"]);
  logDbTarget("DB TARGET (pooler):", process.env.DATABASE_URL_POOLER);

  const maxChars = parseIntEnv("RAG_CHUNK_MAX_CHARS", 1100);
  const overlap = parseIntEnv("RAG_CHUNK_OVERLAP_CHARS", 150);
  console.log("chunking:", { maxChars, overlap });

  await ensureKbChunksExists();
  const cols = await detectKbChunksColumns();
  console.log("kb_chunks columns detected:", [...cols].sort());

  const { rows: docs } = await time("load kb_docs", () =>
    pool.query(
    `
    select id, title, body, tags, source
    from public.kb_docs
    order by id asc
    `,
    ),
  );

  if (docs.length === 0) {
    console.log("No kb_docs rows found.");
    return;
  }

  let totalChunks = 0;
  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const title = String(doc.title || "").trim();
    const body = String(doc.body || "").trim();
    const combined = [title, body].filter(Boolean).join("\n\n");

    const chunks = chunkText(combined, { maxChars, overlap });
    await time(`delete chunks doc_id=${doc.id}`, () =>
      pool.query("delete from public.kb_chunks where doc_id = $1", [doc.id]),
    );

    if (chunks.length === 0) {
      console.log(`[${i + 1}/${docs.length}] skip doc_id=${doc.id} (empty)`);
      continue;
    }

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
      const content = chunks[chunkIndex];
      const embedInput = `${doc.title || ""}\n${doc.source || ""}\n\n${content}`.trim();
      const embedding = await time(
        `embed chunk doc_id=${doc.id} idx=${chunkIndex}`,
        () => embedText(embedInput),
      );
      const vector = toVectorLiteral(embedding);

      const insertCols = [];
      const values = [];

      const push = (col, val) => {
        if (!cols.has(col)) return;
        insertCols.push(col);
        values.push(val);
      };

      push("doc_id", doc.id);
      push("chunk_index", chunkIndex);
      if (cols.has("chunk_text")) push("chunk_text", content);
      else push("content", content);
      push("embedding", vector);
      if (cols.has("chunk_title")) push("chunk_title", title);
      else push("title", title);
      push("source", doc.source ?? null);
      push("tags", doc.tags ?? null);

      if (insertCols.length === 0) {
        throw new Error(
          "public.kb_chunks has none of the expected columns (doc_id, chunk_index, chunk_text/content, embedding, chunk_title/title, source, tags).",
        );
      }

      const placeholders = values.map((_, idx) => `$${idx + 1}`).join(", ");
      const sql = `insert into public.kb_chunks (${insertCols.join(
        ", ",
      )}) values (${placeholders})`;

      await time(`insert chunk doc_id=${doc.id} idx=${chunkIndex}`, () =>
        pool.query(sql, values),
      );
      totalChunks += 1;
    }

    console.log(
      `[${i + 1}/${docs.length}] backfilled doc_id=${doc.id} chunks=${chunks.length}`,
    );
  }

  console.log(`Done. Inserted ${totalChunks} chunks.`);
}

try {
  await run();
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error("backfill_kb_chunks failed");
  logError(err, { label: "backfill error" });
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
}
