"use client";

import type { CSSProperties } from "react";
import { jevRouteInfo } from "@/data/jev-demo";
import { factoryAreas, getVisualScene, routeArea, visualCases, type FactoryArea } from "@/data/jev-visual";
import type { JevResult } from "@/lib/jev-demo";
import styles from "@/app/labs/jev/jev.module.css";

function PixelIcon({ kind }: { kind: FactoryArea | "worker" }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" className={styles.pixelIcon} shapeRendering="crispEdges">
    {kind === "material" ? <><path fill="#bd854f" d="M6 14h36v28H6z"/><path fill="#f1c980" d="M6 8h36v8H6zM21 16h6v26h-6z"/><path fill="#594432" d="M10 24h8v4h-8zM30 30h8v4h-8z"/></>
      : kind === "equipment" ? <><path fill="#9aafba" d="M4 10h40v30H4z"/><path fill="#def0e9" d="M8 14h22v16H8z"/><path fill="#315365" d="M12 18h14v8H12zM8 40h6v4H8zM34 40h6v4h-6z"/><path fill="#f0ca6e" d="M34 16h6v6h-6z"/><path fill="#526c7c" d="M34 26h6v10h-6zM8 34h22v2H8z"/></>
      : kind === "metrology" ? <><path fill="#bacbc8" d="M4 6h40v30H4zM20 36h8v6h-8zM10 42h28v4H10z"/><path fill="#233e51" d="M8 10h32v22H8z"/><path fill="#91ded9" d="M12 23h5v-8h4v12h5v-8h4v4h6v4H12z"/></>
      : kind === "worker" ? <><path fill="#f5d481" d="M14 4h20v8H10v4h28v-4h-4z"/><path fill="#e6ba92" d="M14 16h20v12H14z"/><path fill="#58a5bc" d="M10 28h28v12H10z"/><path fill="#1d364a" d="M14 40h8v8h-8zM28 40h8v8h-8zM18 20h3v3h-3zM28 20h3v3h-3z"/></>
      : <><path fill="#547b88" d="M8 8h32v38H8z"/><path fill="#e5e7cf" d="M12 12h24v30H12z"/><path fill="#b9a776" d="M18 4h12v12H18z"/><path fill="#637d80" d="M16 22h16v3H16zM16 29h16v3H16zM16 36h10v2H16z"/></>}
  </svg>;
}

type Props = {
  sampleId: string; enabled: boolean; evidenceId: string | null; initial?: JevResult; selected?: JevResult;
  pending: boolean; error: string; chooseEvidence: (id: string | null) => void; run: (id: string | null) => void;
};
export function JevFactoryExperience({ sampleId, enabled, evidenceId, initial, selected, pending, error, chooseEvidence, run }: Props) {
  const scene = getVisualScene(sampleId, evidenceId);
  const current = selected ?? initial;
  const route = current ? jevRouteInfo(current.decisions.route.choice) : null;
  const area = current ? routeArea[current.decisions.route.choice] : null;
  const markerIndex = factoryAreas.findIndex(item => item.id === area);
  const previous = initial ? jevRouteInfo(initial.decisions.route.choice) : null;
  const compared = Boolean(evidenceId && selected && initial);
  const status = pending ? (initial ? "確認中・表示は初報" : "Jevに確認中…") : evidenceId && !selected ? "未評価・表示は初報" : selected ? evidenceId ? "追加後の提案" : "初報の提案" : "情報を見て、Jevに聞こう";
  return <div className={styles.experience} data-testid="jev-experience">
    <div className={styles.scene} aria-label="固定教材の工場図">
      <h2>{scene.title}</h2>
      <div className={styles.stations}>
        {factoryAreas.map(item => <div className={styles.station} key={item.id} data-target={area === item.id}>
          <PixelIcon kind={item.id} /><strong>{item.label}</strong>
          <div className={styles.observations}>{scene.stations[item.id].map((text, i) => <span key={i}>{text}</span>)}</div>
        </div>)}
        {area && <div className={styles.marker} style={{ "--index": markerIndex } as CSSProperties} aria-hidden="true"><PixelIcon kind="worker" /><span>次に確認</span></div>}
      </div>
      <p className={styles.sceneNote}>{scene.note}</p>
    </div>
    <div className={styles.switches} aria-label="情報切替">
      <button type="button" aria-pressed={evidenceId === null} disabled={pending} onClick={() => chooseEvidence(null)}>最初</button>
      {visualCases[sampleId].branches.map(branch => <button type="button" key={branch.id} aria-pressed={evidenceId === branch.id} disabled={!initial || pending} onClick={() => chooseEvidence(branch.id)}>{branch.label}</button>)}
    </div>
    <div className={styles.result} aria-busy={pending} data-testid="jev-result">
      <div className={styles.answer} role="status">
        <small>{status}</small>
        <strong>{route ? "次は「" + route.label + "」を確認" : "次は、どこを調べる？"}</strong>
        <span>{compared && previous ? initial!.decisions.route.choice === selected!.decisions.route.choice ? "初報から確認先は同じ" : "初報：" + previous.label + " → " + route!.label : "原因の確定ではありません"}</span>
      </div>
      <button className={styles.run} type="button" disabled={!enabled || pending || Boolean(selected)} onClick={() => run(evidenceId)}>{pending ? "確認中…" : selected ? "✓ 評価済み" : error ? "再試行" : "Jevに聞く"}</button>
    </div>
    {error ? <p className={styles.error} role="alert">{error}</p> : <p className={styles.footnote}>{enabled ? "実行時に架空報告をTypeSafe AIへ送信 · A/Bは別の状況" : "API接続準備中 · 評価は実行できません"}</p>}
  </div>;
}
