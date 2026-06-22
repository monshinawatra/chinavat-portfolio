"use client";

import { useState } from "react";
import type { Item } from "@/lib/content";
import Timeline from "./Timeline";

type Group = { slug: string; title: string; blurb: string; items: Item[] };

export default function Tabs({
  groups,
  noMatches,
}: {
  groups: Group[];
  noMatches: string;
}) {
  // `cd` into a directory — switching tabs reads as changing folders.
  const [active, setActive] = useState(groups[0]?.slug);
  const current = groups.find((g) => g.slug === active) ?? groups[0];

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span>
            <span className="text-muted">% </span>
            <span className="text-accent">cd</span>
          </span>
          {groups.map((g) => {
            const on = g.slug === current.slug;
            return (
              <button
                key={g.slug}
                onClick={() => setActive(g.slug)}
                aria-pressed={on}
                className={`border-b pb-0.5 transition-colors ${
                  on
                    ? "border-amber text-accent"
                    : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {g.title}/
                <span className="ml-1 text-muted">({g.items.length})</span>
              </button>
            );
          })}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{current.blurb}</p>
        {current.items.length === 0 ? (
          <p className="mt-5 text-sm text-muted">{noMatches}</p>
        ) : (
          <Timeline items={current.items} />
        )}
      </div>
    </section>
  );
}
