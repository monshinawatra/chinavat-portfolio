import LangRoot from "@/components/LangRoot";
import { getLocalizedSections } from "@/lib/content";

export default function Home() {
  // Build both language views at build time; the client toggle swaps between
  // them without re-hitting the filesystem.
  const data = {
    en: getLocalizedSections("en"),
    th: getLocalizedSections("th"),
  };
  return <LangRoot data={data} />;
}
