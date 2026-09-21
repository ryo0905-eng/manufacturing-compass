/** Ground truth is used here only; never passed to either inference method. */
export type Counts = { missed: number; bad: number; rejected: number; good: number };

export function countErrors(predictions: readonly (boolean | null)[], truth: readonly boolean[]): Counts | null {
  if (predictions.length !== truth.length || truth.length === 0) throw new Error("評価画像が一致しません。");
  // A failed or unfinished prediction must never be interpreted as a good item.
  if (predictions.some(value => value === null)) return null;
  const result: Counts = { missed: 0, bad: 0, rejected: 0, good: 0 };
  truth.forEach((bad, i) => {
    if (bad) { result.bad++; if (!predictions[i]) result.missed++; }
    else { result.good++; if (predictions[i]) result.rejected++; }
  });
  return result;
}

export function combineDecisions(rule: boolean | null, ai: boolean | null): boolean | null {
  // A complete comparison requires both methods, even if OR could short-circuit.
  return rule === null || ai === null ? null : rule || ai;
}

export function maskIoU(prediction: Uint8Array, truth: Uint8Array): number | null {
  if (prediction.length !== truth.length || !truth.length) throw new Error("領域の大きさが一致しません。");
  let intersection = 0, union = 0;
  for (let i = 0; i < truth.length; i++) {
    if (prediction[i] && truth[i]) intersection++;
    if (prediction[i] || truth[i]) union++;
  }
  return union ? intersection / union : null;
}
