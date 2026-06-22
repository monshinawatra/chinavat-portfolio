import type { Item } from "@/lib/content";
import Gallery from "./Gallery";

// Experiences read like a commit log — the dev's own native artifact. A `*`
// node sits on a `│` rail, newest on top, with the date range as the ref.
const period = (item: Item) =>
  item.fields.period ?? item.fields.date ?? item.year ?? "";

const ytId = (u: string) =>
  u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] ?? null;

export default function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="mt-5">
      {items.map((item, i) => {
        const role = item.fields.role ?? item.name;
        const company = item.fields.company;
        const embed = item.fields.youtube ? ytId(item.fields.youtube) : null;
        const links = Object.entries(item.fields).filter(
          ([k, v]) => /^https?:\/\//.test(v) && k !== "youtube",
        );
        return (
          <li key={item.slug} className="flex gap-4">
            <div className="flex flex-col items-center" aria-hidden>
              <span className="leading-none text-accent">*</span>
              {i < items.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-line" />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-8">
              {period(item) && (
                <p className="text-xs tabular-nums text-amber">{period(item)}</p>
              )}
              <p className="mt-1">
                <span className="text-fg">{role}</span>
                {company && (
                  <>
                    <span className="text-muted"> @ </span>
                    <span className="text-accent">{company}</span>
                  </>
                )}
              </p>
              {item.description && (
                <p className="mt-1.5 max-w-2xl whitespace-pre-line text-sm text-muted">
                  {item.description}
                </p>
              )}
              {embed && (
                <div className="mt-3 aspect-video w-full max-w-2xl overflow-hidden border border-line bg-panel">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${embed}`}
                    title={role}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="h-full w-full"
                  />
                </div>
              )}
              {(item.hero || item.gallery.length > 0) && (
                <div className="mt-3 max-w-2xl">
                  <Gallery
                    hero={item.hero}
                    gallery={item.gallery}
                    alt={role}
                  />
                </div>
              )}
              {item.extradetail && (
                <p className="mt-2 max-w-2xl border-l-2 border-amber pl-3 text-sm text-fg">
                  {item.extradetail}
                </p>
              )}
              {links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {links.map(([k, v]) => (
                    <a
                      key={k}
                      href={v}
                      target="_blank"
                      rel="noopener"
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      {k} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
