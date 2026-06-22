# chinavat-portfolio

Terminal-themed portfolio. Content lives in markdown + image folders at the repo
root; the Next.js app reads them at build time. No database.

## Add or edit content

Each item is a folder under one of the four sections:

```
projects/<slug>/        researchs/<slug>/
jams/<slug>/            experiences/<slug>/
```

A folder needs a `README.md` in the `key | value` format and an optional
`gallery/` folder:

```
name | NeuroGami
github | https://github.com/you/neurogami
description | A monster training game where you train the monster's brain.
Multi-line values continue until the next "key |" line.
```

- `name` and `description` are shown prominently. Any other key (`github`,
  `jams`, `published`, …) renders automatically — add new ones freely. Values
  starting with `http` become links.
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
