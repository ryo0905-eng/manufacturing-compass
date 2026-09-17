import type { Metadata } from 'next';
import Link from 'next/link';
import { RoleMapPrototype } from '@/components/RoleMapPrototype';
import { StructuredData } from '@/components/StructuredData';
import { roleMapProfiles } from '@/data/role-map-prototype';
import { siteUrl } from '@/lib/format';

export const metadata: Metadata = {
  title: '仕事内容から探す 半導体職種マップ｜職種名・求人検索語を整理',
  description: '工程改善、設備、品質、生産性改善など、実際に担当した仕事内容から、接点のある半導体職種名と求人検索語を理由付きで整理します。登録不要です。',
  alternates: { canonical: '/roles' },
  openGraph: {
    title: '仕事内容から探す 半導体職種マップ',
    description: '実際に担当した仕事内容から、接点のある半導体職種名と求人検索語を整理します。',
    type: 'website',
    url: '/roles',
  },
};

export default function RolesPage() {
  return (
    <main className="page">
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'ホーム', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: '半導体職種マップ', item: `${siteUrl}/roles` },
        ],
      }} />
      <StructuredData data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '半導体職種マップで扱う職務群',
        numberOfItems: roleMapProfiles.length,
        itemListElement: roleMapProfiles.map((profile, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: profile.title,
        })),
      }} />
      <nav className="cpk-breadcrumb" aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><span>半導体職種マップ</span></nav>
      <RoleMapPrototype />
    </main>
  );
}
