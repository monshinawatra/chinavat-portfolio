import LangRoot from "@/components/LangRoot";
import { getLocalizedSections } from "@/lib/content";

export default function Home() {
  // Build both language views at build time; the client toggle swaps between
  // them without re-hitting the filesystem.
  const data = {
    en: getLocalizedSections("en"),
    th: getLocalizedSections("th"),
  };
  // Frozen at build time → the site's last deploy/update date.
  const updated = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });
  return <LangRoot data={data} updated={updated} />;
}
