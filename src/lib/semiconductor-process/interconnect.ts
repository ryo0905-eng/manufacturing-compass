import { interconnectSteps, type InterconnectStepId } from '@/data/semiconductor-interconnect';
export const wiringGeometry = {
  left: 40, width: 500, top: 160, trenchBottom: 205, lowerTop: 280, bottom: 334,
  channels: [{ x: 120, width: 110, viaX: 150, viaWidth: 40 }, { x: 350, width: 110, viaX: 380, viaWidth: 40 }],
} as const;
export function interconnectFrame(id: InterconnectStepId, progress: number) {
  const index = interconnectSteps.findIndex(step => step.id === id);
  if (index < 0 || !Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error('Invalid interconnect frame');
  const amount = (stage: number) => index < stage ? 0 : index === stage ? progress : 1;
  const pattern = amount(1), fill = amount(3), polish = amount(4);
  const removal = polish * 36;
  const rawFillTop = 280 - Math.min(1, fill / .75) * 124;
  const surfaceLiner = amount(2) * Math.max(0, 4 - Math.max(0, removal - 32));
  return {
    dielectricHeight: amount(0) * 120,
    trenchDepth: Math.min(1, pattern * 2) * 45,
    viaDepth: Math.max(0, pattern * 2 - 1) * 75,
    liner: amount(2),
    // Cavities fill before the overburden grows. CMP only removes material above y=160.
    fillTop: Math.max(160, rawFillTop),
    mouthMetal: Math.min(surfaceLiner, Math.max(0, 160 - rawFillTop)),
    overburden: Math.max(0, Math.max(0, (fill - .75) / .25) * 32 - removal),
    surfaceLiner,
    residue: amount(4) * (1 - amount(5)),
    capHeight: amount(6) * 12,
  };
}
