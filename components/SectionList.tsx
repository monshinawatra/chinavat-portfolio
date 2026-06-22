import type { Item } from "@/lib/content";
import ItemCard from "./ItemCard";

export default function SectionList({
  slug,
  title,
  blurb,
  items,
  emptyText,
}: {
  slug: string;
  title: string;
  blurb: string;
  items: Item[];
  emptyText: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h2 className="text-sm">
          <span className="text-muted">% </span>
          <span className="text-accent">ls</span>{" "}
          <span className="text-fg">{slug}/</span>
          <span className="ml-2 text-muted">({items.length})</span>
          {title !== slug && (
            <span className="ml-3 text-muted">{`# ${title}`}</span>
          )}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{blurb}</p>
        {items.length === 0 ? (
          <p className="mt-5 text-sm text-muted">{emptyText}</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {items.map((item) => (
              <ItemCard key={item.slug} item={item} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
