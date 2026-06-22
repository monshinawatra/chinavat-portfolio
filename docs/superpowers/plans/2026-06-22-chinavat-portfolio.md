# Chinavat Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Next.js portfolio that renders local `README.md` + gallery content as a terminal-themed site, auto-deployed on Vercel.

**Architecture:** App Router + RSC read content from root content folders at build time via a generic `key | value` parser. A prebuild script copies gallery media into `public/` so `next/image` can optimize it. One dynamic route renders all item detail pages. CI builds; Vercel deploys.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Node 24.

## Global Constraints

- No database — all content read from the filesystem at build time.
- Author content folders (`projects/ jams/ researchs/ experiences/`) stay at repo root, unchanged in structure.
- Preserve the existing `key | value` README format; parser is generic (unknown keys captured, not dropped).
- Terminal/technical theme: dark-only, monospace, green-on-near-black accent.
- Single commit for the whole setup (repo `CLAUDE.md` rule). No intermediate commits during execution; commit once at the end.
- `next/image` only serves `public/` — gallery assets must be copied there by the prebuild script (`public/content/` gitignored).

---

### Task 1: Scaffold Next.js app + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`, `.nvmrc`, `eslint.config.mjs`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: a buildable Next.js app; npm scripts `dev`, `build`, `prebuild`, `typecheck`, `lint`.

- [ ] **Step 1:** Initialize app non-interactively into the current directory (content folders already present):

```bash
npx create-next-app@latest . --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
```

If it refuses due to existing files, scaffold in a temp dir and copy the generated config/app files in, preserving the existing content folders, `cv.pdf`, `CLAUDE.md`, `docs/`, `.claude/`, `.git/`.

- [ ] **Step 2:** Set `.nvmrc` to the Node major:

```
24
```

- [ ] **Step 3:** Add scripts to `package.json` (`prebuild` must run before `build`):

```json
"scripts": {
  "dev": "node scripts/copy-assets.mjs && next dev",
  "prebuild": "node scripts/copy-assets.mjs",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4:** Append to `.gitignore`:

```
# prebuild-generated assets
/public/content/
.DS_Store
```

- [ ] **Step 5:** Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run build
```

- [ ] **Step 6:** Verify it builds (prebuild will no-op until Task 2 script exists — create an empty placeholder if needed, replaced in Task 2):

Run: `npm run build`
Expected: build succeeds.

---

### Task 2: Content parser + asset copy script

**Files:**
- Create: `lib/content.ts`
- Create: `scripts/copy-assets.mjs`
- Test: `lib/content.test.mjs`

**Interfaces:**
- Produces:
  - `parseReadme(text: string): Record<string, string>` — parses `key | value`, values may span multiple lines until the next `key |` line; trims; later duplicate keys overwrite.
  - `type Item = { section: string; slug: string; fields: Record<string,string>; name: string; description: string; hero: string | null; gallery: string[] }` — `hero`/`gallery` are public URLs under `/content/...`.
  - `SECTIONS: { slug: string; title: string }[]` — `projects`→"projects", `jams`→"game jams", `researchs`→"research", `experiences`→"experiences".
  - `getItems(section: string): Item[]`
  - `getItem(section: string, slug: string): Item | null`
  - `getAllItems(): Item[]`
- `scripts/copy-assets.mjs` copies `*/gallery/*` → `public/content/<section>/<slug>/<file>` for the four sections and is idempotent.

- [ ] **Step 1: Write the failing test** (`lib/content.test.mjs`, plain Node assert, no framework):

```js
import assert from "node:assert";
import { parseReadme } from "./content.ts";

// single line
let f = parseReadme("name | Foo");
assert.equal(f.name, "Foo");

// multi-line value continues until next "key |"
f = parseReadme("name | Foo\ndescription | line one\nline two\ngithub | http://x");
assert.equal(f.name, "Foo");
assert.equal(f.description, "line one\nline two");
assert.equal(f.github, "http://x");

// blank lines inside a value preserved-ish (trimmed ends)
f = parseReadme("description | a\n\nb\n");
assert.equal(f.description, "a\n\nb");

console.log("ok");
```

- [ ] **Step 2: Run test, verify it fails**

Run: `node --experimental-strip-types lib/content.test.mjs`
Expected: FAIL (`parseReadme` not defined / file missing).

- [ ] **Step 3: Implement `lib/content.ts`**

```ts
import fs from "node:fs";
import path from "node:path";

export const SECTIONS = [
  { slug: "projects", title: "projects" },
  { slug: "researchs", title: "research" },
  { slug: "jams", title: "game jams" },
  { slug: "experiences", title: "experiences" },
] as const;

export type Item = {
  section: string;
  slug: string;
  fields: Record<string, string>;
  name: string;
  description: string;
  hero: string | null;
  gallery: string[];
};

const ROOT = process.cwd();
const KEY_LINE = /^([a-zA-Z0-9_-]+)\s*\|\s?(.*)$/;

export function parseReadme(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  let key: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (key !== null) out[key] = buf.join("\n").trim();
  };
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(KEY_LINE);
    if (m) {
      flush();
      key = m[1];
      buf = [m[2]];
    } else if (key !== null) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

const MEDIA = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;

function listGallery(section: string, slug: string): { hero: string | null; gallery: string[] } {
  const dir = path.join(ROOT, section, slug, "gallery");
  if (!fs.existsSync(dir)) return { hero: null, gallery: [] };
  const files = fs.readdirSync(dir).filter((f) => MEDIA.test(f));
  const url = (f: string) => `/content/${section}/${slug}/${f}`;
  const main = files.find((f) => /^main\./i.test(f)) ?? null;
  const others = files.filter((f) => f !== main).sort();
  return { hero: main ? url(main) : null, gallery: others.map(url) };
}

export function getItems(section: string): Item[] {
  const dir = path.join(ROOT, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => getItem(section, d.name))
    .filter((x): x is Item => x !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getItem(section: string, slug: string): Item | null {
  const readme = path.join(ROOT, section, slug, "README.md");
  if (!fs.existsSync(readme)) return null;
  const fields = parseReadme(fs.readFileSync(readme, "utf8"));
  const { hero, gallery } = listGallery(section, slug);
  return {
    section,
    slug,
    fields,
    name: fields.name ?? slug,
    description: fields.description ?? "",
    hero,
    gallery,
  };
}

export function getAllItems(): Item[] {
  return SECTIONS.flatMap((s) => getItems(s.slug));
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `node --experimental-strip-types lib/content.test.mjs`
Expected: prints `ok`.

- [ ] **Step 5: Implement `scripts/copy-assets.mjs`**

```js
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SECTIONS = ["projects", "researchs", "jams", "experiences"];
const OUT = path.join(ROOT, "public", "content");
const MEDIA = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;

fs.rmSync(OUT, { recursive: true, force: true });
let n = 0;
for (const section of SECTIONS) {
  const sdir = path.join(ROOT, section);
  if (!fs.existsSync(sdir)) continue;
  for (const slug of fs.readdirSync(sdir)) {
    const gdir = path.join(sdir, slug, "gallery");
    if (!fs.existsSync(gdir) || !fs.statSync(gdir).isDirectory()) continue;
    for (const file of fs.readdirSync(gdir)) {
      if (!MEDIA.test(file)) continue;
      const dest = path.join(OUT, section, slug, file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(gdir, file), dest);
      n++;
    }
  }
}
console.log(`copy-assets: ${n} files -> public/content`);
```

- [ ] **Step 6: Run it, verify copy**

Run: `node scripts/copy-assets.mjs && ls public/content`
Expected: prints count > 0, lists `projects jams researchs` dirs.

---

### Task 3: Move cv.pdf into public

**Files:**
- Move: `cv.pdf` → `public/cv.pdf`

- [ ] **Step 1:** Move the file:

```bash
git mv cv.pdf public/cv.pdf 2>/dev/null || mv cv.pdf public/cv.pdf
```

- [ ] **Step 2:** Verify:

Run: `test -f public/cv.pdf && echo ok`
Expected: `ok`.

---

### Task 4: Theme tokens + layout (invoke /frontend-design)

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `tailwind` config / theme tokens

**Interfaces:**
- Produces: dark terminal theme tokens (bg near-black, fg light gray, green accent, mono font), applied app-wide via `layout.tsx` and CSS variables.

- [ ] **Step 1:** Invoke the `frontend-design` skill to set aesthetic direction for the terminal/technical theme before writing CSS.

- [ ] **Step 2:** In `app/layout.tsx`, load a mono font (`next/font` Geist Mono or IBM Plex Mono), set `<html lang="en">` dark, metadata (title "Chinavat", description).

- [ ] **Step 3:** In `app/globals.css`, define theme tokens (CSS variables): `--bg`, `--fg`, `--muted`, `--accent` (green), `--line` (grid line). Apply mono font, dark background, base text color, link styles, a subtle grid/scanline accent if appropriate.

- [ ] **Step 4: Verify build + theme**

Run: `npm run build`
Expected: build succeeds. (Visual check happens in Task 6.)

---

### Task 5: Components + routes

**Files:**
- Create: `components/Terminal.tsx`, `components/SectionList.tsx`, `components/ItemCard.tsx`, `components/Gallery.tsx`
- Modify: `app/page.tsx`
- Create: `app/[section]/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getItems`, `getItem`, `getAllItems`, `SECTIONS`, `Item` from `lib/content.ts`.
- Produces: home page + static detail pages for every item.

- [ ] **Step 1:** `components/Gallery.tsx` — renders hero media + grid of `gallery[]`. Branch on extension: `<video controls>` for mp4/webm, else `next/image` (`fill` or fixed sizes, `alt` from item name). Server component OK (no client state).

- [ ] **Step 2:** `components/ItemCard.tsx` — a list row: `[slug]` style label, `name`, one-line truncated `description`, links to `/<section>/<slug>`.

- [ ] **Step 3:** `components/SectionList.tsx` — section heading with count `> projects (7)` and a list of `ItemCard`.

- [ ] **Step 4:** `components/Terminal.tsx` — hero block: prompt `chinavat ~ %`, short intro line, link to `/cv.pdf`.

- [ ] **Step 5:** `app/page.tsx` — render `Terminal` then map `SECTIONS` to `SectionList` using `getItems(section.slug)`.

- [ ] **Step 6:** `app/[section]/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getItem, getAllItems, SECTIONS } from "@/lib/content";
import Gallery from "@/components/Gallery";

export function generateStaticParams() {
  return getAllItems().map((i) => ({ section: i.section, slug: i.slug }));
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  if (!SECTIONS.some((s) => s.slug === section)) notFound();
  const item = getItem(section, slug);
  if (!item) notFound();
  // render name, description, github link if present, other fields, <Gallery/>
  return null; // replace with markup
}
```

Implement the markup: title `item.name`, `description` (preserve newlines via `whitespace-pre-line`), `github` link button if `item.fields.github`, any other fields (exclude name/description/github) as labeled rows, then `<Gallery hero={item.hero} gallery={item.gallery} alt={item.name} />`. A back link to `/`.

- [ ] **Step 7: Verify build + static params**

Run: `npm run build`
Expected: build succeeds; output lists generated `/projects/...`, `/jams/...`, `/researchs/...` pages.

---

### Task 6: README + run/verify

**Files:**
- Create/replace: `README.md` (project readme — note: do not clobber content READMEs)

- [ ] **Step 1:** Write `README.md`: what the site is, how to add content (drop a folder with `README.md` + `gallery/` under a section, `key | value` format), local dev (`npm run dev`), and that pushing to `main` auto-deploys on Vercel.

- [ ] **Step 2:** Run dev server and screenshot home + one detail page to confirm theme renders (use the `run` skill or `npm run dev` + browser).

Run: `npm run dev`
Expected: home shows terminal hero + sections; a detail page shows gallery.

- [ ] **Step 3:** Final full check.

Run: `npm run typecheck && npm run build`
Expected: both pass.

---

### Task 7: Single commit

- [ ] **Step 1:** Stage everything (content folders, app, docs, configs; `public/content/` is gitignored):

```bash
git add -A
git status   # confirm public/content/ excluded, cv.pdf at public/
```

- [ ] **Step 2:** One commit (per CLAUDE.md no-separate-commits rule):

```bash
git commit -m "$(cat <<'EOF'
feat: initialize Next.js terminal-themed portfolio

Scaffold App Router + TypeScript + Tailwind site that renders local
README.md (key|value) + gallery content. Generic content parser, prebuild
asset copy into public/, one dynamic detail route, CI workflow, Vercel CD.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

**Spec coverage:** stack (T1), CI workflow (T1), parser + generic fields (T2), asset serving/prebuild (T2), cv.pdf move (T3), theme (T4), routes/components incl. single dynamic detail route (T5), repo readme (T6), single commit (T7), gitignore for `public/content/` (T1). All spec sections mapped.

**Placeholder scan:** detail page markup described in prose with explicit field rules (T5 Step 6) — acceptable since exact JSX is a frontend-design concern; the contract (which fields, newline handling, github link) is explicit.

**Type consistency:** `Item`, `parseReadme`, `getItems/getItem/getAllItems`, `SECTIONS` names consistent across T2 and T5. `hero`/`gallery` URLs under `/content/...` match copy-asset output path in T2 Step 5.
