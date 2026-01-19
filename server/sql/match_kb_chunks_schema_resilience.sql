-- Run in Supabase SQL Editor

-- Verify which text columns exist in `kb_chunks`
select
  max((column_name = 'chunk_text')::int) as has_chunk_text,
  max((column_name = 'content')::int) as has_content,
  max((column_name = 'chunk_title')::int) as has_chunk_title,
  max((column_name = 'title')::int) as has_title
from information_schema.columns
where table_schema = 'public' and table_name = 'kb_chunks';

-- Recommended return expressions inside `public.match_kb_chunks`:
-- - text:  COALESCE(kb_chunks.chunk_text, kb_chunks.content)
-- - title: COALESCE(kb_chunks.chunk_title, kb_chunks.title, kb_docs.title)
--
-- Apply these in the SELECT list / projection that your function returns so
-- callers always see non-blank previews after schema changes.
