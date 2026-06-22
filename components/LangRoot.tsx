"use client";

import { useState } from "react";
import type { Lang, LocalSection } from "@/lib/content";
import { INTRO, EDUCATION, UI } from "@/lib/i18n";
import Terminal from "./Terminal";
import Browser from "./Browser";

export default function LangRoot({
  data,
}: {
  data: { en: LocalSection[]; th: LocalSection[] };
}) {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex border border-line bg-bg/85 text-xs backdrop-blur">
        {(["en", "th"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`px-2.5 py-1 uppercase transition-colors ${
              lang === l
                ? "bg-accent text-bg"
                : "text-muted hover:text-fg"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <main className="w-full">
        <Terminal intro={INTRO[lang]} education={EDUCATION[lang]} />
        <Browser sections={data[lang]} ui={UI[lang]} />
        <footer className="mx-auto max-w-3xl px-5 py-10 text-xs text-muted">
          <span className="text-accent">chinavat</span> ~ %
          <span className="cursor" aria-hidden />
        </footer>
      </main>
    </>
  );
}
