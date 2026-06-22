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
const MEDIA = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;

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
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getAllItems(): Item[] {
  return SECTIONS.flatMap((s) => getItems(s.slug));
}
