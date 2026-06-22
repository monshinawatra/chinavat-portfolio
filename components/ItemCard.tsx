import Link from "next/link";
import type { Item } from "@/lib/content";

export default function ItemCard({ item }: { item: Item }) {
  // Surface the most distinguishing field on the right: jam event or pub venue.
  const meta = item.fields.jams ?? item.fields.published ?? "";
  return (
    <li>
      <Link
        href={`/${item.section}/${item.slug}`}
        className="group flex items-baseline py-3"
      >
        <span className="min-w-0 truncate text-fg transition-colors group-hover:text-accent">
          {item.name}
        </span>
        <span className="leader" aria-hidden />
        {meta && (
          <span className="shrink-0 text-xs text-muted">{meta}</span>
        )}
        <span
          className="ml-3 shrink-0 text-amber opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        >
          →
        </span>
      </Link>
    </li>
  );
}
