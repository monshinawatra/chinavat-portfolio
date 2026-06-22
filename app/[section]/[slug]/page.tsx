import { notFound } from "next/navigation";
import Link from "next/link";
import { getItem, getAllItems, SECTIONS } from "@/lib/content";
import Gallery from "@/components/Gallery";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllItems().map((i) => ({ section: i.section, slug: i.slug }));
}

const isUrl = (v: string) => /^https?:\/\//.test(v);

export default async function ItemPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  if (!SECTIONS.some((s) => s.slug === section)) notFound();
  const item = getItem(section, slug);
  if (!item) notFound();

  const extra = Object.entries(item.fields).filter(
    ([k]) => k !== "name" && k !== "description",
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link href="/" className="text-sm text-muted transition-colors hover:text-accent">
        &lt; cd ~
      </Link>

      <p className="mt-8 text-sm text-muted">
        % <span className="text-accent">cat</span> {section}/{slug}/README.md
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">
        {item.name}
      </h1>

      {item.description && (
        <p className="mt-5 max-w-2xl whitespace-pre-line text-fg">
          {item.description}
        </p>
      )}

      {extra.length > 0 && (
        <dl className="mt-6 space-y-1 text-sm">
          {extra.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="shrink-0 text-amber">{k}</dt>
              <dd className="min-w-0 break-words text-muted">
                {isUrl(v) ? (
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
        <div className="mt-10">
          <Gallery hero={item.hero} gallery={item.gallery} alt={item.name} />
        </div>
      )}
    </main>
  );
}
