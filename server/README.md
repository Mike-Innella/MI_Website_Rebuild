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
LEAD_ALERT_EMAIL=mainnella@gmail.com
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM="Relay <no-reply@yourdomain.com>"
```

Notes:

- `CLIENT_ORIGIN` must be the origin only (no path/query).
- Render sets `PORT` automatically; the server reads it from `process.env.PORT`.
- For fastest replies, keep `OPENAI_MODEL` on a fast tier (default `gpt-4o-mini`) and keep the Render instance warm (min instance + health pings).
- Chat endpoint streams NDJSON when `stream: true` is passed. Tokens arrive as `{type:\"token\", token}` and completion metadata as `{type:\"final\", ...}` with trimmed RAG + cached context to reduce latency.
- Lead alert email is optional; if SMTP or `LEAD_ALERT_EMAIL` is missing, the server will skip sending but keep chat responses working.

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

## Seed site knowledge

Seed curated site copy into `kb_docs`:

```bash
npm run seed:kb
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
