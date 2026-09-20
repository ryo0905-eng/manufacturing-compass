"use client";

import Link from "next/link";
import { useState } from "react";
import { jevRouteInfo } from "@/data/jev-demo";
import { factoryAreas, getVisualEvidence, routeArea, type FactoryArea } from "@/data/jev-visual";
import type { JevResult } from "@/lib/jev-demo";
import { trackEvent } from "@/lib/analytics";
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
  enabled: boolean; evidenceId: string | null; initial?: JevResult; selected?: JevResult;
  pending: boolean; error: string; chooseEvidence: (id: string | null) => void; run: (id: string | null) => void;
};
export function JevFactoryExperience({ enabled, evidenceId, initial, selected, pending, error, chooseEvidence, run }: Props) {
  const [guesses, setGuesses] = useState<Record<string, FactoryArea>>({});
  const stage = evidenceId ?? "initial", guess = guesses[stage];
  const scene = getVisualEvidence(evidenceId);
  const current = selected ?? initial;
  const route = current ? jevRouteInfo(current.decisions.route.choice) : null;
  const currentArea = current ? routeArea[current.decisions.route.choice] : null;
  const markerIndex = factoryAreas.findIndex(item => item.id === currentArea);
  const compared = Boolean(evidenceId && selected && initial);
  const previousRoute = initial ? jevRouteInfo(initial.decisions.route.choice) : null;
  const link = route?.href;
  const status = pending ? (initial ? "確認中 · 初報の提案を表示" : "Jevに確認中…") : evidenceId && !selected ? "追加情報は未評価 · 初報の提案を表示" : compared ? "追加後の提案" : initial ? "初報の提案" : "まずは、あなたならどこを見る？";
  return <div className={styles.factoryExperience}>
    <div className={styles.visualScene} key={stage} aria-label="固定教材の比較図">
      <div className={styles.sceneHeading}><span>観察</span><h3>{scene?.title ?? "材料が替わった。その後、不合格が増えた。"}</h3></div>
      {scene ? <div className={styles.comparisonBoard}>
        <table><caption className={styles.srOnly}>{scene.title}</caption><thead><tr><th scope="col">比較対象</th>{scene.columns.map(column => <th key={column} scope="col"><PixelIcon kind={evidenceId === "across-tools" ? "equipment" : "metrology"} />{column}</th>)}</tr></thead>
          <tbody>{scene.rowLabels.map((label, row) => <tr key={label}><th scope="row"><span className={styles.lotTag}>{row === 0 ? "旧" : "新"}</span>{label}</th>{scene.outcomes[row].map((value, column) => <td key={column}><span className={value === "increase" ? styles.moreRejects : styles.usualOutput}>{value === "increase" ? "× ↑" : "○ →"}</span><small>{value === "increase" ? "不合格が増加" : "従来どおり"}</small></td>)}</tr>)}</tbody>
        </table><p>{scene.caption}</p>
      </div> : <div className={styles.initialFlow}>
        <div><PixelIcon kind="material" /><strong>旧 → 新</strong><small>材料を切替</small></div><b aria-hidden="true">→</b>
        <div><PixelIcon kind="equipment" /><strong>製造</strong><small>ほかの記録は未確認</small></div><b aria-hidden="true">→</b>
        <div><PixelIcon kind="metrology" /><strong className={styles.moreRejects}>× ↑</strong><small>不合格が増えた</small></div>
      </div>}
      <small className={styles.sceneNote}>固定の架空教材 · 記号は傾向の図解（個数・不良率ではありません）</small>
    </div>

    <div className={styles.investigationMap}>
      <div className={styles.mapHeading}><h3>次は、どこを見る？</h3><span>タップで予想 · 採点なし</span></div>
      <div className={styles.factoryStations}>
        {factoryAreas.map(area => <button type="button" key={area.id} aria-pressed={guess === area.id} disabled={pending} onClick={() => setGuesses(previous => ({ ...previous, [stage]: area.id }))}>
          <PixelIcon kind={area.id} /><strong>{area.label}</strong><small>{guess === area.id ? "あなたの予想" : "　"}</small>
        </button>)}
        {currentArea && <div className={styles.jevMarker} style={{ left: `${markerIndex * 25 + 12.5}%` }} aria-hidden="true"><PixelIcon kind="worker" /><span>Jev</span></div>}
      </div>
      <div className={styles.visualResult} aria-busy={pending}>
        <p role="status">{status}</p>
        {route ? <><h3>{route.label}</h3>
          {compared && previousRoute && <p className={styles.routeComparison}>初報：{previousRoute.label} → 追加後：{route.label}<strong>{initial!.decisions.route.choice === selected!.decisions.route.choice ? "確認先は同じ" : "確認先が変わった"}</strong></p>}
          {link && <Link href={link} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("jev_tool_route_click", { route: current!.decisions.route.choice, destination: link })}>{route.link} ↗</Link>}
        </> : <p>材料？ 装置？ それとも検査器？</p>}
        <small>Jevの提案は「次の確認先」。原因の確定ではありません。</small>
      </div>
      {!selected && <button type="button" className={styles.primaryButton} disabled={!enabled || pending} onClick={() => run(evidenceId)}>{pending ? "Jevに確認中…" : evidenceId ? "この比較をJevに見せる" : "Jevなら、どこを見る？"}</button>}
      {selected && <p className={styles.cachedNote}>✓ 評価済み · 切替では再送しません</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.sendNote}>実行時のみ、固定の架空報告をGateway経由でTypeSafe AIへ送信。</p>
    </div>

    <section id="jev-evidence" className={styles.visualBranches} aria-label="追加の比較">
      <h3>もうひとつ、情報を見てみよう</h3>
      <div><button type="button" aria-pressed={evidenceId === null} disabled={!initial || pending} onClick={() => chooseEvidence(null)}>初報に戻る</button>
        <button type="button" aria-pressed={evidenceId === "across-tools"} disabled={!initial || pending} onClick={() => chooseEvidence("across-tools")}>A · 装置を比べる</button>
        <button type="button" aria-pressed={evidenceId === "same-specimen"} disabled={!initial || pending} onClick={() => chooseEvidence("same-specimen")}>B · 検査器を比べる</button></div>
      <p>AとBは別々の状況です。情報は足し合わせません。</p>
    </section>
  </div>;
}
