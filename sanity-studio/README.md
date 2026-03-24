# Vocal.uz — Sanity Studio

This folder contains the schema definitions for the Vocal.uz CMS.

## Setup

1. Make sure you have Sanity CLI installed:
   ```bash
   npm install -g sanity
   ```

2. Copy the schema files from this folder into your Sanity studio project:
   - `schemas/homePage.ts` → home page content
   - `schemas/extremePage.ts` → extreme vocals page
   - `schemas/popPage.ts` → pop vocals page
   - `schemas/index.ts` → schema barrel export

3. In your `sanity.config.ts`, import from `./schemas` and add them to `schema.types`.

4. Deploy your studio:
   ```bash
   sanity deploy
   ```

5. Open the studio and create one document of each type:
   - **Home Page** — hero, teacher bio, booking section
   - **Extreme Vocals Page** — techniques, process steps, FAQs
   - **Pop Vocals Page** — pillars, for-whom cards, FAQs

## How it works

The Vocal.uz website fetches content from Sanity on every page load.
If a field is empty in Sanity, the hardcoded fallback content is shown automatically.
This means you can start editing content piece by piece — nothing breaks.

## CORS

Make sure to add your domain to the CORS origins in your Sanity project:
- Go to sanity.io/manage → your project → API → CORS Origins
- Add `https://vocal.uz` and your Replit preview domain
