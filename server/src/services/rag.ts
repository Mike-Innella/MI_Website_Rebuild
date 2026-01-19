import { createServerSupabase } from "./supabase.js";

function getMinSimilarity() {
  const raw = process.env.RAG_MIN_SIMILARITY;
  if (raw == null || String(raw).trim() === "") return -1.0;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`Invalid RAG_MIN_SIMILARITY: ${raw}`);
  return n;
}

function pickSimilarity(r) {
  const v = r?.similarity ?? r?.match_similarity ?? r?.score ?? r?.distance;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Retrieves KB chunks via the ONLY supported RPC: public.match_kb_chunks
 * Expected RPC fields (per your DB): chunk_id, doc_id, chunk_index, title, chunk_text, chunk_title, tags, source, similarity
 */
export async function retrieveKb(queryEmbedding, k = 6) {
  const matchCount = Math.max(1, Math.min(20, Number(k) || 6));
  const minSimilarity = getMinSimilarity();
  const supabase = createServerSupabase();

  const { data, error } = await supabase.rpc("match_kb_chunks", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    min_similarity: minSimilarity,
    filter_source: null,
    filter_tags: null,
  });

  if (error) throw error;

  const rows = Array.isArray(data) ? data : [];
  const applyCutoff = Number.isFinite(minSimilarity) && minSimilarity > -1.0;

  return rows
    .map((r) => {
      const similarity = pickSimilarity(r);

      return {
        id: r.chunk_id ?? r.id ?? `${r.doc_id ?? "?"}:${r.chunk_index ?? "?"}`,
        title: r.title ?? r.chunk_title ?? "Untitled",
        body: r.chunk_text ?? "",

        // optional metadata
        tags: r.tags ?? null,
        source: r.source ?? null,
        similarity: similarity ?? -1,
      };
    })
    .filter((r) => (applyCutoff ? r.similarity >= minSimilarity : true));
}

/**
 * Builds a compact KB context string for the prompt.
 */
export function buildContext(items) {
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) return "";

  const maxItems = Math.min(8, rows.length);

  return rows
    .slice(0, maxItems)
    .map((r, i) => {
      const title = String(r.title || "Untitled").trim();
      const sim = typeof r.similarity === "number" ? r.similarity.toFixed(3) : "n/a";
      const text = String(r.body || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 600);

      return `[#${i + 1} | sim=${sim}] ${title}\n${text}`;
    })
    .join("\n\n---\n\n");
}
