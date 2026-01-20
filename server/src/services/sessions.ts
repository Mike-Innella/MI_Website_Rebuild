import { pool } from "../db/pool.js";

let ensuredSessionGoalColumn = false;
let ensuredLeadColumns = false;

async function ensureGoalColumn() {
  if (ensuredSessionGoalColumn) return;
  await pool.query("alter table public.chat_sessions add column if not exists goal text");
  ensuredSessionGoalColumn = true;
}

async function ensureLeadColumns() {
  if (ensuredLeadColumns) return;

  await pool.query("alter table public.chat_sessions add column if not exists lead_score int4");
  await pool.query("alter table public.chat_sessions add column if not exists lead_signals text[]");
  await pool.query("alter table public.chat_sessions add column if not exists is_lead boolean");
  await pool.query(
    "alter table public.chat_sessions add column if not exists lead_first_seen_at timestamptz",
  );
  await pool.query(
    "alter table public.chat_sessions add column if not exists lead_email_sent_at timestamptz",
  );

  ensuredLeadColumns = true;
}

export async function getOrCreateSession(sessionId) {
  if (!sessionId) throw new Error("sessionId required");

  await ensureGoalColumn();

  const existing = await pool.query(
    "select session_id, goal from public.chat_sessions where session_id = $1 limit 1",
    [sessionId],
  );
  if (existing.rowCount > 0) {
    return { id: existing.rows[0].session_id, goal: existing.rows[0].goal || null };
  }

  const created = await pool.query(
    "insert into public.chat_sessions (session_id) values ($1) returning session_id, goal",
    [sessionId],
  );
  return { id: created.rows[0].session_id, goal: created.rows[0].goal || null };
}

export async function appendMessage(sessionId, role, content) {
  await pool.query(
    "insert into public.chat_messages (session_id, role, content) values ($1, $2, $3)",
    [sessionId, role, content],
  );
}

export async function getRecentMessages(sessionId, limit = 8) {
  const lim = Math.max(1, Math.min(20, Number(limit) || 8));
  const { rows } = await pool.query(
    "select role, content, created_at from public.chat_messages where session_id = $1 order by created_at desc limit $2",
    [sessionId, lim],
  );
  return rows.reverse().map((r) => ({
    role: r.role,
    content: r.content,
    created_at: r.created_at,
  }));
}

export async function upsertChatSession(sessionId, data) {
  if (!data || typeof data !== "object") return;
  await ensureGoalColumn();
  const updates = [];
  const values = [];
  let idx = 1;

  if (data.goal !== undefined) {
    updates.push(`goal = $${idx++}`);
    values.push(data.goal);
  }

  if (updates.length === 0) return;

  values.push(sessionId);
  await pool.query(
    `update public.chat_sessions set ${updates.join(", ")} where session_id = $${idx}`,
    values,
  );
}

export async function markSessionLead(
  sessionId: string,
  data: { score: number; signals: string[] },
) {
  await ensureLeadColumns();

  const score = Number(data?.score || 0);
  const signals = Array.isArray(data?.signals) ? data.signals : [];

  if (!sessionId) throw new Error("sessionId required");
  if (score <= 0 && signals.length === 0) {
    return { becameLeadNow: false };
  }

  const result = await pool.query(
    `
    update public.chat_sessions
    set
      lead_score = greatest(coalesce(lead_score, 0), $2),
      lead_signals = (
        select array(
          select distinct unnest(coalesce(lead_signals, '{}'::text[]) || $3::text[])
        )
      ),
      is_lead = case
        when greatest(coalesce(lead_score, 0), $2) >= 3 then true
        else coalesce(is_lead, false)
      end,
      lead_first_seen_at = case
        when coalesce(is_lead, false) = false and greatest(coalesce(lead_score, 0), $2) >= 3
          then now()
        else lead_first_seen_at
      end
    where session_id = $1
    returning is_lead, lead_first_seen_at, lead_email_sent_at
    `,
    [sessionId, score, signals],
  );

  const row = result.rows?.[0];
  const isLead = Boolean(row?.is_lead);
  const firstSeen = row?.lead_first_seen_at as string | null;
  const emailSent = row?.lead_email_sent_at as string | null;

  const becameLeadNow = isLead && Boolean(firstSeen) && !emailSent;
  return { becameLeadNow };
}

export async function markLeadEmailSent(sessionId: string) {
  await ensureLeadColumns();
  await pool.query(
    `update public.chat_sessions set lead_email_sent_at = coalesce(lead_email_sent_at, now()) where session_id = $1`,
    [sessionId],
  );
}
