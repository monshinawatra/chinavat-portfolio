# chinavat-portfolio

Terminal-themed portfolio. Content lives in markdown + image folders at the repo
root; the Next.js app reads them at build time. No database.

## Add or edit content

Each item is a folder under one of the four sections inside `contents/`:

```
contents/projects/<slug>/        contents/researchs/<slug>/
contents/jams/<slug>/            contents/experiences/<slug>/
```

A folder needs a `README.md` in the `key | value` format and an optional
`gallery/` folder:

```
name | NeuroGami
github | https://github.com/you/neurogami
description | A monster training game where you train the monster's brain.
Multi-line values continue until the next "key |" line.
```

- `name` and `description` are shown prominently. The first line of
  `description` is the summary shown when the item is collapsed; leave a blank
  line and keep writing for the expanded detail. Any other key (`github`,
  `jams`, `published`, `year`, …) renders automatically — add new ones freely.
  Values starting with `http` become links.
- `extradetail` is a highlight line shown below the image inside the expanded
  item — use it for impact, role, or results.
- `tags` is a comma-separated list (3–6 works well, e.g.
  `tags | reinforcement-learning, robotics, research`). Tags show under each
  item and power the year/tag filter at the top of the page.
- `featured | true` pins an item to the top of its section and shows a ★ badge.
- Gallery images open full-size in a lightbox on click (videos play inline).
- `experiences/`, `activities/`, and `hackathons/` render together as one
  tabbed, chronological timeline (not cards). Use `role`, `company`, and
  `period` (e.g. `period | 2023 – now`) for each entry; any `http…` field
  becomes a labelled link, and `extradetail` shows as a highlight.
- `youtube | <watch url>` embeds the video inside a timeline entry.
- Timeline entries (experiences/activities/hackathons) also show `gallery/`
  images, click-to-zoom like project cards.
- Thai translations: add a `_th` suffixed key for any field
  (`name_th`, `description_th`, `extradetail_th`, `role_th`, `company_th`, …).
  The EN/TH toggle (top-right, default EN) swaps them; missing `_th` keys fall
  back to English. Tags stay language-neutral. UI labels and the intro/education
  live in `lib/i18n.ts`.
- `year` sets sort order (newest first) and shows top-right of each item, and
  also feeds the year filter. If omitted, the year is pulled from
  `published`/`jams` text when present.
- `gallery/main.*` is the hero (image or `.mp4`); `gallery/other_*.*` fill the
  grid. Supported: png, jpg, webp, gif, mp4, webm.

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run dev` and `npm run build` first run `scripts/copy-assets.mjs`, which
mirrors every `gallery/` into `public/content/` (gitignored) so `next/image`
can optimize it.

## Deploy

Connected to Vercel. Push to `main` → Vercel builds and deploys. Editing any
content folder and pushing triggers a redeploy. CI (`.github/workflows/ci.yml`)
runs typecheck + build on every push/PR; Vercel owns the actual deploy.
