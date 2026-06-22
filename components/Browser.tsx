"use client";

import { useMemo, useState } from "react";
import type { Item, LocalSection } from "@/lib/content";
import type { UIStrings } from "@/lib/i18n";
import SectionList from "./SectionList";
import Tabs from "./Tabs";

// These three render together as one tabbed timeline block, not as cards.
const JOURNEY = ["experiences", "activities", "hackathons"];

export default function Browser({
  sections,
  ui,
}: {
  sections: LocalSection[];
  ui: UIStrings;
}) {
  const [years, setYears] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const allItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const allYears = useMemo(
    () =>
      Array.from(
        new Set(allItems.map((i) => i.year).filter(Boolean) as string[]),
      ).sort((a, b) => Number(b) - Number(a)),
    [allItems],
  );

  const allTags = useMemo(
    () => Array.from(new Set(allItems.flatMap((i) => i.tags))).sort(),
    [allItems],
  );

  const toggle = (
    value: string,
    list: string[],
    set: (v: string[]) => void,
  ) =>
    set(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    );

  // Year and tag facets each OR internally, then AND across facets.
  const match = (item: Item) => {
    const yearOk =
      years.length === 0 || (item.year != null && years.includes(item.year));
    const tagOk = tags.length === 0 || item.tags.some((t) => tags.includes(t));
    return yearOk && tagOk;
  };

  const active = years.length > 0 || tags.length > 0;
  const filtered = sections.map((s) => ({ ...s, items: s.items.filter(match) }));
  const total = filtered.reduce((n, s) => n + s.items.length, 0);

  const cards = filtered.filter((s) => !JOURNEY.includes(s.slug));
  const journey = JOURNEY.map((slug) =>
    filtered.find((s) => s.slug === slug),
  ).filter((s): s is LocalSection => s !== undefined);
  const journeyTotal = journey.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-8">
          {/* The filter as a shell command that writes itself — the signature. */}
          <p className="text-sm leading-7">
            <span className="text-muted">% </span>
            <span className="text-accent">find</span>{" "}
            <span className="text-fg">portfolio</span>
            {years.map((y) => (
              <span key={y}>
                {" "}
                <span className="text-muted">--year</span>{" "}
                <span className="tabular-nums text-amber">{y}</span>
              </span>
            ))}
            {tags.map((t) => (
              <span key={t}>
                {" "}
                <span className="text-muted">--tag</span>{" "}
                <span className="text-accent">{t}</span>
              </span>
            ))}
            <span className="cursor" aria-hidden />
          </p>

          <p className="mt-2 flex items-center text-sm text-muted">
            <span aria-live="polite">
              → {active ? ui.matches(total) : ui.showingAll(total)}
            </span>
            {active && (
              <button
                onClick={() => {
                  setYears([]);
                  setTags([]);
                }}
                className="ml-3 border border-line px-2 py-0.5 text-xs text-amber transition-colors hover:border-amber"
              >
                {ui.clear}
              </button>
            )}
          </p>

          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="w-10 shrink-0 text-xs text-muted">{ui.year}</span>
              {allYears.map((y) => {
                const on = years.includes(y);
                return (
                  <button
                    key={y}
                    aria-pressed={on}
                    onClick={() => toggle(y, years, setYears)}
                    className={`border px-2 py-0.5 text-xs tabular-nums transition-colors ${
                      on
                        ? "border-amber text-amber"
                        : "border-line text-muted hover:border-fg hover:text-fg"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="w-10 shrink-0 text-xs text-muted">{ui.tag}</span>
              {allTags.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    aria-pressed={on}
                    onClick={() => toggle(t, tags, setTags)}
                    className={`border px-2 py-0.5 text-xs transition-colors ${
                      on
                        ? "border-accent text-accent"
                        : "border-line text-muted hover:border-fg hover:text-fg"
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {cards.map((s) =>
        active && s.items.length === 0 ? null : (
          <SectionList
            key={s.slug}
            slug={s.slug}
            title={s.title}
            blurb={s.blurb}
            items={s.items}
            emptyText={ui.empty}
          />
        ),
      )}

      {journey.length > 0 && !(active && journeyTotal === 0) && (
        <Tabs groups={journey} noMatches={ui.noMatches} />
      )}
    </>
  );
}
