import Image from "next/image";
import { countryFlagAssets } from "@/data/company-regions";
import styles from "./CountryRegion.module.css";

export function CountryRegion({ country }: { country: string }) {
  const flag = countryFlagAssets[country];

  return (
    <span className={styles.region}>
      {flag && <Image src={flag} alt="" aria-hidden="true" width={18} height={12} loading="lazy" />}
      <span>{country}</span>
    </span>
  );
}
