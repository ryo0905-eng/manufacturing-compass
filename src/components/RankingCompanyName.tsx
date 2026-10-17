import type { ReactNode } from "react";
import { CompanyCardLogo } from "@/components/CompanyCardLogo";
import styles from "./RankingCompanyName.module.css";

export function RankingCompanyName({ companyId, name, children }: { companyId?: string; name: string; children?: ReactNode }) {
  return (
    <span className={styles.company}>
      {companyId && <CompanyCardLogo companyId={companyId} name={name} size="ranking" fallback="none" />}
      <span className={styles.name}>{children ?? name}</span>
    </span>
  );
}
