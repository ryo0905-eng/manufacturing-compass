import type { Metadata } from "next";
import { FilterableCompanies } from "@/components/FilterableCompanies";
import { companies, segments } from "@/data/companies";

export const metadata: Metadata = {
  title: "半導体企業一覧",
  description: "半導体企業をファウンドリ、メモリ、製造装置、ファブレスなどのセグメント別に調べられる企業データベースです。",
};

type CompaniesPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const { query = "" } = await searchParams;

  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Companies</p>
        <h1>半導体企業一覧</h1>
        <p>会社名だけでなく、業界での役割、主な職種、英語必要度、キャリア準備ポイントまでまとめて確認できます。</p>
      </section>
      <FilterableCompanies companies={companies} initialQuery={query} segments={segments} />
    </main>
  );
}
