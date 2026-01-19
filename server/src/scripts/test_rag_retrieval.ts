// src/scripts/test_rag_retrieval.js
import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { embedText } from "../services/embeddings.js";
import { logEnvPresence, logError, logHeader, maskValue, time } from "./_debug.js";

const TEST_QUERY = "How much does it cost?";

function requireEnv(key) {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

function logTarget() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const usingKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "SUPABASE_SERVICE_ROLE_KEY"
      : process.env.SUPABASE_ANON_KEY
        ? "SUPABASE_ANON_KEY"
        : "MISSING_KEY";

  console.log("RAG TARGET (HTTPS RPC):", {
    url: supabaseUrl || "(missing SUPABASE_URL)",
    using: usingKey,
    keyMasked: maskValue(
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
    ),
    note: "This avoids direct Postgres (5432) entirely.",
  });
}

(async () => {
  logHeader("test:rag:docs (HTTPS)");
  logEnvPresence([
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ANON_KEY",
    "OPENAI_API_KEY",
  ]);
  logTarget();

  const supabaseUrl = requireEnv("SUPABASE_URL");

  // Prefer service role for server-side scripts (recommended).
  // Fallback to anon if you REALLY want, but you must have RLS policies that allow the RPC.
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (recommended for server scripts) or SUPABASE_ANON_KEY (requires permissive RLS).",
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // 1) Build embedding
    const embedding = await time("embedText()", () => embedText(TEST_QUERY));
    console.log("Embedding length:", embedding?.length);
    console.log("Embedding first 8:", embedding?.slice?.(0, 8));
    console.log("Any non-finite:", embedding?.some?.((n) => !Number.isFinite(n)));

    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error("embedText() did not return a valid embedding array.");
    }

    // 2) Quick sanity: can we read doc counts via PostgREST?
    // NOTE: This will be blocked if RLS is enabled and your key/policies don't allow it.
    // It's optional; failure here doesn't necessarily mean RPC won't work if RPC is SECURITY DEFINER.
    try {
      const { count, error: countErr } = await supabase
        .from("kb_docs")
        .select("*", { count: "exact", head: true });

      if (countErr) throw countErr;
      console.log("SANITY kb_docs count:", count);
    } catch (e) {
      console.log(
        "SANITY kb_docs count skipped (likely RLS / permissions):",
        e?.message || e,
      );
    }

    // 3) Call RPC: public.match_kb_docs(query_embedding vector(1536), match_count int, filter_source text, filter_tags text[])
    // This assumes you've created the RPC function in Supabase SQL editor.
    const { data, error } = await time("rpc match_kb_docs()", () =>
      supabase.rpc("match_kb_docs", {
      query_embedding: embedding,
      match_count: 3,
      filter_source: null,
      filter_tags: null,
      }),
    );

    if (error) {
      console.error("RPC error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    const rows = Array.isArray(data) ? data : [];
    console.log(`Query: ${TEST_QUERY}`);
    console.log(`Matches returned: ${rows.length}`);

    for (const row of rows) {
      const title = row.title ?? row.doc_title ?? row.name ?? "(untitled)";
      const similarity =
        row.similarity ?? row.score ?? row.match_similarity ?? row.distance;
      console.log(`- ${title} (similarity=${similarity})`);
    }

    process.exit(0);
  } catch (err) {
    console.error("test_rag_retrieval failed");
    logError(err, { label: "supabase error" });

    // Supabase-js error shape is different than pg errors; log what we can.
    if (err?.code || err?.details || err?.hint) {
      console.error("Supabase error details:", {
        code: err.code,
        details: err.details,
        hint: err.hint,
        message: err.message,
      });
    }

    process.exit(1);
  }
})();
