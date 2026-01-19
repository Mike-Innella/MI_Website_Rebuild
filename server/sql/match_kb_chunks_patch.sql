-- Run in Supabase SQL Editor

-- 1) Inspect current function definition
select pg_get_functiondef('public.match_kb_chunks'::regproc) as match_kb_chunks_def;

-- 2) Verify current kb_chunks schema (for NULL-safe filters and text columns)
select
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'kb_chunks'
order by ordinal_position;

-- 3) What to change (apply in your function DDL)
-- Goal: make RPC return top-N even when similarity is low.
-- Practical fix: remove similarity cutoff filtering inside SQL.
--
-- - In the function signature: keep `min_similarity` for compatibility, but don't use it in WHERE
--     min_similarity double precision DEFAULT NULL
-- - In the WHERE clause: delete any similarity cutoff entirely, e.g. remove:
--     AND (1 - (c.embedding <=> query_embedding)) >= min_similarity
--   or
--     AND (c.embedding <=> query_embedding) <= (1 - min_similarity)
-- - If you have optional filters, make them NULL-safe (otherwise NULL filters exclude everything):
--     AND (filter_source IS NULL OR source = filter_source)
--     AND (filter_tags IS NULL OR tags && filter_tags)
--
-- - Keep similarity computed in SELECT, and order/limit by distance:
--     ORDER BY (c.embedding <=> query_embedding) ASC
--     LIMIT match_count

-- 4) Optional: quick RPC-equivalent sanity checks (run after you update the function)
-- NOTE: You'll need to paste a real embedding array for `query_embedding`.
-- select * from public.match_kb_chunks(
--   query_embedding := ARRAY[0.0, 0.0]::double precision[],
--   match_count := 6,
--   min_similarity := -1.0,
--   filter_source := null,
--   filter_tags := null
-- );
