import "dotenv/config";

import { pool } from "../db/pool.js";
import { logDbTarget, logEnvPresence, logError, logHeader, time } from "./_debug.js";

const facts = [
  {
    fact_key: "brand_name",
    fact_value: "M. I. Website Rebuilds",
    tags: ["brand"],
    priority: 10,
  },
  {
    fact_key: "primary_offer",
    fact_value: "7-day website rebuilds for small businesses.",
    tags: ["offer"],
    priority: 10,
  },
  {
    fact_key: "cta",
    fact_value: 'Single CTA is "free website review."',
    tags: ["cta"],
    priority: 12,
  },
  {
    fact_key: "pricing_spa",
    fact_value: "$500 single-page site. Payment split: $250 upfront and $250 on completion.",
    tags: ["pricing"],
    priority: 20,
  },
  {
    fact_key: "pricing_rebuild",
    fact_value: "$1,000 rebuild. Payment split: $500 upfront and $500 on completion.",
    tags: ["pricing"],
    priority: 20,
  },
  {
    fact_key: "pricing_care_plan",
    fact_value:
      "$100 per month care plan (hosting, monitoring, updates, small edits, priority support). Cancel anytime.",
    tags: ["pricing", "care-plan"],
    priority: 24,
  },
  {
    fact_key: "included",
    fact_value:
      "5-page modern website, mobile-first layout, Lighthouse > 90 (mobile target), contact form with review CTA, basic analytics, domain and hosting setup, launch checklist and handoff.",
    tags: ["included"],
    priority: 30,
  },
  {
    fact_key: "not_included",
    fact_value:
      "Custom web apps, complex dashboards, ecommerce with inventory, and unlimited revisions are out of scope.",
    tags: ["excluded"],
    priority: 40,
  },
  {
    fact_key: "timeline",
    fact_value: "Day 1 plan, Day 3 build, Day 5 review, Day 7 launch and handoff.",
    tags: ["timeline"],
    priority: 30,
  },
  {
    fact_key: "process",
    fact_value:
      "Send current website and notes, rebuild in 7 days, one revision round, launch and support.",
    tags: ["process"],
    priority: 30,
  },
  {
    fact_key: "case_study",
    fact_value:
      "Howard Motor Co.: clarified contact path, streamlined navigation, rebuilt mobile layout.",
    tags: ["proof"],
    priority: 50,
  },
];

async function ensureFactsTable() {
  const { rows } = await pool.query(
    "select to_regclass('public.assistant_facts') as reg",
  );
  if (!rows?.[0]?.reg) {
    throw new Error(
      "Missing table public.assistant_facts. Run server/sql/assistant_facts.sql first.",
    );
  }
}

async function upsertFact(fact) {
  await pool.query(
    `
    insert into public.assistant_facts
      (fact_key, fact_value, tags, source, priority, updated_at)
    values
      ($1, $2, $3, $4, $5, now())
    on conflict (fact_key)
    do update set
      fact_value = excluded.fact_value,
      tags = excluded.tags,
      source = excluded.source,
      priority = excluded.priority,
      updated_at = now()
    `,
    [
      fact.fact_key,
      fact.fact_value,
      fact.tags ?? null,
      fact.source ?? "seed:site",
      fact.priority ?? 100,
    ],
  );
}

async function run() {
  logHeader("seed:facts");
  logEnvPresence(["DATABASE_URL_POOLER"]);
  logDbTarget("DB TARGET (pooler):", process.env.DATABASE_URL_POOLER);

  await time("ensure assistant_facts table", () => ensureFactsTable());

  await time("upsert assistant facts", async () => {
    await pool.query("begin");
    try {
      for (const fact of facts) {
        await upsertFact(fact);
      }
      await pool.query("commit");
    } catch (err) {
      await pool.query("rollback");
      throw err;
    }
  });

  console.log(`Upserted ${facts.length} assistant_facts rows.`);
}

try {
  await run();
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error("seed_assistant_facts failed");
  logError(err, { label: "seed error" });
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
}
