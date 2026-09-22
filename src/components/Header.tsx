import Link from "next/link";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import styles from "@/components/Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="Manufacturing Compass ホーム">
          <span className={styles.mark} aria-hidden="true">MC</span>
          <span className={styles.name}>Manufacturing <span>Compass</span></span>
        </Link>
        <HeaderNavigation />
      </div>
    </header>
  );
}
