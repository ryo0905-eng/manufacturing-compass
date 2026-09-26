import type { FactoryProject } from "@/data/factory-projects";
import Link from "next/link";
import styles from "./ChipPulseDashboard.module.css";

export function InvestmentRadar({ projects, onRelatedClick }: { projects: FactoryProject[]; onRelatedClick: (destination: string) => void }) {
  return (
    <section className={styles.investments} aria-labelledby="investment-radar-title">
      <header className={styles.sectionHeading}><div><span>INVESTMENT RADAR / VERIFIED DATA</span><h2 id="investment-radar-title">工場・設備投資</h2></div><p>既存の出典付き公開データ</p></header>
      {projects.length > 0 ? <div className={styles.investmentList}>{projects.map((project) => (
        <article key={project.id}><span>{project.stage}</span><h3>{project.name}</h3><p>{project.location}</p><strong>{project.actual}</strong><small>確認日 {project.checkedAt.replaceAll("-", ".")}</small></article>
      ))}</div> : <p className={styles.emptyText}>この条件に該当する国内工場プロジェクトはありません。</p>}
      <Link href="/guides/japan-semiconductor-factory-projects" onClick={() => onRelatedClick("factory_projects")}>主要案件の節目と予定を比較する →</Link>
    </section>
  );
}
