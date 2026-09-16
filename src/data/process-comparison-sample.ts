import type { ComparisonInput } from "@/lib/process-comparison";

export const processComparisonSample: ComparisonInput = { nameA: "変更前（架空）", nameB: "変更後（架空）", measurement: "膜厚", unit: "nm", dataA: "98\n102\n101\n97\n104\n99\n103\n96", dataB: "99\n100\n101\n100\n99\n102", lower: "98", upper: "102" };
