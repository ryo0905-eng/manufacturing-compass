import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCta } from "@/components/AffiliateCta";
import { beginnerGuides } from "@/data/editorial";

export const metadata: Metadata = {
  title: "半導体転職の初心者ガイド",
  description: "半導体業界への転職を考え始めた人向けに、職種、経験の整理、今日やることを短くまとめます。",
};

export default function GuidesPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Starter guides</p>
        <h1>半導体転職の初心者ガイド</h1>
        <p>読み切るためではなく、自分のCareer Questを進めるための短いガイドです。</p>
      </section>

      <section className="article-grid" aria-label="初心者向け記事">
        {beginnerGuides.map((guide) => (
          <Link className="article-card" href={`/guides/${guide.slug}`} key={guide.slug}>
            <span>{guide.readTime}</span>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
            <small>Today Quest: {guide.todayQuest}</small>
          </Link>
        ))}
      </section>

      <AffiliateCta title="ガイドを読んだ後、転職ルートを相談する" />
    </main>
  );
}
