import type { EquipmentProcess } from "@/types/semiconductor-database";

// Adapter IDs reuse the existing process simulator where a matching step exists.
export const equipmentProcesses: EquipmentProcess[] = [
  { id: "clean", name: "洗浄", description: "不要物を取り除き、次の加工へ", guide: "/guides/semiconductor-cleaning-process", lab: "/tools/semiconductor-process" },
  { id: "expose", name: "露光", description: "光でレジストに模様を写す", guide: "/guides/photolithography-process", lab: "/tools/litho-simulator" },
  { id: "cmp", name: "CMP・平坦化", description: "表面の段差を小さくする", guide: "/guides/semiconductor-cmp-process", lab: "/tools/cmp-simulator" },
  { id: "dicing", name: "ダイシング", description: "ウエハをチップへ切り分ける", guide: "/guides/semiconductor-dicing-equipment-manufacturers", lab: "/tools/semiconductor-process" },
];
