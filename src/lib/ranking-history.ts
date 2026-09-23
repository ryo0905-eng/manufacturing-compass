import { rankingTimeMachineCompanies, rankingTimeMachineSnapshots } from '@/data/ranking-time-machine';
import { createComparisonTimelines } from './ranking-comparison';

// Server-side article calculations share the exact dataset used by the interactive tool.
const comparisons = createComparisonTimelines(rankingTimeMachineCompanies, rankingTimeMachineSnapshots);
export const japanHistory = comparisons.japan.timeline;
export const nvidiaIntelHistory = comparisons.semiconductor.timeline.map(snapshot => ({
  year: snapshot.year,
  nvidia: snapshot.rows.find(row => row.id === 'nvidia')!.valueUsdB,
  intel: snapshot.rows.find(row => row.id === 'intel')!.valueUsdB,
}));
export const nvidiaIntelCrossover = nvidiaIntelHistory.find((row, index) => index > 0 && row.nvidia > row.intel && nvidiaIntelHistory[index - 1].nvidia <= nvidiaIntelHistory[index - 1].intel)!;
export function firstJapanOvertake(winner: string, other: string) {
  return japanHistory.find((snapshot, index) => {
    if (!index) return false;
    const value = (at: number, id: string) => japanHistory[at].rows.find(row => row.id === id)!.valueUsdB;
    return value(index, winner) > value(index, other) && value(index - 1, winner) <= value(index - 1, other);
  });
}
export const japanHighlights = [
  { winner: 'tokyo-electron', other: 'shin-etsu-chemical' },
  { winner: 'advantest', other: 'renesas' },
  { winner: 'disco', other: 'rohm' },
].map(pair => ({ ...pair, snapshot: firstJapanOvertake(pair.winner, pair.other)! }));
