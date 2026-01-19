import { pool } from "../db/pool.js";

let hasFactsTable = null;

async function detectFactsTable() {
  if (hasFactsTable != null) return hasFactsTable;
  const { rows } = await pool.query(
    "select to_regclass('public.assistant_facts') as reg",
  );
  hasFactsTable = Boolean(rows?.[0]?.reg);
  return hasFactsTable;
}

export async function getAssistantFacts(limit = 18) {
  const exists = await detectFactsTable();
  if (!exists) return [];

  const lim = Math.max(1, Math.min(50, Number(limit) || 18));
  const { rows } = await pool.query(
    `
    select fact_key, fact_value, tags, source, priority
    from public.assistant_facts
    order by priority asc, updated_at desc
    limit $1
    `,
    [lim],
  );
  return Array.isArray(rows) ? rows : [];
}

export function buildFactsContext(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "";

  return rows
    .map((row) => {
      const key = String(row.fact_key || "").trim();
      const value = String(row.fact_value || "")
        .replace(/\s+/g, " ")
        .trim();
      const trimmed = value.length > 240 ? `${value.slice(0, 237)}...` : value;
      return `- ${key ? `${key}: ` : ""}${trimmed}`;
    })
    .join("\n");
}
