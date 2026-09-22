import type { RankingCompany, RankingSnapshot } from '@/data/ranking-time-machine';

export type RankedCompany = RankingCompany & { valueUsdB: number; rank: number; displayName: string };

export function companyName(company: RankingCompany, year: number) {
  return company.historicalNames?.find(item => item.year === year)?.name ?? company.name;
}

export function rankSnapshot(companies: readonly RankingCompany[], snapshot: RankingSnapshot): RankedCompany[] {
  const byId = new Map(companies.map(company => [company.id, company]));
  const seen = new Set<string>();
  if (byId.size !== companies.length || snapshot.entries.length !== companies.length || !companies.length) {
    throw new Error('ランキングの企業数または企業IDが不正です');
  }
  const rows = snapshot.entries.map(entry => {
    const company = byId.get(entry.companyId);
    if (!company || seen.has(entry.companyId) || !Number.isFinite(entry.valueUsdB) || entry.valueUsdB <= 0) {
      throw new Error('ランキングの企業IDまたは時価総額が不正です');
    }
    seen.add(entry.companyId);
    return { ...company, valueUsdB: entry.valueUsdB, rank: 0, displayName: companyName(company, snapshot.year) };
  }).sort((a, b) => b.valueUsdB - a.valueUsdB || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return rows.map(row => ({ ...row, rank: rows.findIndex(item => item.valueUsdB === row.valueUsdB) + 1 }));
}

export function prepareRanking(companies: readonly RankingCompany[], snapshots: readonly RankingSnapshot[]) {
  if (!snapshots.length) throw new Error('年次データがありません');
  return snapshots.map((snapshot, index) => {
    if (!Number.isInteger(snapshot.year) || (index > 0 && snapshot.year !== snapshots[index - 1].year + 1)) {
      throw new Error('年次データは連続した昇順で指定してください');
    }
    return { year: snapshot.year, rows: rankSnapshot(companies, snapshot) };
  });
}

export function formatMarketCap(value: number) {
  return value.toLocaleString('ja-JP', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function rankChange(firstRank: number, currentRank: number) {
  const change = firstRank - currentRank;
  return change === 0 ? '変化なし' : `${Math.abs(change)}位${change > 0 ? '上昇' : '下降'}`;
}

export type TimelineState = { index: number; playing: boolean; selectedId: string; animate: boolean };
export type TimelineAction =
  | { type: 'play' | 'pause' | 'tick' | 'reset' }
  | { type: 'year'; index: number }
  | { type: 'company'; id: string };
export const initialTimeline: TimelineState = { index: 0, playing: false, selectedId: '', animate: false };
export const rankingPlaybackInterval = 3000;

export function reduceTimeline(state: TimelineState, action: TimelineAction, count: number): TimelineState {
  switch (action.type) {
    case 'play': return { ...state, index: state.index === count - 1 ? 0 : state.index, playing: count > 1, animate: false };
    case 'pause': return { ...state, playing: false, animate: false };
    case 'reset': return { ...initialTimeline };
    case 'year': return { ...state, index: Math.max(0, Math.min(count - 1, Math.trunc(action.index))), playing: false, animate: false };
    case 'company': return { ...state, selectedId: action.id, playing: false, animate: false };
    case 'tick': {
      if (!state.playing) return state;
      const index = Math.min(count - 1, state.index + 1);
      return { ...state, index, playing: index < count - 1, animate: true };
    }
  }
}
