"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import type { Company } from "@/types/content";
import { companyCompareSlug } from "@/lib/format";

type CompareSelectorProps = {
  companies: Company[];
};

export function CompareSelector({ companies }: CompareSelectorProps) {
  const [firstCompanyId, setFirstCompanyId] = useState(companies[0]?.id ?? "");
  const [secondCompanyId, setSecondCompanyId] = useState(companies[1]?.id ?? "");

  const href = useMemo<Route>(() => {
    const ids = [firstCompanyId, secondCompanyId].filter(Boolean);
    return ids.length === 2 && ids[0] !== ids[1] ? (`/compare/${companyCompareSlug(ids)}` as Route) : "/compare";
  }, [firstCompanyId, secondCompanyId]);

  const disabled = firstCompanyId === secondCompanyId;

  return (
    <section className="interactive-panel" aria-labelledby="compare-selector-title">
      <div>
        <p className="eyebrow">Compare</p>
        <h2 id="compare-selector-title">比較する企業を選ぶ</h2>
      </div>
      <div className="filters two-column">
        <label>
          <span>企業 1</span>
          <select value={firstCompanyId} onChange={(event) => setFirstCompanyId(event.target.value)}>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nameJa}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>企業 2</span>
          <select value={secondCompanyId} onChange={(event) => setSecondCompanyId(event.target.value)}>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.nameJa}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Link className={disabled ? "button primary disabled" : "button primary"} href={href} aria-disabled={disabled}>
        比較ページを見る
      </Link>
      {disabled ? <p className="form-note">異なる 2 社を選ぶと比較できます。</p> : null}
    </section>
  );
}
