import { testPattern, testingLessons, type TestingMode } from '@/data/semiconductor-testing';
export function testingFrame(mode: TestingMode, index: number, progress: number) {
  if (!Object.hasOwn(testingLessons, mode) || !Number.isInteger(index) || index < 0 || index > 3 || !Number.isFinite(progress) || progress < 0 || progress > 1) throw new Error('Invalid testing frame');
  const placement = index === 0 ? progress : 1;
  const release = index === 3 ? Math.max(0, progress * 2 - 1) : 0;
  const contact = (index < 1 ? 0 : index === 1 ? progress : 1) * (1 - release);
  const observedCount = index < 2 ? 0 : index === 2 ? Math.floor(progress * testPattern.length) : testPattern.length;
  const compared = index === 3 && progress >= .5;
  const recorded = index === 3 && progress === 1;
  return { placement, contact, observedCount, compared, recorded, release };
}
