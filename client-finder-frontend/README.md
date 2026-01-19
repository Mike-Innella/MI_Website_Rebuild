# Client Finder Frontend (Next.js)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Make sure the API server is running on `http://localhost:8787`.

## Environment files

- `.env.local` for local dev/test (ignored by git).
- `.env.production` optional for local prod-like builds (ignored by git).
- Vercel uses platform env vars, not files.

Required env vars:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

## Vercel deployment

Set this in Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://mi-website-rebuild.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://mi-website-rebuild.onrender.com
```

## SEO & metadata

- Update `src/lib/siteConfig.ts` for site name, description, keywords, social image paths, and JSON-LD. Layout metadata (Open Graph, Twitter, canonical) derives from this config.
- The homepage injects JSON-LD from `siteConfig` for Organization, Website, and WebPage.
- Relay widget streams AI responses (NDJSON) for faster perceived speed; ensure `NEXT_PUBLIC_API_BASE_URL` points to the live backend.
