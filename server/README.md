# Server (Express + Supabase Postgres)

## Setup

1) Copy env file:

```bash
cp .env.example .env.local
```

2) Install deps:

```bash
npm install
```

3) Run (loads `.env.local` by default):

```bash
npm run dev
```

## Environment files

- `.env.local` for local dev/test (ignored by git).
- `.env.production` optional for local prod-like runs (ignored by git).
- Render/Vercel use platform env vars, not files.

## Render deployment

Set these Render environment variables:

```
NODE_ENV=production
CLIENT_ORIGIN=https://mi-website-rebuild.vercel.app
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL_POOLER=...
DATABASE_URL_DIRECT=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-nano-2025-08-07
OPENAI_EMBED_MODEL=text-embedding-3-small
```

Notes:

- `CLIENT_ORIGIN` must be the origin only (no path/query).
- Render sets `PORT` automatically; the server reads it from `process.env.PORT`.

## Local verification

```bash
npm run test:db
```

```bash
npm run test:rag
```

```bash
# (old doc-level RPC test)
npm run test:rag:docs
```

```bash
npm run test:all
```

```bash
npm run backfill:chunks
```

## Seed site knowledge + facts

Run the SQL once to create the assistant facts table:

```bash
# run in Supabase SQL Editor
server/sql/assistant_facts.sql
```

Seed curated site copy into `kb_docs` and structured facts into `assistant_facts`:

```bash
npm run seed:all
```

Then refresh embeddings + chunks:

```bash
npm run embed
npm run backfill:chunks
```

## One-time embeddings (if kb_docs.embedding is null)

```bash
npm run embed
```

## Curl tests

```bash
curl http://localhost:8787/api/health
```
