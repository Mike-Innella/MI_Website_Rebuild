# MI Website Rebuild (Conversion Landing)

## Overview

This repo contains a static, conversion-first Next.js landing page with EmailJS lead capture.

## Structure

- `client-finder-frontend/` — Next.js app (UI, SEO, static assets, EmailJS form).

## Local development

```bash
cd client-finder-frontend
npm install
npm run dev
```

Local URL: `http://localhost:3000`

## Environment files

- `.env.local` for local dev/test (ignored by git).
- `.env.production` optional for local prod-like runs (ignored by git).
- Vercel/Render use platform env vars, not files.

## Deployment

Frontend (Vercel):

```
NEXT_PUBLIC_SITE_URL=https://mi-website-rebuild.vercel.app
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

Notes:

- SEO/meta: update `client-finder-frontend/src/lib/siteConfig.ts` for title, description, keywords, social images, and structured data. Layout metadata (Open Graph, Twitter, canonical) is derived from this config.

## GitHub safety

Secrets belong in `.env.local` or platform env vars. Only `.env.example` files are committed.
