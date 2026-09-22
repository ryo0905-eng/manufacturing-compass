'use client';

import Image from 'next/image';
import { memo, useState, type CSSProperties } from 'react';
import styles from './ranking-time-machine.module.css';

// The chart button supplies the accessible company name, including historical names.
export const CompanyLogo = memo(function CompanyLogo({ src, name, aspectRatio = 1 }: {
  src?: string; name: string; aspectRatio?: number;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (!src || failedSrc === src) return <span className={styles.companyName} aria-hidden="true">{name}</span>;
  return <span className={styles.companyLogo} aria-hidden="true" style={{ '--logo-aspect-ratio': aspectRatio } as CSSProperties}>
    <Image src={src} alt="" width={256} height={256} unoptimized loading="eager" onError={() => setFailedSrc(src)} />
  </span>;
});
