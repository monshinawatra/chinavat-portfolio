import { getItems } from "@/lib/content";
import ItemCard from "./ItemCard";

export default function SectionList({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const items = getItems(slug);
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
        {items.length === 0 ? (
          <p className="mt-5 text-sm text-muted">— empty —</p>
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
