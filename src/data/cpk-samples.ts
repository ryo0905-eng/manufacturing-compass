export type CapabilitySample = {
  id: "centered" | "shifted" | "wide";
  label: string;
  description: string;
  values: readonly number[];
  lsl: number;
  usl: number;
};

export const capabilitySamples: readonly CapabilitySample[] = [
  {
    id: "centered",
    label: "良好な工程",
    description: "平均が規格中心付近で、ばらつきが比較的小さい例",
    lsl: 9.8,
    usl: 10.2,
    values: [9.94, 9.96, 9.97, 9.97, 9.98, 9.98, 9.98, 9.99, 9.99, 9.99, 10, 10, 10, 10, 10, 10, 10, 10.01, 10.01, 10.01, 10.02, 10.02, 10.02, 10.03, 10.03, 10.04, 10.04, 10.05, 9.95, 10.06],
  },
  {
    id: "shifted",
    label: "平均が偏った工程",
    description: "ばらつきは小さい一方、平均が上限側へ偏った例",
    lsl: 9.8,
    usl: 10.18,
    values: [9.98, 10, 10.01, 10.01, 10.02, 10.02, 10.02, 10.03, 10.03, 10.03, 10.04, 10.04, 10.04, 10.04, 10.05, 10.05, 10.05, 10.05, 10.05, 10.06, 10.06, 10.06, 10.06, 10.07, 10.07, 10.07, 10.08, 10.08, 10.08, 10.09, 10.09, 10.1, 10.1, 10.11, 10.01, 10.03, 10.07, 10.09, 10.12, 10.04],
  },
  {
    id: "wide",
    label: "ばらつきが大きい工程",
    description: "平均は中心付近でも、規格幅に対して分布が広い例",
    lsl: 9.8,
    usl: 10.2,
    values: [9.77, 9.8, 9.82, 9.84, 9.86, 9.87, 9.88, 9.89, 9.9, 9.91, 9.92, 9.93, 9.94, 9.95, 9.96, 9.97, 9.98, 9.99, 10, 10, 10.01, 10.02, 10.03, 10.04, 10.05, 10.06, 10.07, 10.08, 10.09, 10.1, 10.11, 10.12, 10.13, 10.14, 10.16, 10.18, 10.2, 10.23, 9.9, 10.1],
  },
] as const;

export const initialCapabilitySample = capabilitySamples[1];

export function sampleAsText(sample: CapabilitySample) {
  return sample.values.join("\n");
}
