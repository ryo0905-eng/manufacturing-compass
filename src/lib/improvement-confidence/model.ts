import { VERSION, changes, deviations, sampleSizes, thresholds, type Settings } from '@/data/improvement-confidence';
function random(key: string) {
  let state = 2166136261;
  for (const c of `${VERSION}:20260922:${key}`) state = Math.imul(state ^ c.charCodeAt(0), 16777619);
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return (((t ^ t >>> 14) >>> 0) + .5) / 4294967296;
  };
}
export function validateSettings(s: Settings) {
  if (!changes.includes(s.change) || !deviations.includes(s.sd) || !sampleSizes.includes(s.n) || !thresholds.includes(s.threshold)) throw new Error('教材の設定が不正です。');
}
export function generate(s: Settings, key: string) {
  validateSettings(s);
  function group(name: string, mean: number) {
    const next = random(`${key}:${name}`);
    return Array.from({ length: s.n }, () => mean + s.sd * Math.sqrt(-2 * Math.log(next())) * Math.cos(2 * Math.PI * next()));
  }
  return { before: group('before', 108), after: group('after', 108 - s.change) };
}
export type Observations = ReturnType<typeof generate>;
