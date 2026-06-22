import Image from "next/image";
import type { IntroStrings, EducationStrings } from "@/lib/i18n";

export default function Terminal({
  intro,
  education,
}: {
  intro: IntroStrings;
  education: EducationStrings;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:gap-8 md:py-24">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-line bg-panel">
          <Image
            src="/profile.jpg"
            alt={intro.name}
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <p className="text-sm text-muted">
            <span className="text-accent">chinavat</span> ~ % whoami
            <span className="cursor" aria-hidden />
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">
            {intro.name}
          </h1>
          <p className="mt-4 max-w-xl text-fg">{intro.tagline}</p>

          {/* education — a labelled record under the intro */}
          <dl className="mt-6 max-w-xl border-l border-line pl-4 text-sm">
            <dt className="text-muted">
              <span className="text-accent">%</span> {education.label}
            </dt>
            <dd className="mt-1 text-fg">{education.degree}</dd>
            <dd className="text-muted">{education.school}</dd>
            <dd className="mt-1 text-amber">{education.status}</dd>
            <dd className="text-muted">{education.note}</dd>
          </dl>

          <div className="mt-6 flex gap-4 text-sm">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener"
              className="border border-line px-3 py-1.5 text-accent transition-colors hover:border-accent"
            >
              {intro.cv} ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
