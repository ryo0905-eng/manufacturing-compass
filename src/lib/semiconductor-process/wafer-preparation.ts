import { waferPreparationSteps, type WaferPreparationStepId } from '@/data/semiconductor-wafer-preparation';
export function waferPreparationFrame(id: WaferPreparationStepId, progress: number) {
  const index = waferPreparationSteps.findIndex(step => step.id === id);
  if (index < 0 || !Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error('Invalid wafer preparation frame');
  const amount = (at: number) => index < at ? 0 : index === at ? progress : 1;
  const lapped = amount(4), etched = amount(5), polished = amount(6);
  const cleaned = index < 7 ? 0 : Math.min(1, progress * 2);
  return {
    melt: amount(0), growth: amount(1), shaped: amount(2), cut: amount(3),
    lapped, etched, polished,
    thickness: 46 - 8*lapped - 8*etched - 2*polished,
    unevenness: 6*(1-lapped) + 2*(1-polished),
    damage: 4*(1-etched), residue: 1-cleaned,
    cleaned, checked: index === 7 && progress === 1,
  };
}
