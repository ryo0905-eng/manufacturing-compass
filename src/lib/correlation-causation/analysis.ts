import { products, temperatures, type Product } from '@/data/correlation-causation';
import type { Observation } from './model';
export type Filter = 'all' | Product;
export function summarize(rows: readonly Observation[], filter: Filter = 'all') {
  if (!rows.length || new Set(rows.map(row => row.id)).size !== rows.length || new Set(rows.map(row => row.dataset)).size !== 1 || rows.some(row => !Number.isFinite(row.rate) || row.rate < 0 || row.rate > 100 || !products.includes(row.product) || !temperatures.includes(row.temperature))) {
    throw new Error('教材データを集計できません。空・重複・混在・不正な値がないか確認が必要です。');
  }
  const selected = rows.filter(row => filter === 'all' || row.product === filter);
  const groups = temperatures.map(temperature => {
    const group = selected.filter(row => row.temperature === temperature);
    if (!group.length) throw new Error('比較する温度のデータがありません。');
    const a = group.filter(row => row.product === 'A').length;
    return { temperature, count: group.length, mean: group.reduce((sum, row) => sum + row.rate, 0) / group.length, a, b: group.length - a };
  });
  return { groups, difference: groups[1].mean - groups[0].mean };
}
