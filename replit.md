# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Vocal.uz — a bilingual (Russian/English) singing studio website for Dariya Sviridova.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (contact form → Telegram)
│   └── vocal-uz/           # Vocal.uz React frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Vocal.uz Frontend (`artifacts/vocal-uz`)

### Pages
- `/` — Home: hero (split Extreme/Pop), disciplines, teacher about section with `5.jpg` photo, CTA banner, booking form
- `/extreme` — Extreme Vocals dedicated page
- `/pop` — Pop Vocals dedicated page

### Features
- **Bilingual**: Russian (default) / English — auto-detected via `navigator.language`
- **Language toggle**: RU/EN buttons in nav
- **Contact form → Telegram**: submissions go to `POST /api/contact` → Telegram Bot API
- **Social buttons**: Telegram, Instagram, Facebook in footer (placeholder links)
- **Phone**: +998 33 862-25-89 in footer
- **Logo**: `public/logo.png` (LOGO.png from user)
- **Teacher photo**: `public/5.jpg` in About section
- **SEO**: unique title/description per page, OG tags, structured data (MusicSchool schema), canonical URLs

### Key Files
- `src/lib/i18n.ts` — all bilingual content strings
- `src/lib/langContext.tsx` — React context for language state
- `src/components/Nav.tsx` — navigation with lang toggle
- `src/components/Footer.tsx` — footer with social links, phone
- `src/components/BookingForm.tsx` — contact form posting to API
- `src/components/SeoHead.tsx` — dynamic SEO meta tags
- `src/pages/Home.tsx` — main landing page
- `src/pages/ExtremeVocals.tsx` — extreme vocals page
- `src/pages/PopVocals.tsx` — pop vocals page

## API Server (`artifacts/api-server`)

### Routes
- `GET /api/healthz` — health check
- `POST /api/contact` — receives form submission, sends Telegram message

### Secrets Required
- `TELEGRAM_BOT_TOKEN` — Telegram bot token
- `TELEGRAM_CHAT_ID` — owner's Telegram chat ID

## Sanity CMS Integration

### Project
- **Project ID**: `n6dunjsx`
- **Dataset**: `production` (public)
- **Studio schemas**: `sanity-studio/schemas/` (homePage, extremePage, popPage)
- **Reference config**: `sanity-studio/sanity.config.ts`

### How it works
- The frontend fetches content from Sanity on every page load using `@sanity/client`
- If Sanity content is present → it overrides the hardcoded i18n strings
- If Sanity is unreachable or a field is empty → falls back to hardcoded content silently
- All 3 documents are pre-populated in Sanity with full RU/EN content

### Documents
- `homePage` — site title, phone, hero section, teacher bio, stats, booking section
- `extremePage` — hero, techniques array, process steps, FAQs
- `popPage` — hero, pillars array, for-whom cards, FAQs

### To use the Sanity Studio (CMS editor)
1. Use the schema files in `sanity-studio/schemas/` with your Sanity CLI project
2. Run `sanity deploy` from your CLI project to host the studio
3. Go to your deployed studio URL and edit content — changes appear on the site immediately

### CORS Origins Configured
- `https://vocal.uz`, `https://www.vocal.uz`
- `https://*.worf.replit.dev`, `https://*.replit.dev`
- `http://localhost`, `http://localhost:*`

### Key Files
- `artifacts/vocal-uz/src/lib/sanityClient.ts` — Sanity client setup
- `artifacts/vocal-uz/src/lib/useSanityContent.ts` — React hook for fetching home page content
- `sanity-studio/schemas/` — Schema definitions to copy into Sanity CLI project

## SEO
- Structured data: MusicSchool schema in `index.html`
- Per-page meta via `SeoHead` component
- OG tags, twitter cards, canonical URLs
- `robots` meta set to `index, follow`
