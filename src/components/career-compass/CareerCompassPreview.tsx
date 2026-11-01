import { CareerAgentsLink } from "@/components/CareerAgentsLink";
import { CareerCompassLink } from "@/components/CareerCompassLink";
import { CareerCompassPreviewView } from "@/components/career-compass/CareerCompassPreviewView";
import { careerCompassEntry } from "@/data/career-compass-entry";
import styles from "./CareerCompassPreview.module.css";

const agentLocations = {
  factoryProjects: "factory_projects_agents",
  memoryRanking: "memory_ranking_agents",
  equipmentRanking: "equipment_ranking_agents",
  salaryRanking: "salary_ranking_agents",
  foundryRanking: "foundry_ranking_agents",
} as const;

export function CareerCompassPreview({ placement }: { placement: keyof typeof careerCompassEntry.placements }) {
  const context = careerCompassEntry.placements[placement];
  const Heading = placement === "intro" ? "h2" : "h3";

  return (
    <aside className={`${styles.preview} ${placement === "intro" ? styles.intro : ""}`.trim()} data-career-compass-preview={placement}>
      <p className="section-label">CAREER COMPASS</p>
      <Heading className={styles.heading}>{careerCompassEntry.heading}</Heading>
      <p className={styles.description}>{placement === "factoryProjects" ? "新工場の建設は採用につながることもあります。この工場で働くことを考えるなら、自分の経験と半導体の仕事の接点や、相談先を確認しましょう。" : careerCompassEntry.description}</p>
      <CareerCompassPreviewView
        source_page={context.sourcePage}
        cta_location={context.ctaLocation}
        cta_variant={careerCompassEntry.variant}
      >
        <dl className={styles.example}>
          {careerCompassEntry.example.map(({ label, value }) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <p className={styles.note}>{careerCompassEntry.note}</p>
      </CareerCompassPreviewView>
      <p className={styles.conditions}>{careerCompassEntry.conditions}</p>
      {placement !== "intro" ? (
        <CareerCompassLink className={`button primary ${styles.button}`} sourcePage={context.sourcePage}
          ctaLocation={context.ctaLocation} ctaVariant={careerCompassEntry.variant}>
          {context.buttonLabel}<span aria-hidden="true">→</span>
        </CareerCompassLink>
      ) : (
        <a className={`button primary ${styles.button}`} href="#career-compass-tool">{context.buttonLabel}</a>
      )}
      {placement in agentLocations && (
        <p className={styles.agentLink}><CareerAgentsLink className="text-link" ctaLocation={agentLocations[placement as keyof typeof agentLocations]}>半導体・製造業に強い転職エージェントを比較する</CareerAgentsLink></p>
      )}
    </aside>
  );
}
