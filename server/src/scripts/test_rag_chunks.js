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

function getMinSimilarity() {
  const raw = process.env.RAG_MIN_SIMILARITY;
  if (raw == null || String(raw).trim() === "") return -1.0;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`Invalid RAG_MIN_SIMILARITY: ${raw}`);
  return n;
}

function getSimilarityValue(row) {
  const v = row?.similarity ?? row?.match_similarity ?? row?.score ?? row?.distance;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function run() {
  logHeader("test:rag (chunks via HTTPS)");
  logEnvPresence(["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_API_KEY"]);

  const supabaseUrl = requireEnv("SUPABASE_URL");
  const supabaseKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const minSimilarity = getMinSimilarity();
  console.log("SUPABASE:", {
    url: supabaseUrl,
    keyMasked: maskValue(supabaseKey),
  });
  console.log("RAG:", { min_similarity: minSimilarity });
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const embedding = await time("embedText()", () => embedText(TEST_QUERY));

  const callChunks = async (fn) => {
    const chunkRpcPayload = {
      query_embedding: embedding,
      match_count: 6,
      min_similarity: minSimilarity,
      filter_source: null,
      filter_tags: null,
    };
    console.log("rpc payload (match_kb_chunks):", {
      query_embedding_len: Array.isArray(embedding) ? embedding.length : null,
      match_count: chunkRpcPayload.match_count,
      min_similarity: chunkRpcPayload.min_similarity,
      filter_source: chunkRpcPayload.filter_source,
      filter_tags: chunkRpcPayload.filter_tags,
    });
    return time(`rpc ${fn}()`, () => supabase.rpc(fn, chunkRpcPayload));
  };

  let chunkRes = await callChunks("match_kb_chunks");

  console.log("chunkRes.data debug:", {
    typeof: typeof chunkRes?.data,
    isArray: Array.isArray(chunkRes?.data),
    firstKeys: Array.isArray(chunkRes?.data) ? Object.keys(chunkRes.data[0] || {}) : null,
  });
  let rows = [];
  let using = "match_kb_chunks";

  const chunkRows = Array.isArray(chunkRes.data) ? chunkRes.data : [];
  const hasChunks = Array.isArray(chunkRows) && chunkRows.length > 0;
  console.log("chunkRows length:", chunkRows?.length ?? 0);
  if (chunkRes.error) {
    console.log("chunkRes.error:", chunkRes.error);
    throw chunkRes.error;
  }

  if (hasChunks) {
    const sims = chunkRows.map(getSimilarityValue).filter((n) => n != null);
    if (sims.length) {
      console.log("chunkRows similarity:", {
        min: Math.min(...sims),
        max: Math.max(...sims),
      });
    } else {
      console.log("chunkRows similarity:", { min: null, max: null });
    }

    const applyCutoff = Number.isFinite(minSimilarity) && minSimilarity > -1.0;
    const filteredChunkRows = applyCutoff
      ? chunkRows.filter((r) => {
          const s = getSimilarityValue(r);
          return s != null && s >= minSimilarity;
        })
      : chunkRows;
  if (applyCutoff) {
      console.log("chunkRows cutoff:", {
        min_similarity: minSimilarity,
        before: chunkRows.length,
        after: filteredChunkRows.length,
      });
    }

    using = "match_kb_chunks";
    rows = filteredChunkRows.map((r) => ({
      chunk_id: r.chunk_id,
      doc_id: r.doc_id,
      chunk_index: r.chunk_index,
      similarity: r.similarity ?? r.match_similarity ?? r.score ?? r.distance,
      chunk_text: r.chunk_text,
      title: r.title,
      source: r.source,
      tags: r.tags,
    }));
  }

  console.log(`Query: ${TEST_QUERY}`);
  console.log(`RPC used: ${using}`);
  console.log(`Matches returned: ${rows.length}`);
  for (const row of rows) {
    const sim = row.similarity ?? row.match_similarity ?? row.score ?? row.distance;
    const preview = String(row.chunk_text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);
    console.log(
      `- doc_id=${row.doc_id ?? "?"} chunk=${row.chunk_index ?? "?"} similarity=${sim} :: ${preview}`,
    );
  }
}

try {
  await run();
  process.exit(0);
} catch (err) {
  console.error("test_rag_chunks failed");
  logError(err, { label: "supabase error" });
  process.exit(1);
}
