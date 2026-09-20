"use client";

import { jevRoutes, type JevRoute } from "@/data/jev-demo";
import { factoryAreas, getVisualScene, formatProbability, formatProbabilityDelta, visualCases, type FactoryArea } from "@/data/jev-visual";
import type { JevResult } from "@/lib/jev-demo";
import styles from "@/app/labs/jev/jev.module.css";

function PixelIcon({ kind }: { kind: FactoryArea }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" className={styles.pixelIcon} shapeRendering="crispEdges">
    {kind === "material" ? <><path fill="#bd854f" d="M6 14h36v28H6z"/><path fill="#f1c980" d="M6 8h36v8H6zM21 16h6v26h-6z"/><path fill="#594432" d="M10 24h8v4h-8zM30 30h8v4h-8z"/></>
      : kind === "equipment" ? <><path fill="#9aafba" d="M4 10h40v30H4z"/><path fill="#def0e9" d="M8 14h22v16H8z"/><path fill="#315365" d="M12 18h14v8H12zM8 40h6v4H8zM34 40h6v4h-6z"/><path fill="#f0ca6e" d="M34 16h6v6h-6z"/><path fill="#526c7c" d="M34 26h6v10h-6zM8 34h22v2H8z"/></>
      : kind === "metrology" ? <><path fill="#bacbc8" d="M4 6h40v30H4zM20 36h8v6h-8zM10 42h28v4H10z"/><path fill="#233e51" d="M8 10h32v22H8z"/><path fill="#91ded9" d="M12 23h5v-8h4v12h5v-8h4v4h6v4H12z"/></>
      : <><path fill="#547b88" d="M8 8h32v38H8z"/><path fill="#e5e7cf" d="M12 12h24v30H12z"/><path fill="#b9a776" d="M18 4h12v12H18z"/><path fill="#637d80" d="M16 22h16v3H16zM16 29h16v3H16zM16 36h10v2H16z"/></>}
  </svg>;
}

const routeKeys = Object.keys(jevRoutes) as JevRoute[];
type Props = {
  sampleId: string; enabled: boolean; evidenceId: string | null; initial?: JevResult; selected?: JevResult;
  pending: boolean; error: string; started: boolean;
  chooseEvidence: (id: string | null) => void; start: () => void; retry: () => void;
};
export function JevFactoryExperience({ sampleId, enabled, evidenceId, initial, selected, pending, error, started, chooseEvidence, start, retry }: Props) {
  const scene = getVisualScene(sampleId, evidenceId);
  const current = selected ?? initial;
  const before = evidenceId && selected ? initial : undefined;
  const status = pending ? (initial ? "更新中・初報の結果" : "評価中…")
    : error ? (initial ? "更新失敗・初報の結果" : "評価に失敗しました")
    : selected ? evidenceId ? "追加情報の結果" : "初報の結果"
    : current ? "未評価・初報の結果" : "開始すると確率が表示されます";
  return <div className={styles.experience} data-testid="jev-experience">
    <div className={styles.input}>
      <div className={styles.scene} aria-label="固定教材の工場図">
        <h2>{scene.title}</h2>
        <div className={styles.stations}>
          {factoryAreas.map(item => <div className={styles.station} key={item.id}>
            <PixelIcon kind={item.id} /><strong>{item.label}</strong>
            <div className={styles.observations}>{scene.stations[item.id].map((text, i) => <span key={i}>{text}</span>)}</div>
          </div>)}
        </div>
        <p className={styles.sceneNote}>{scene.note}</p>
      </div>
      <div className={styles.switches} aria-label="情報切替">
        <button type="button" aria-pressed={evidenceId === null} disabled={pending} onClick={() => chooseEvidence(null)}>最初</button>
        {visualCases[sampleId].branches.map(branch => <button type="button" key={branch.id} aria-pressed={evidenceId === branch.id} disabled={!initial || pending} onClick={() => chooseEvidence(branch.id)}>{branch.label}</button>)}
      </div>
      <p className={styles.footnote}>A/Bは別の状況 · 開始後は切替で自動評価</p>
    </div>
    <section className={styles.result} aria-label="確率分布" aria-busy={pending} data-testid="jev-result">
      <header className={styles.distributionHeader}>
        <h2>次に確認する先の選択確率</h2>
        <p>原因の確率・正解率ではありません</p>
      </header>
      <div className={styles.status} role="status">{status}</div>
      <div className={styles.probabilities} role="list" aria-label="9選択肢・共通尺度0〜100％">
        {routeKeys.map(id => {
          const value = current?.decisions.route.probabilities[id];
          const baseline = before?.decisions.route.probabilities[id];
          const formatted = value === undefined ? "未評価" : formatProbability(value);
          const difference = baseline === undefined || value === undefined ? null : formatProbabilityDelta(baseline, value);
          return <div className={styles.probabilityRow} role="listitem" key={id} data-route={id}
            aria-label={jevRoutes[id].label + "：" + formatted + (baseline === undefined ? "" : "、初報 " + formatProbability(baseline) + "、差 " + difference)}>
            <span className={styles.routeLabel}>{jevRoutes[id].label}</span>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.fill} style={{ width: value === undefined ? "0%" : value * 100 + "%" }} />
              {baseline !== undefined && <span className={styles.baseline} style={{ left: baseline * 100 + "%" }} />}
            </div>
            <span className={styles.value}>{value === undefined ? "—" : formatted}</span>
            <span className={styles.delta}>{difference ?? "—"}</span>
          </div>;
        })}
      </div>
      <p className={styles.legend}>{before ? "細線＝初報 ／ pt＝初報からの増減" : "共通目盛り 0〜100％ ／ 追加後は初報と比較"}</p>
      {!started && <div className={styles.start}>
        <p>開始後、選んだ架空報告をTypeSafe AIへ送信します。</p>
        <button className={styles.run} type="button" disabled={!enabled || pending} onClick={start}>開始する</button>
      </div>}
      {error && <div className={styles.failure}><p className={styles.error} role="alert">{error}</p><button type="button" className={styles.run} disabled={!enabled || pending} onClick={retry}>再試行</button></div>}
      {!enabled && <p className={styles.footnote}>API接続準備中 · 評価は実行できません</p>}
    </section>
  </div>;
}
