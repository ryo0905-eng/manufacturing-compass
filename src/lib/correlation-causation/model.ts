import { allocations, baseRates, noiseAmplitude, products, SEED, temperatures, VERSION, type Dataset, type Product, type Temperature } from '@/data/correlation-causation';
export type Observation = Readonly<{ id: string; dataset: Dataset; product: Product; temperature: Temperature; rate: number; order: number }>;
// Separate streams for assignment, run order and response: viewing data never consumes randomness.
function random(key: string) {
  let state = 2166136261;
  for (const char of `${VERSION}:${SEED}:${key}`) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  return () => {
    state += 0x6D2B79F5;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle<T>(values: readonly T[], key: string) {
  const result = [...values], next = random(key);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function generate(dataset: Dataset): readonly Observation[] {
  const rows = products.flatMap(product => {
    const counts = allocations[dataset][product];
    const ids = Array.from({ length: counts[0] + counts[1] }, (_, i) => `${dataset}:${product}:${i + 1}`);
    const assigned = dataset === 'randomized' ? shuffle(ids, `${dataset}:${product}:assignment`) : ids;
    return assigned.map((id, i) => {
      const temperature = temperatures[i < counts[0] ? 0 : 1];
      return { id, dataset, product, temperature, rate: baseRates[product][temperature] + (random(`${id}:response`)() * 2 - 1) * noiseAmplitude };
    });
  });
  return shuffle(rows, `${dataset}:order`).map((row, i) => ({ ...row, order: i + 1 }));
}
