import { assemblySteps, type AssemblyStepId } from '@/data/semiconductor-assembly';
export function assemblyFrame(id: AssemblyStepId, progress: number) {
  const index = assemblySteps.findIndex(step => step.id === id);
  if (index < 0 || !Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error('Invalid assembly frame');
  const amount = (at: number) => index < at ? 0 : index === at ? progress : 1;
  return { tape: amount(0), cut: amount(1), pickup: amount(2), attach: amount(3), wire: amount(4), resin: amount(5), formed: amount(6) };
}
export const assemblyResin = { x: 140, y: 137, width: 300, height: 132 } as const;
export const assemblyConnections = [
  { padX: 250, terminalX: 160, path: 'M250 203 Q212 114 160 228' },
  { padX: 330, terminalX: 420, path: 'M330 203 Q368 114 420 228' },
] as const;
