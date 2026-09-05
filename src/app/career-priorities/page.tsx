import type { Metadata } from 'next';
import { CareerPrioritiesNote } from '@/components/CareerPrioritiesNote';

export const metadata: Metadata = {
  title: '転職の軸ノート',
  description: '転職で変えたいこと・残したいことから、今の仮の優先順位と、求人票・面接で確認したい質問を整理します。',
  alternates: { canonical: '/career-priorities' },
  robots: { index: false, follow: true },
};

export default function CareerPrioritiesPage() {
  return <main className="page">
    <header style={{ maxWidth: 720, margin: '0 auto 24px' }}>
      <p className="section-label">CAREER NOTE</p>
      <h1>転職の軸ノート</h1>
    </header>
    <CareerPrioritiesNote />
  </main>;
}
