'use client';

import Image from 'next/image';
import { memo, useState } from 'react';
import styles from './ranking-time-machine.module.css';

// Decorative: the adjacent company name is always the accessible label.
export const CompanyLogo = memo(function CompanyLogo({ src }: { src?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return <span className={styles.companyLogo} aria-hidden="true">
    {src && failedSrc !== src ? <Image src={src} alt="" width={32} height={32} unoptimized loading="eager"
      onError={() => setFailedSrc(src)} /> : <span className={styles.logoPlaceholder} />}
  </span>;
});
