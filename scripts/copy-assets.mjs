import fs from "node:fs";
import path from "node:path";

// Mirror every <section>/<slug>/gallery/* into public/content so next/image
// can optimize it. Runs in `prebuild` and `dev`; output dir is gitignored.
const ROOT = path.join(process.cwd(), "contents");
const OUT = path.join(process.cwd(), "public", "content");
const MEDIA = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;

// Every top-level folder under contents/ is a section — discover them so new
// sections (activities, hackathons, …) don't need to be listed here.
const SECTIONS = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

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
