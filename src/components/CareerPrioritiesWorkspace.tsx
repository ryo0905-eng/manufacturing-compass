'use client';

import { useEffect, useState } from 'react';
import { CareerPrioritiesNote } from './CareerPrioritiesNote';
import { WorkstyleCheck } from './WorkstyleCheck';
import { trackEvent } from '@/lib/analytics';
import styles from './CareerPrioritiesNote.module.css';

export function CareerPrioritiesWorkspace() {
  const [mode, setMode] = useState('priorities');
  useEffect(() => {
    const sync = () => setMode(window.location.hash === '#workstyle' ? 'workstyle' : 'priorities');
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  return <>
    <nav className={`${styles.workspace} ${styles.picks}`} aria-label="整理したいこと">
      <a href="#priorities" aria-current={mode === 'priorities' ? 'true' : undefined} onClick={() => setMode('priorities')}>転職全体の優先順位を整理する</a>
      <a href="#workstyle" aria-current={mode === 'workstyle' ? 'true' : undefined} onClick={() => { setMode('workstyle'); trackEvent('workstyle_check_entry', { cta_location: 'note_mode' }); }}>半導体の仕事・働き方を確認する</a>
    </nav>
    <section id="priorities" hidden={mode !== 'priorities'}><CareerPrioritiesNote /></section>
    <section id="workstyle" hidden={mode !== 'workstyle'}>
      <h2 className={`${styles.workspace} ${styles.heading}`}>半導体の仕事・働き方チェック</h2>
      <WorkstyleCheck />
    </section>
  </>;
}
