import type { Metadata } from "next";
import { englishPracticalTools, isEnglishPracticalToolPublished, type EnglishPracticalToolId } from "@/data/practical-tools-english";
import { siteUrl } from "@/lib/format";

export function practicalToolAlternates(id: EnglishPracticalToolId, locale: "ja" | "en"): Metadata["alternates"] {
  return {
    canonical: `${locale === "en" ? "/en" : ""}/tools/${id}`,
    ...(isEnglishPracticalToolPublished(id) ? { languages: { ja: `${siteUrl}/tools/${id}`, en: `${siteUrl}/en/tools/${id}` } } : {}),
  };
}

export function englishPracticalToolMetadata(id: EnglishPracticalToolId): Metadata {
  const { title, description } = englishPracticalTools[id];
  return {
    title, description,
    robots: { index: isEnglishPracticalToolPublished(id), follow: true },
    alternates: practicalToolAlternates(id, "en"),
    openGraph: { type: "website", locale: "en_US", title, description, url: `${siteUrl}/en/tools/${id}` },
    twitter: { card: "summary", title, description },
  };
}
