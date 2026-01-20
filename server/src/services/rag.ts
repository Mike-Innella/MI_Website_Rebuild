import { createServerSupabase } from "./supabase.js";

type RetrieveOptions = {
  matchCount?: number;
  minSimilarity?: number | null;
  tags?: string[] | null;
  source?: string | null;
};

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
export async function retrieveKb(queryEmbedding, options: RetrieveOptions = {}) {
  const matchCount = Math.max(1, Math.min(20, Number(options.matchCount ?? 6) || 6));
  const minSimilarity =
    options.minSimilarity === undefined ? getMinSimilarity() : options.minSimilarity;
  const supabase = createServerSupabase();

  const filterTags =
    Array.isArray(options.tags) && options.tags.length ? options.tags : null;

  const { data, error } = await supabase.rpc("match_kb_chunks", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    min_similarity: minSimilarity,
    filter_source: options.source ?? null,
    filter_tags: filterTags,
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
    .filter((r) => (applyCutoff ? r.similarity >= (minSimilarity ?? -1) : true));
}

/**
 * Builds a compact KB context string for the prompt.
 */
export function buildContext(items) {
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) return "";

  const maxItems = Math.min(4, rows.length);

  const toSentences = (text: string) => {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    const sentences = clean.match(/[^.!?]+[.!?]?/g) || [clean];
    const summary = sentences.slice(0, 2).join(" ").trim();
    return summary.length > 360 ? `${summary.slice(0, 357)}...` : summary;
  };

  return rows
    .slice(0, maxItems)
    .map((r) => {
      const title = String(r.title || "Untitled").trim();
      const snippet = toSentences(r.body);
      return `${title}: ${snippet}`;
    })
    .join("\n\n");
}
