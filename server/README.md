# Server (Express + Supabase Postgres)

## Setup

1) Copy env file:

```bash
cp .env.example .env
```

2) Install deps:

```bash
npm install
```

3) Run:

```bash
npm run dev
```

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
curl http://localhost:8080/api/health
```
