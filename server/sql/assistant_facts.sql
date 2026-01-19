-- Run in Supabase SQL Editor
-- Creates a lightweight facts table for chat context.

create table if not exists public.assistant_facts (
  id bigserial primary key,
  fact_key text not null unique,
  fact_value text not null,
  tags text[] default '{}'::text[],
  source text,
  priority integer not null default 100,
  updated_at timestamptz not null default now()
);

create index if not exists assistant_facts_priority_idx
  on public.assistant_facts (priority, updated_at desc);
