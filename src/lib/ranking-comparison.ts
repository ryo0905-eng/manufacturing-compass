import { rankingTimeMachineCompanies, type RankingCompany, type RankingSnapshot } from '@/data/ranking-time-machine';
import { referenceCompanies, referenceSnapshots } from '@/data/ranking-reference';
import { initialTimeline, prepareRanking, reduceTimeline, type TimelineAction, type TimelineState } from './ranking-time-machine';

export type RankingMode = 'semiconductor' | 'global' | 'equipment';
const semiconductorIds = rankingTimeMachineCompanies.map(company => company.id);
export const rankingModes = {
  semiconductor: { label: '半導体20社', companyIds: semiconductorIds, firstYear: 2010, lastYear: 2025, defaultCompany: '', scope: '装置5社を含む選定20社内の比較' },
  global: { label: '世界の大企業と比較', companyIds: [...semiconductorIds, ...referenceCompanies.map(company => company.id)], firstYear: 2014, lastYear: 2025, defaultCompany: 'toyota', scope: '半導体・装置20社とGAFAM・トヨタの選定26社内の比較' },
  equipment: { label: '製造装置5社', companyIds: ['asml', 'applied-materials', 'lam-research', 'tokyo-electron', 'kla'], firstYear: 2010, lastYear: 2025, defaultCompany: 'tokyo-electron', scope: '選定した製造装置5社内の比較（売上高ではありません）' },
} as const;
export const rankingModeIds: readonly RankingMode[] = ['semiconductor', 'global', 'equipment'];
export function isRankingMode(value: string | null): value is RankingMode {
  return rankingModeIds.some(mode => mode === value);
}

export function createComparisonTimelines(companies: readonly RankingCompany[], snapshots: readonly RankingSnapshot[]) {
  const allCompanies = [...companies, ...referenceCompanies];
  function build(mode: RankingMode) {
    const config = rankingModes[mode];
    const ids = new Set<string>(config.companyIds);
    const selectedCompanies = allCompanies.filter(company => ids.has(company.id));
    if (selectedCompanies.length !== ids.size) throw new Error('比較対象の企業マスターが不足しています');
    const selectedSnapshots = snapshots.filter(snapshot => snapshot.year >= config.firstYear && snapshot.year <= config.lastYear).map(snapshot => ({
      year: snapshot.year,
      entries: [...snapshot.entries, ...(mode === 'global' ? referenceSnapshots.find(item => item.year === snapshot.year)?.entries ?? [] : [])].filter(entry => ids.has(entry.companyId)),
    }));
    if (selectedSnapshots.length !== config.lastYear - config.firstYear + 1) throw new Error('比較対象の年度が不足しています');
    return { companies: selectedCompanies, timeline: prepareRanking(selectedCompanies, selectedSnapshots) };
  }
  return { semiconductor: build('semiconductor'), global: build('global'), equipment: build('equipment') };
}

export type ComparisonState = TimelineState & { mode: RankingMode; notice: string };
export type ComparisonAction = TimelineAction | { type: 'mode'; mode: RankingMode } | { type: 'restore'; mode: RankingMode; year: number; selectedId: string };
export const initialComparison: ComparisonState = { ...initialTimeline, mode: 'semiconductor', notice: '' };
export function reduceComparison(state: ComparisonState, action: ComparisonAction): ComparisonState {
  const current = rankingModes[state.mode];
  if (action.type === 'mode' || action.type === 'restore') {
    if (action.type === 'mode' && action.mode === state.mode) return state;
    const next = rankingModes[action.mode];
    const previousYear = action.type === 'restore' ? action.year : current.firstYear + state.index;
    const year = Math.max(next.firstYear, Math.min(next.lastYear, previousYear));
    return { ...initialTimeline, mode: action.mode, index: year - next.firstYear,
      selectedId: action.type === 'restore' ? action.selectedId : next.defaultCompany,
      notice: year !== previousYear ? `全社のデータが揃う${next.firstYear}年から表示します。` : '' };
  }
  if (action.type === 'reset') return { ...initialTimeline, mode: state.mode, selectedId: current.defaultCompany, notice: '' };
  return { ...state, ...reduceTimeline(state, action, current.lastYear - current.firstYear + 1), notice: '' };
}

// Ordinary document anchors are not comparison state and must keep working.
export function readComparisonHash(hash: string): Extract<ComparisonAction, { type: 'restore' }> | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (!params.has('mode')) return null;
  const mode = isRankingMode(params.get('mode')) ? params.get('mode') as RankingMode : 'semiconductor';
  const config = rankingModes[mode];
  const rawYear = params.get('year');
  const parsedYear = rawYear && /^\d{4}$/.test(rawYear) ? Number(rawYear) : config.firstYear;
  const year = Math.max(config.firstYear, Math.min(config.lastYear, parsedYear));
  const company = params.get('company');
  const selectedId = company === '' ? '' : company && (config.companyIds as readonly string[]).includes(company) ? company : config.defaultCompany;
  return { type: 'restore', mode, year, selectedId };
}

export function comparisonShareUrl(origin: string, mode: RankingMode, year: number, selectedId: string) {
  const params = new URLSearchParams({ mode, year: String(year), company: selectedId });
  return `${origin}/tools/ranking-time-machine#${params.toString()}`;
}
