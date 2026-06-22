import Terminal from "@/components/Terminal";
import SectionList from "@/components/SectionList";
import { SECTIONS } from "@/lib/content";

export default function Home() {
  return (
    <main className="w-full">
      <Terminal />
      {SECTIONS.map((s) => (
        <SectionList key={s.slug} slug={s.slug} title={s.title} />
      ))}
      <footer className="mx-auto max-w-3xl px-5 py-10 text-xs text-muted">
        <span className="text-accent">chinavat</span> ~ %
        <span className="cursor" aria-hidden />
      </footer>
    </main>
  );
}
