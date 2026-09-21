import { TrackedInternalLink } from "@/components/TrackedInternalLink";

export function GuideLanguageLink({ slug, locale }: { slug: string; locale: "ja" | "en" }) {
  const japanesePath = `/guides/${slug}` as const;
  const englishPath = `/en/guides/${slug}` as const;
  const destination = locale === "ja" ? englishPath : japanesePath;
  return <nav aria-label={locale === "ja" ? "記事の言語" : "Article language"}>
    <TrackedInternalLink
      href={destination}
      hrefLang={locale === "ja" ? "en" : "ja"}
      lang={locale === "ja" ? "en" : "ja"}
      eventName="article_language_switch"
      eventProperties={{
        source_page: locale === "ja" ? japanesePath : englishPath,
        source_locale: locale,
        destination_path: destination,
        destination_locale: locale === "ja" ? "en" : "ja",
      }}
    >{locale === "ja" ? "Read in English" : "日本語 (Japanese)"}</TrackedInternalLink>
  </nav>;
}
