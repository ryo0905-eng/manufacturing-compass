import { TrackedInternalLink } from "@/components/TrackedInternalLink";
import { isEnglishPracticalToolPublished, type EnglishPracticalToolId } from "@/data/practical-tools-english";
import type { ToolLocale } from "@/data/practical-tool-text";

export function PracticalToolLanguageLink({ id, locale }: { id: EnglishPracticalToolId; locale: ToolLocale }) {
  if (locale === "ja" && !isEnglishPracticalToolPublished(id)) return null;
  const destination = `${locale === "ja" ? "/en" : ""}/tools/${id}`;
  return <nav className="tool-related-links" aria-label={locale === "ja" ? "ツールの言語" : "Tool language"}>
    <TrackedInternalLink href={destination} hrefLang={locale === "ja" ? "en" : "ja"}
      eventName="tool_language_switch" eventProperties={{ tool_id: id, locale, source_page: `${locale === "en" ? "/en" : ""}/tools/${id}`, destination_path: destination }}>
      {locale === "ja" ? "Use in English" : "日本語 (Japanese)"}
    </TrackedInternalLink>
  </nav>;
}
