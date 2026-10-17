'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import { companyLogoAssets } from '@/data/company-logos';
import styles from './CompanyCardLogo.module.css';

export function CompanyCardLogo({ companyId, name, size = 'default', fallback = 'initials' }: { companyId: string; name: string; size?: 'default' | 'compact' | 'overview' | 'ranking'; fallback?: 'initials' | 'none' }) {
  const asset = companyLogoAssets[companyId];
  const [failedSrc, setFailedSrc] = useState<string>();
  const showLogo = asset && failedSrc !== asset.src;
  if (!showLogo && fallback === 'none') return null;
  const initials = name.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || Array.from(name).slice(0, 2).join('');

  return (
    <span className={`${styles.logo}${size === 'ranking' ? ` ${styles.ranking}` : size === 'overview' ? ` ${styles.overview}` : size === 'compact' ? ` ${styles.compact}` : ''}`} aria-hidden="true" style={{ '--logo-aspect-ratio': asset?.aspectRatio ?? 1 } as CSSProperties}>
      {showLogo ? (
        <Image src={asset.src} alt="" width={asset.width ?? 256} height={asset.height ?? 256} sizes={size === 'ranking' ? '64px' : size === 'overview' ? '72px' : size === 'compact' ? '(max-width: 720px) 96px, 112px' : '(max-width: 720px) 88px, 112px'} loading="lazy" onError={() => setFailedSrc(asset.src)} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </span>
  );
}
