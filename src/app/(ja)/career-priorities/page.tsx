import type { Metadata } from 'next';
import { CareerPrioritiesWorkspace } from '@/components/CareerPrioritiesWorkspace';
import styles from '@/components/CareerPrioritiesNote.module.css';

export const metadata: Metadata = {
  title: '転職の優先順位・譲れない条件を整理する｜転職の軸ノート',
  description: '短い質問に答えながら、転職で大切にしたいことや半導体の仕事・働き方を整理。求人票や面談で次に確認する一問を見つけます。',
  alternates: { canonical: '/career-priorities' },
  openGraph: { title: '転職の優先順位・譲れない条件を整理する｜転職の軸ノート', description: '短い質問を選ぶだけで、今の優先条件と次に確認する一問を整理。ログイン不要で相談メモをコピーできます。', url: '/career-priorities', type: 'website' },
};

export default function CareerPrioritiesPage() {
  return <main className="page">
    <header className={styles.pageHeader}>
      <p className="section-label">CAREER GUIDE · 約3分</p>
      <h1>転職の軸ノート</h1>
      <p>気になることを選ぶだけ。固定ルールのガイドが、次に確認する一問を整理します。</p>
    </header>
    <CareerPrioritiesWorkspace />
    <section className={styles.pageInfo} aria-labelledby="priority-about-title">
      <h2 id="priority-about-title">このガイドでできること</h2>
      <p>転職全体の軸では、勤務地・仕事内容・待遇・働き方・職場文化から、変えたいことと残したいことを整理します。半導体の仕事・働き方では、職種と夜勤・出張などの条件から、求人票や面談で聞く質問を作ります。</p>
      <p>返答と質問は編集上の固定ルールです。AIによる診断や、個別求人の勤務条件の判定ではありません。回答は保存・送信されず、相談メモは自分でコピーして持ち帰れます。</p>
    </section>
  </main>;
}
