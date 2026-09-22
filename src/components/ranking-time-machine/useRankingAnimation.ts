'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { interpolateRankingRows, rankingPlaybackInterval, type RankedCompany } from '@/lib/ranking-time-machine';

export function useRankingAnimation(rows: readonly RankedCompany[], year: number, animate: boolean) {
  const [frame, setFrame] = useState({ rows, fromYear: year, interpolating: false });
  const previous = useRef({ rows, year });

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = { rows, year };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let cancelled = false;
    const settle = () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      setFrame({ rows, fromYear: year, interpolating: false });
    };
    const motionChanged = () => { if (motion.matches) settle(); };
    motion.addEventListener('change', motionChanged);

    if (!animate || motion.matches || from.year === year) {
      settle();
    } else {
      const start = performance.now();
      setFrame({ rows: interpolateRankingRows(from.rows, rows, 0), fromYear: from.year, interpolating: true });
      const advance = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - start) / rankingPlaybackInterval);
        setFrame({ rows: interpolateRankingRows(from.rows, rows, progress), fromYear: from.year, interpolating: progress < 1 });
        if (progress < 1) frameId = requestAnimationFrame(advance);
      };
      frameId = requestAnimationFrame(advance);
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      motion.removeEventListener('change', motionChanged);
    };
  }, [rows, year, animate]);

  return frame;
}
