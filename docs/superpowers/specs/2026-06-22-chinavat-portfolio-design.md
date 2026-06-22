# Chinavat Portfolio — Design

**Date:** 2026-06-22
**Status:** Approved

## Goal

A personal portfolio website for Chinavat, built from local markdown + image
assets (no database). Content authors edit folders in the repo; pushing to
`main` redeploys automatically (Continuous Delivery). Aesthetic: terminal /
technical (dark, monospace, green-on-black).

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**.
- React Server Components read content from the filesystem at build time. No DB,
  no runtime data fetching, no client state for content.
- **Deploy:** Vercel git integration. Push to `main` → Vercel builds and
  deploys. Editing any `README.md` or `gallery/` file and pushing triggers a
  redeploy.
- **CI:** A GitHub Action runs typecheck + `next build` on push and PR. It does
  NOT deploy (Vercel owns deploy).

## Content Model

The authoring surface is the existing folder structure. It stays at repo root so
it is easy to edit:

```
projects/<slug>/README.md  + gallery/
jams/<slug>/README.md       + gallery/
researchs/<slug>/README.md  + gallery/
experiences/<slug>/README.md + gallery/   (currently empty — supported, renders empty)
```

### README format (`key | value`)

Existing custom format, preserved verbatim. One field per logical block; values
may span multiple lines until the next `key |` line. Example:

```
name | NeuroGami
github | https://github.com/...
description | A monster training game that player actually train monster brain.
Each monster has its own brain, which is a ML-based model.
```

Fields observed across content: `name` (required), `description` (required,
multi-line), `github` (optional), `jams` (jam event name), `published`
(research venue/date). The parser is **generic**: any `key` is captured into a
map, so new fields can be added to a README without code changes. Known fields
get specific rendering (e.g. `github` → link button); unknown fields render as a
generic labeled row.

### Gallery

Each item's `gallery/` folder holds media. `main.*` (png/jpg/mp4/webp) is the
hero. `other_*.*` are additional gallery items. The parser lists files; order:
`main` first, then `other_*` sorted by name.

### `lib/content.ts`

- `getSections()` → section metadata (slug, title, item count).
- `getItems(section)` → parsed items for a section, sorted (default: directory
  name; can refine later).
- `getItem(section, slug)` → single parsed item or null.
- A `parseReadme(text)` helper implementing the `key | value` multi-line parser.
- A `listGallery(dir)` helper returning hero + others.

All filesystem reads happen at build time inside Server Components / static
params generation.

## Asset Serving

`next/image` can only optimize files under `public/` (or remote). Gallery images
live in content folders, not `public/`. A **prebuild script**
(`scripts/copy-assets.mjs`, run via `prebuild` npm hook) copies
`*/gallery/*` → `public/content/<section>/<slug>/<file>` and `cv.pdf` stays in
`public/`. `public/content/` is build output and is gitignored. Result: editing
a gallery file then pushing → prebuild recopies → `next/image` serves optimized
assets. No asset duplication committed to git.

`cv.pdf` is moved from repo root to `public/cv.pdf` and linked from the home
page.

## Routes

- `/` — Home. Terminal-style hero (`chinavat ~ %`), then each section listed
  with its item count and items. A link to `/cv.pdf`.
- `/[section]/[slug]` — Single dynamic route handling all item detail pages for
  all four sections. Renders: hero media, `name`, `description`, gallery grid,
  `github` link if present, and any other parsed fields. `generateStaticParams`
  enumerates every item across sections so all pages are statically generated.

One detail-route file, not one per section.

## Components

- `Terminal` — the hero / prompt presentation.
- `SectionList` — a section heading + count + its item rows.
- `ItemCard` — a single item row/card in a list.
- `Gallery` — hero media + grid of `other_*` media (handles img and mp4).

## Theme

Terminal / technical:

- Dark background, monospace typeface (Geist Mono or IBM Plex Mono), green
  accent on near-black, thin grid lines, subtle hover/transition motion.
- Dark-only (no light/dark toggle — terminal aesthetic is intentionally dark).
- Design tokens centralized in Tailwind config + `app/globals.css`.
- The `/frontend-design` skill refines the concrete visual execution during
  implementation.

## Repo Organization

```
app/
  layout.tsx
  page.tsx
  globals.css
  [section]/[slug]/page.tsx
components/
  Terminal.tsx  SectionList.tsx  ItemCard.tsx  Gallery.tsx
lib/
  content.ts
scripts/
  copy-assets.mjs
public/
  cv.pdf
  content/            (gitignored, prebuild-generated)
projects/ jams/ researchs/ experiences/   ← author content, unchanged
.github/workflows/ci.yml
.gitignore  .nvmrc  README.md  tsconfig.json  next.config.*  package.json
```

## Workflows

`.github/workflows/ci.yml`: on push + PR → install, typecheck (`tsc --noEmit`),
`next build`. Build runs the `prebuild` asset copy, so CI also validates asset
copying. No deploy step (Vercel handles deploy on push to `main`).

## Commit Policy

Per repo `CLAUDE.md`: do not make separate commits — initial setup lands as a
single commit.

## Out of Scope (YAGNI)

- CMS, MDX rendering, full-text search.
- Light/dark theme toggle.
- Per-section route files (one dynamic route covers all).
- Seeding `experiences/` from `cv.pdf` — author adds experience folders like the
  other sections.
