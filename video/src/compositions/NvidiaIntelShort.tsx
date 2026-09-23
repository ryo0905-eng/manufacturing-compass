import {AbsoluteFill, Html5Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {rankingTimeMachineSnapshots} from '../../../src/data/ranking-time-machine';
import {nvidiaIntelManifest as manifest} from '../../manifests/nvidia-intel';
import {theme} from '../theme';

export const raceData = rankingTimeMachineSnapshots.map(snapshot => ({year: snapshot.year, nvidia: snapshot.entries.find(e => e.companyId === 'nvidia')!.valueUsdB, intel: snapshot.entries.find(e => e.companyId === 'intel')!.valueUsdB}));
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
export function frameState(frame: number) {
  const time = Math.max(0, Math.min(15, (frame - 120) / 60));
  const index = Math.floor(time), fraction = time - index;
  const from = raceData[index], to = raceData[Math.min(15, index + 1)];
  const nvidia = from.nvidia + (to.nvidia - from.nvidia) * fraction;
  const intel = from.intel + (to.intel - from.intel) * fraction;
  const startDiff = from.nvidia - from.intel, endDiff = to.nvidia - to.intel;
  let position = startDiff > 0 ? 0 : 1;
  if (startDiff * endDiff < 0) {
    const crossing = -startDiff / (endDiff - startDiff);
    const move = smooth((fraction - crossing + .12) / .24);
    position = startDiff > 0 ? move : 1 - move;
  }
  return {from, to, fraction, nvidia, intel, position, final: frame >= 1020};
}
const format = (n: number) => n.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

export const NvidiaIntelShort = () => {
  const frame = useCurrentFrame();
  const state = frameState(frame);
  const {nvidia, intel, position, final} = state;
  const max = Math.max(nvidia, intel);
  const intro = frame < 120;
  const crossover = frame >= 720 && frame < 900;
  const title = intro ? '2010年末は、Intelが上。' : final ? '2025年末、差はここまで。' : crossover ? '2020年末には、逆転。' : '年を進めると…';
  return <AbsoluteFill style={{background: theme.background, color: theme.text, fontFamily: theme.font}}>
    <Html5Audio src={staticFile(manifest.audio.bgmFile)} volume={f => interpolate(f, [0, 30, 1185, 1260], [0, manifest.audio.volume, manifest.audio.volume, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    <div style={{position: 'absolute', top: 100, left: 70, fontSize: 25, fontWeight: 700, color: theme.muted}}>Manufacturing Compass</div>
    <div style={{position: 'absolute', top: 180, left: 70, right: 135}}>
      <div style={{fontSize: 68, fontWeight: 800, lineHeight: 1.3}}>NVIDIA <span style={{color: theme.muted, fontSize: 40}}>vs</span> Intel</div>
      <div style={{fontSize: 39, marginTop: 18}}>時価総額の15年を、一気に。</div>
    </div>
    <div style={{position: 'absolute', top: 365, left: 70, right: 135}}>
      <div style={{fontSize: 42, fontWeight: 700}}>{title}</div>
      <div style={{fontSize: 125, fontWeight: 800, letterSpacing: '-.05em', marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>{state.from.year}<span style={{fontSize: 34, letterSpacing: 0, marginLeft: 20, color: theme.muted}}>{state.fraction > 0 ? `→ ${state.to.year}` : '年末'}</span></div>
      <div style={{fontSize: 26, color: theme.muted}}>企業全体の時価総額 ／ 単位：十億米ドル</div>
    </div>
    <div style={{position: 'absolute', top: 700, left: 70, right: 145, height: 460}}>
      {([{id: 'nvidia', name: 'NVIDIA', value: nvidia, place: position, color: '#53851c'}, {id: 'intel', name: 'Intel', value: intel, place: 1-position, color: theme.chart}] as const).map(row => <div key={row.id} style={{position: 'absolute', top: row.place * 220, left: 0, right: 0}}>
        <div style={{display: 'flex', height: 75, alignItems: 'center', gap: 22}}>
          <div style={{fontSize: 31, fontWeight: 700, width: 52}}>{row.value >= max ? 1 : 2}<span style={{fontSize: 21}}>位</span></div>
          <Img src={staticFile(`logos/${row.id}.png`)} style={{width: 105, height: 85, objectFit: 'contain'}} />
          <div style={{fontSize: 43, fontWeight: 800}}>{row.name}</div>
          <div style={{fontSize: 46, fontWeight: 700, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums'}}>{format(row.value)}</div>
        </div>
        <div style={{background: '#e7e9ed', height: 72, marginTop: 20, borderRadius: 8, overflow: 'hidden'}}><div style={{height: '100%', width: `${row.value / max * 100}%`, background: row.color, borderRadius: 8}} /></div>
      </div>)}
    </div>
    <div style={{position: 'absolute', left: 70, right: 145, top: 1195}}>
      <div style={{height: 8, background: theme.border, borderRadius: 4}}><div style={{width: `${clamp((frame-120)/900)*100}%`, height: 8, background: theme.action, borderRadius: 4}} /></div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, color: theme.muted, marginTop: 16}}><span>2010</span><span>2015</span><span>2020</span><span>2025</span></div>
    </div>
    <div style={{position: 'absolute', top: 1320, left: 70, right: 145, padding: '30px 34px', borderRadius: 18, background: final ? theme.text : theme.selected, color: final ? 'white' : theme.text}}>
      <div style={{fontSize: 36, fontWeight: 700, lineHeight: 1.5}}>{final ? <>日本企業・トヨタとも比較。<br />次は、あなたが動かす番。</> : <>年末の2点の間を、滑らかに表示。<br />逆転した日を示すものではありません。</>}</div>
      {final && <div style={{fontSize: 29, marginTop: 13}}>Manufacturing Compassで検索</div>}
    </div>
    <div style={{position: 'absolute', top: 1570, left: 70, right: 145, fontSize: 25, lineHeight: 1.65, color: theme.muted}}>
      <div>{final || intro ? '表示：年末の確定値' : '表示：年末値の間を補間した演出値'} · 2社内の順位</div>
      <div>横軸の最大値は変動 ／ 出典：CompaniesMarketCap</div>
      <div>2010〜2025年末・確認日 2026-09-23</div>
    </div>
  </AbsoluteFill>;
};
