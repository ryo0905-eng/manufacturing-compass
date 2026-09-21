import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import type { CpkLocale } from "@/data/cpk-text";

export function CpkLanguageLink({ locale }: { locale: CpkLocale }) {
  const destination = locale === "ja" ? "/en/tools/cpk" : "/tools/cpk";
  return <nav className="tool-related-links" aria-label={locale === "ja" ? "ツールの言語" : "Tool language"}>
    <TrackedInternalLink href={destination} hrefLang={locale === "ja" ? "en" : "ja"}
      eventName="cpk_language_switch"
      eventProperties={{ source_page: locale === "ja" ? "/tools/cpk" : "/en/tools/cpk", locale, destination_path: destination }}
    >{locale === "ja" ? "Use in English" : "日本語 (Japanese)"}</TrackedInternalLink>
  </nav>;
}
