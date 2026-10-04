'use client';

import { useEffect, useState } from 'react';
import { CareerPrioritiesNote } from './CareerPrioritiesNote';
import { WorkstyleCheck } from './WorkstyleCheck';
import { trackEvent } from '@/lib/analytics';
import styles from './CareerPrioritiesNote.module.css';

type Mode = 'priorities' | 'workstyle' | null;
const uiVersion = 'conversation-v2';

export function CareerPrioritiesWorkspace() {
  const [mode, setMode] = useState<Mode>(null);

  useEffect(() => {
    const sync = () => setMode(window.location.hash === '#workstyle' ? 'workstyle' : window.location.hash === '#priorities' ? 'priorities' : null);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return <div className={styles.experience}>
    {mode === null ? <section className={styles.routeChoice} aria-labelledby="route-question">
      <p className={styles.eyebrow}>最初の一問</p>
      <h2 id="route-question">今日は何を整理したい？</h2>
      <p>近いほうを選ぶだけで始められます。</p>
      <div className={styles.routeCards}>
        <a href="#priorities" onClick={() => setMode('priorities')}><span aria-hidden="true">01</span><strong>転職全体の軸</strong><small>次の仕事で大切にしたいこと</small></a>
        <a href="#workstyle" onClick={() => { setMode('workstyle'); trackEvent('workstyle_check_entry', { cta_location: 'note_mode', ui_version: uiVersion }); }}><span aria-hidden="true">02</span><strong>半導体の仕事・働き方</strong><small>気になる職種と勤務条件</small></a>
      </div>
    </section> : <nav className={styles.modeNav} aria-label="整理するテーマ">
      <a href="#priorities" aria-current={mode === 'priorities' ? 'page' : undefined} onClick={() => setMode('priorities')}>転職全体の軸</a>
      <a href="#workstyle" aria-current={mode === 'workstyle' ? 'page' : undefined} onClick={() => { if (mode !== 'workstyle') trackEvent('workstyle_check_entry', { cta_location: 'note_mode', ui_version: uiVersion }); setMode('workstyle'); }}>半導体の働き方</a>
    </nav>}
    <section id="priorities" hidden={mode !== 'priorities'}><CareerPrioritiesNote active={mode === 'priorities'} /></section>
    <section id="workstyle" hidden={mode !== 'workstyle'}><WorkstyleCheck /></section>
  </div>;
}
