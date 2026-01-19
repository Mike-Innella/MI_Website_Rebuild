import "dotenv/config";
import { env } from "../config/env.js";
import { pool } from "../db/pool.js";
import { embedText, toVectorLiteral } from "../services/embeddings.js";
import { logDbTarget, logEnvPresence, logError, logHeader, time } from "./_debug.js";

async function run() {
  logHeader("embed");
  logEnvPresence(["DATABASE_URL_POOLER", "OPENAI_API_KEY"]);
  logDbTarget("DB TARGET (pooler):", process.env.DATABASE_URL_POOLER);

  const { rows } = await time("load kb_docs needing embeddings", () =>
    pool.query(
      "select id, title, body from public.kb_docs where embedding is null order by id asc",
    ),
  );

  if (rows.length === 0) {
    console.log("No kb_docs rows need embeddings.");
    return;
  }

  console.log(
    `Embedding ${rows.length} kb_docs rows using ${env.OPENAI_EMBED_MODEL}...`,
  );

  let i = 0;
  for (const row of rows) {
    i += 1;
    const text = `${row.title || ""}\n${row.body || ""}`.trim();
    if (!text) {
      console.log(`[${i}/${rows.length}] skip id=${row.id} (empty text)`);
      continue;
    }

    const embedding = await time(`embedText id=${row.id}`, () => embedText(text));
    const vector = toVectorLiteral(embedding);

    await time(`update kb_docs id=${row.id}`, () =>
      pool.query(
        "update public.kb_docs set embedding = $1::vector where id = $2",
        [vector, row.id],
      ),
    );

    console.log(`[${i}/${rows.length}] embedded id=${row.id}`);
  }
}

try {
  await run();
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error("embed_kb_docs failed:", err?.message || err);
  logError(err, { label: "embed error" });
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
}
