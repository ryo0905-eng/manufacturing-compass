/** Mulberry32: pure, explicit state; never consume randomness during rendering. */
export function uniform(state: number): { state: number; value: number } {
  const next = (state + 0x6d2b79f5) >>> 0;
  let t = Math.imul(next ^ (next >>> 15), next | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return { state: next, value: ((t ^ (t >>> 14)) >>> 0) / 4294967296 };
}

export function normal(state: number): { state: number; value: number } {
  const a = uniform(state);
  const b = uniform(a.state);
  return { state: b.state, value: Math.sqrt(-2 * Math.log(1 - a.value)) * Math.cos(2 * Math.PI * b.value) };
}
