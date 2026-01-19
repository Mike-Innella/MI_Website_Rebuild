import "dotenv/config";
import { pool } from "../db/pool.js";
import { logDbTarget, logEnvPresence, logError, logHeader, time } from "./_debug.js";

try {
  logHeader("test:rag:db");
  logEnvPresence(["DATABASE_URL_POOLER", "DATABASE_URL_DIRECT"]);
  logDbTarget("DB TARGET (pooler):", process.env.DATABASE_URL_POOLER);

  const { rows: selfRows } = await time("self similarity query", () =>
    pool.query(
    `
    select
      id,
      title,
      (1 - (embedding <=> embedding))::float8 as similarity
    from public.kb_docs
    where embedding is not null
    order by id
    limit 10
    `,
    ),
  );

  console.log(`Self-similarity rows: ${selfRows.length}`);
  for (const row of selfRows) {
    console.log(`- id=${row.id} | ${row.title} (similarity=${row.similarity})`);
  }

  const { rows: matchRows } = await time("call match_kb_docs()", () =>
    pool.query(
    `
    select *
    from public.match_kb_docs(
      (select embedding from public.kb_docs where id = 1)::vector,
      4
    )
    `,
    ),
  );

  console.log(`\nmatch_kb_docs(id=1 embedding) returned: ${matchRows.length}`);
  for (const row of matchRows) {
    const title = row.title ?? row.doc_title ?? row.name ?? "(untitled)";
    const similarity =
      row.similarity ?? row.score ?? row.match_similarity ?? row.distance;
    console.log(`- ${title} (similarity=${similarity})`);
  }

  await pool.end();
  process.exit(0);
} catch (err) {
  console.error("test_db_match_self failed");
  logError(err, { label: "db error" });
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
}
