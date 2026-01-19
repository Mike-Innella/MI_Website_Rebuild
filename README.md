# MI Website Rebuild (Full Stack)

## Overview

This repo contains a Next.js frontend and an Express API backed by Supabase Postgres and OpenAI. The AI assistant ("Relay") streams replies token-by-token for fast perceived response time and uses a trimmed RAG context plus caching to stay responsive.

## Structure

- `client-finder-frontend/` — Next.js app (UI, SEO, static assets).
- `server/` — Express API (chat/leads, RAG, Supabase, OpenAI).

## Local development

1) Backend

```bash
cd server
cp .env.example .env.local
npm install
npm run dev
```

2) Frontend (in another terminal)

```bash
cd client-finder-frontend
npm install
npm run dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8787`

## Environment files

- `.env.local` for local dev/test (ignored by git).
- `.env.production` optional for local prod-like runs (ignored by git).
- Vercel/Render use platform env vars, not files.

## Deployment

Frontend (Vercel):

```
NEXT_PUBLIC_SITE_URL=https://mi-website-rebuild.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://mi-website-rebuild.onrender.com
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

Backend (Render):

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

- `CLIENT_ORIGIN` must be origin-only (no path/query).
- CORS allows Vercel preview deploys (`https://*.vercel.app`) in production.
- Render sets `PORT` automatically; the server reads it from `process.env.PORT`.
- SEO/meta: update `client-finder-frontend/src/lib/siteConfig.ts` for title, description, keywords, social images, and structured data. Layout metadata (Open Graph, Twitter, canonical) is derived from this config.
- Relay streaming: the frontend posts with `stream: true` and consumes NDJSON tokens; backend caps responses with low temperature + max tokens for speed.

## Health check

```bash
curl https://mi-website-rebuild.onrender.com/api/health
```

## GitHub safety

Secrets belong in `.env.local` or platform env vars. Only `.env.example` files are committed.
