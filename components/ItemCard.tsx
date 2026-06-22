import Image from "next/image";
import type { Item } from "@/lib/content";
import Gallery from "./Gallery";

const isVideo = (u: string) => /\.(mp4|webm)$/i.test(u);

function Thumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-line bg-panel">
      {isVideo(src) ? (
        <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
      ) : (
        <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />
      )}
    </div>
  );
}

export default function ItemCard({ item }: { item: Item }) {
  const oneLine = item.description.split("\n")[0];
  const extra = Object.entries(item.fields).filter(
    ([k]) => !["name", "description", "extradetail", "tags"].includes(k),
  );
  const hasPanel =
    !!item.description ||
    extra.length > 0 ||
    !!item.extradetail ||
    !!item.hero ||
    item.gallery.length > 0;

  return (
    <li>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-4 py-3">
          {item.hero ? (
            <Thumb src={item.hero} alt={item.name} />
          ) : (
            <div className="h-24 w-24 shrink-0 border border-line bg-panel" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-fg transition-colors group-hover:text-accent group-open:text-accent">
              {item.name}
            </p>
            {oneLine && (
              <p className="truncate text-sm text-muted">{oneLine}</p>
            )}
            {item.tags.length > 0 && (
              <p className="mt-1 truncate text-xs text-muted/80">
                {item.tags.map((t) => `#${t}`).join(" ")}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start pt-1">
            {item.featured && (
              <span className="text-amber" title="featured" aria-label="featured">
                ★
              </span>
            )}
            {item.year && (
              <span className="text-xs tabular-nums text-amber">{item.year}</span>
            )}
            <span
              className="text-amber transition-transform group-open:rotate-90"
              aria-hidden
            >
              ▸
            </span>
          </div>
        </summary>

        {hasPanel && (
          <div className="space-y-5 pb-8 pl-28 pr-1">
            {item.description && (
              <p className="max-w-2xl whitespace-pre-line text-sm text-fg">
                {item.description}
              </p>
            )}
            {extra.length > 0 && (
              <dl className="space-y-1 text-sm">
                {extra.map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="shrink-0 text-amber">{k}</dt>
                    <dd className="min-w-0 break-words text-muted">
                      {/^https?:\/\//.test(v) ? (
                        <a
                          href={v}
                          target="_blank"
                          rel="noopener"
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          {v} ↗
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {(item.hero || item.gallery.length > 0) && (
              <Gallery hero={item.hero} gallery={item.gallery} alt={item.name} />
            )}
            {item.extradetail && (
              <p className="max-w-2xl border-l-2 border-amber pl-3 text-sm text-fg">
                {item.extradetail}
              </p>
            )}
          </div>
        )}
      </details>
    </li>
  );
}
