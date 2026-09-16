import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RoleMapPrototype } from '@/components/RoleMapPrototype';

export const metadata: Metadata = {
  title: '半導体職種マップ 検証用プロトタイプ',
  description: '仕事内容から半導体求人の職種名と検索語を探す、非公開の検証用プロトタイプです。',
  robots: { index: false, follow: false, noarchive: true },
};

export default function RoleMapPrototypePage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <main className="page"><RoleMapPrototype /></main>;
}
