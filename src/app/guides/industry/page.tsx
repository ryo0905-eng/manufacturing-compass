import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import {
  IndustryGuideDirectory,
  type IndustryDirectoryCollection,
} from "@/components/guide/IndustryGuideDirectory";
import { StructuredData } from "@/components/StructuredData";
import { getGuideBySlug } from "@/content/guides";
import { industryGuideCollections, industryGuideCount } from "@/data/guide-collections";
import { siteUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "半導体企業・装置・材料メーカーの記事一覧",
  description: "半導体企業、製造装置、材料、検査・計測、サブファブ、テスト・後工程の記事を、役割と工程別に整理しています。",
  alternates: { canonical: "/guides/industry" },
};

function getDirectoryCollections(): IndustryDirectoryCollection[] {
  return industryGuideCollections.map((collection) => ({
    ...collection,
    guides: collection.guides.map((entry) => {
      const guide = getGuideBySlug(entry.slug);
      if (!guide) throw new Error(`${entry.slug}: industry guide is not published`);
      return {
        ...entry,
        title: guide.title,
        description: guide.description,
        readTime: guide.readTime,
        updatedAt: guide.updatedAt,
      };
    }),
  }));
}

export default function IndustryGuidesPage() {
  const collections = getDirectoryCollections();
  const directoryGuides = collections.flatMap((collection) => collection.guides);

  return (
    <main className="page guides-industry-page">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl }, { "@type": "ListItem", position: 2, name: "記事・読みもの", item: `${siteUrl}/guides` }, { "@type": "ListItem", position: 3, name: "企業・装置・材料を調べる", item: `${siteUrl}/guides/industry` }] }} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "ItemList", name: "半導体企業・装置・材料メーカーの記事", numberOfItems: directoryGuides.length, itemListElement: directoryGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: `${siteUrl}/guides/${guide.slug}` })) }} />

      <nav className="guides-breadcrumb" aria-label="パンくずリスト">
        <Link href="/guides">記事・読みもの</Link>
        <span aria-hidden="true">/</span>
        <span>企業・装置・材料</span>
      </nav>

      <header className="guides-industry-hero">
        <div>
          <p className="section-label">Company &amp; equipment research</p>
          <h1>企業・装置・材料を、<br />役割から調べる</h1>
          <p>似た名前の記事を一列に並べず、半導体業界の全体像、前工程、検査・計測、サブファブ、後工程に分けました。知りたい企業名や装置名からも検索できます。</p>
        </div>
        <aside>
          <strong>{industryGuideCount}</strong>
          <span>公開記事</span>
          <p>公開情報をもとに、各社の担当領域と装置・材料の違いを整理しています。</p>
        </aside>
      </header>

      <nav className="industry-collection-nav" aria-label="記事コレクション">
        {collections.map((collection) => (
          <a href={`#collection-${collection.id}`} key={collection.id}>
            <strong>{collection.label}</strong>
            <span>{collection.guides.length}記事</span>
          </a>
        ))}
      </nav>

      <IndustryGuideDirectory collections={collections} />

      <AffiliateCta title="企業研究の軸を整理して、転職ルートを相談する" />
      <p className="back-link"><Link className="text-link" href="/guides">記事・読みものへ戻る</Link></p>
    </main>
  );
}
