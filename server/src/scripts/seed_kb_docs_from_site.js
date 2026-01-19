import "dotenv/config";

import { pool } from "../db/pool.js";
import { logDbTarget, logEnvPresence, logError, logHeader, time } from "./_debug.js";

const docs = [
  {
    title: "7-Day Website Rebuild overview",
    source: "site:hero",
    tags: ["site", "hero", "offer"],
    body: [
      "M. I. Website Rebuilds helps small businesses rebuild outdated websites in 7 days.",
      "The focus is clarity, mobile-first design, and lead-focused messaging.",
      "Goal: make it easy for customers to find and contact the business.",
      'Primary call to action is a "free website review."',
    ].join("\n"),
  },
  {
    title: "Problem signals and outcomes",
    source: "site:problems",
    tags: ["site", "problems", "solutions"],
    body: [
      "Common problem signals: breaks on phones, no clear contact path, slow load times, and DIY fixes that muddy the story.",
      "Rebuild outcomes: a focused layout, performance-first pages, clear messaging, one main action, and optional ongoing support.",
    ].join("\n"),
  },
  {
    title: "What is included in the rebuild",
    source: "site:offer-included",
    tags: ["site", "offer", "included"],
    body: [
      "Included in the 7-day rebuild:",
      "- 5-page modern website",
      "- Mobile-first design and responsive layouts",
      "- Lighthouse > 90 (mobile target)",
      "- Contact form with review CTA",
      "- Basic analytics included",
      "- Domain and hosting setup",
      "- Launch checklist and handoff",
    ].join("\n"),
  },
  {
    title: "What is not included",
    source: "site:offer-excluded",
    tags: ["site", "offer", "excluded"],
    body: [
      "Not included in the standard rebuild scope:",
      "- Custom web apps",
      "- Complex dashboards",
      "- E-commerce with inventory",
      "- Unlimited revisions",
    ].join("\n"),
  },
  {
    title: "7-day rebuild timeline",
    source: "site:timeline",
    tags: ["site", "timeline", "process"],
    body: [
      "Day 1: Plan (audit + kickoff).",
      "Day 3: Build (layout + content).",
      "Day 5: Review (revise + polish).",
      "Day 7: Launch (ship + handoff).",
    ].join("\n"),
  },
  {
    title: "Pricing and care plan",
    source: "site:pricing",
    tags: ["site", "pricing"],
    body: [
      "$500 SPA: high-conversion single-page site for portfolios, creators, and personal brands.",
      "Payment split: $250 upfront, $250 on completion.",
      "$1,000 rebuild: full 7-day rebuild for growing businesses.",
      "Payment split: $500 upfront, $500 on completion.",
      "$100/month care plan: hosting, monitoring, updates, small edits, priority support.",
      "No long-term contracts. Cancel anytime.",
    ].join("\n"),
  },
  {
    title: "Process steps",
    source: "site:process",
    tags: ["site", "process"],
    body: [
      "1) Send your current website and any notes about what is not working today.",
      "2) Rebuild and refine in a focused 7-day sprint.",
      "3) One revision round to keep momentum.",
      "4) Launch and support, including hosting and small edits if needed.",
    ].join("\n"),
  },
  {
    title: "Case study: Howard Motor Co.",
    source: "site:proof",
    tags: ["site", "proof", "case-study"],
    body: [
      "Rebuilt the site for clarity, stronger contact paths, and a mobile-first browsing experience.",
      "Outcomes: clarified the contact path, streamlined navigation, and rebuilt the mobile layout for speed and trust.",
    ].join("\n"),
  },
  {
    title: "Free website review CTA",
    source: "site:cta",
    tags: ["site", "cta", "lead"],
    body: [
      "Share your website for a free review.",
      "Reply includes the biggest friction points and a short action plan.",
      "To get started, ask for business name, website URL, and email.",
    ].join("\n"),
  },
];

async function detectKbDocsColumns() {
  const { rows } = await pool.query(
    `
    select column_name
    from information_schema.columns
    where table_schema='public' and table_name='kb_docs'
    `,
  );
  return new Set(rows.map((r) => r.column_name));
}

async function insertDoc(doc, cols) {
  const insertCols = [];
  const values = [];

  const push = (col, val) => {
    if (!cols.has(col)) return;
    insertCols.push(col);
    values.push(val);
  };

  push("title", doc.title);
  push("body", doc.body);
  if (cols.has("tags")) push("tags", doc.tags ?? null);
  if (cols.has("source")) push("source", doc.source ?? null);
  if (cols.has("updated_at")) push("updated_at", new Date().toISOString());

  if (insertCols.length === 0) {
    throw new Error("kb_docs is missing expected columns (title/body).");
  }

  const placeholders = values.map((_, idx) => `$${idx + 1}`).join(", ");
  const sql = `insert into public.kb_docs (${insertCols.join(", ")}) values (${placeholders})`;
  await pool.query(sql, values);
}

async function run() {
  logHeader("seed:kb");
  logEnvPresence(["DATABASE_URL_POOLER"]);
  logDbTarget("DB TARGET (pooler):", process.env.DATABASE_URL_POOLER);

  const cols = await time("detect kb_docs columns", () => detectKbDocsColumns());
  if (!cols.size) {
    throw new Error("Missing table public.kb_docs. Create it before seeding.");
  }

  await time("seed kb_docs", async () => {
    await pool.query("begin");
    try {
      for (const doc of docs) {
        if (cols.has("source") && doc.source) {
          await pool.query("delete from public.kb_docs where source = $1", [doc.source]);
        } else if (cols.has("title")) {
          await pool.query("delete from public.kb_docs where title = $1", [doc.title]);
        }
        await insertDoc(doc, cols);
      }
      await pool.query("commit");
    } catch (err) {
      await pool.query("rollback");
      throw err;
    }
  });

  console.log(`Seeded ${docs.length} kb_docs rows.`);
}

try {
  await run();
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error("seed_kb_docs_from_site failed");
  logError(err, { label: "seed error" });
  try {
    await pool.end();
  } catch {
    // ignore
  }
  process.exit(1);
}
