import { pool } from "../db/pool.js";

let ensuredSessionGoalColumn = false;

async function ensureGoalColumn() {
  if (ensuredSessionGoalColumn) return;
  await pool.query("alter table public.chat_sessions add column if not exists goal text");
  ensuredSessionGoalColumn = true;
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
