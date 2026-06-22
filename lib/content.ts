import fs from "node:fs";
import path from "node:path";

export type Lang = "en" | "th";

export const SECTIONS = [
  {
    slug: "projects",
    title: "projects",
    blurb: "Things I've built — ML systems, apps, and side experiments.",
    blurbTh: "สิ่งที่ผมสร้าง — ระบบ ML แอป และการทดลองข้างเคียง",
  },
  {
    slug: "researchs",
    title: "research",
    blurb: "Papers and academic work.",
    blurbTh: "งานวิจัยและผลงานวิชาการ",
  },
  {
    slug: "jams",
    title: "game jams",
    blurb: "Games shipped against a 48-hour clock.",
    blurbTh: "เกมที่สร้างเสร็จภายใน 48 ชั่วโมง",
  },
  {
    slug: "experiences",
    title: "experiences",
    blurb: "Places I've worked.",
    blurbTh: "ที่ที่ผมเคยทำงาน",
  },
  {
    slug: "activities",
    title: "activities",
    blurb: "Talks, seminars, and public appearances.",
    blurbTh: "การพูด สัมมนา และการปรากฏตัวต่อสาธารณะ",
  },
  {
    slug: "hackathons",
    title: "hackathons",
    blurb: "Built fast, judged hard — and the prizes that followed.",
    blurbTh: "สร้างเร็ว ตัดสินดุเดือด — และรางวัลที่ตามมา",
  },
] as const;

export type Item = {
  section: string;
  slug: string;
  fields: Record<string, string>;
  name: string;
  description: string;
  extradetail: string;
  tags: string[];
  featured: boolean;
  year: string | null;
  hero: string | null;
  gallery: string[];
};

// All authored content lives under contents/<section>/<slug>/.
const ROOT = path.join(process.cwd(), "contents");
const KEY_LINE = /^([a-zA-Z0-9_-]+)\s*\|\s?(.*)$/;
const MEDIA = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;

// Prefer an explicit `year`; otherwise pull the first 4-digit year out of the
// venue/event fields (e.g. "Global Game Jam 2023", "... November 2025 iSAI-NLP").
function pickYear(fields: Record<string, string>): string | null {
  const src = fields.year ?? fields.published ?? fields.jams ?? fields.date ?? "";
  return src.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;
}

// Parse the project's "key | value" README format. A value runs from its key
// line until the next key line, so descriptions may span multiple lines.
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

// gallery/main.* is the hero; everything else is sorted gallery media. URLs
// point at public/content, where copy-assets.mjs mirrors the gallery folders.
function listGallery(
  section: string,
  slug: string,
): { hero: string | null; gallery: string[] } {
  const dir = path.join(ROOT, section, slug, "gallery");
  if (!fs.existsSync(dir)) return { hero: null, gallery: [] };
  const files = fs.readdirSync(dir).filter((f) => MEDIA.test(f));
  const url = (f: string) => `/content/${section}/${slug}/${f}`;
  const main = files.find((f) => /^main\./i.test(f)) ?? null;
  const others = files.filter((f) => f !== main).sort();
  return { hero: main ? url(main) : null, gallery: others.map(url) };
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
    extradetail: fields.extradetail ?? "",
    // comma-separated, normalized to lowercase for stable filtering
    tags: (fields.tags ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    featured: /^(true|yes|1)$/i.test((fields.featured ?? "").trim()),
    year: pickYear(fields),
    hero,
    gallery,
  };
}

export function getItems(section: string): Item[] {
  const dir = path.join(ROOT, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => getItem(section, d.name))
    .filter((x): x is Item => x !== null)
    .sort((a, b) => {
      // Featured items pin to the top; then newest first, items without a year
      // sink to the bottom, then by name.
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const ay = a.year ? Number(a.year) : -Infinity;
      const by = b.year ? Number(b.year) : -Infinity;
      return by - ay || a.name.localeCompare(b.name);
    });
}

export function getAllItems(): Item[] {
  return SECTIONS.flatMap((s) => getItems(s.slug));
}

// Resolve a single language view. `key_th` fields override `key` for Thai;
// the raw `_th` keys are always stripped so they never leak into the UI.
function localize(item: Item, lang: Lang): Item {
  const f: Record<string, string> = {};
  for (const [k, v] of Object.entries(item.fields)) {
    if (k.endsWith("_th")) continue;
    f[k] = lang === "th" ? (item.fields[`${k}_th`] ?? v) : v;
  }
  return {
    ...item,
    fields: f,
    name: f.name ?? item.slug,
    description: f.description ?? "",
    extradetail: f.extradetail ?? "",
  };
}

export type LocalSection = {
  slug: string;
  title: string;
  blurb: string;
  items: Item[];
};

export function getLocalizedSections(lang: Lang): LocalSection[] {
  return SECTIONS.map((s) => ({
    slug: s.slug,
    title: s.title,
    blurb: lang === "th" ? s.blurbTh : s.blurb,
    items: getItems(s.slug).map((it) => localize(it, lang)),
  }));
}
