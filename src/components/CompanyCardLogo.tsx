'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import { companyLogoAssets } from '@/data/company-logos';
import styles from './CompanyCardLogo.module.css';

export function CompanyCardLogo({ companyId, name }: { companyId: string; name: string }) {
  const asset = companyLogoAssets[companyId];
  const [failedSrc, setFailedSrc] = useState<string>();
  const showLogo = asset && failedSrc !== asset.src;
  const initials = name.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || Array.from(name).slice(0, 2).join('');

  return (
    <span className={styles.logo} aria-hidden="true" style={{ '--logo-aspect-ratio': asset?.aspectRatio ?? 1 } as CSSProperties}>
      {showLogo ? (
        <Image src={asset.src} alt="" width={256} height={256} sizes="(max-width: 720px) 88px, 112px" loading="lazy" onError={() => setFailedSrc(asset.src)} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </span>
  );
}
