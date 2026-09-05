import type { Metadata } from 'next';
import { CareerPrioritiesNote } from '@/components/CareerPrioritiesNote';

export const metadata: Metadata = {
  title: '転職の優先順位・譲れない条件を整理する｜転職の軸ノート',
  description: '転職で変えたいこと・残したいことから、今の仮の優先順位と、求人票・面接で確認したい質問を整理します。',
  alternates: { canonical: '/career-priorities' },
  openGraph: { title: '転職の優先順位・譲れない条件を整理する｜転職の軸ノート', description: '勤務地・仕事内容・待遇などの希望から、仮の優先順位と面接で確認したい質問を整理。ログイン不要で、相談メモをコピーできます。', url: '/career-priorities', type: 'website' },
};

export default function CareerPrioritiesPage() {
  return <main className="page">
    <header style={{ maxWidth: 720, margin: '0 auto 24px' }}>
      <p className="section-label">CAREER NOTE</p>
      <h1>転職の軸ノート</h1>
      <p>転職の優先順位・譲れない条件を整理する</p>
      <p>勤務地、仕事内容、給与・待遇、働き方、職場文化。変えたいことと残したいことから、求人票を読む軸と面接で確認する質問をまとめます。優先順位がまだ決まっていなくても使えます。</p>
    </header>
    <CareerPrioritiesNote />
  </main>;
}
