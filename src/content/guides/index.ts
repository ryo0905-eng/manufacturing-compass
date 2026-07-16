import { appliedMaterialsSemiconductorEquipmentGuide } from "@/content/guides/applied-materials-semiconductor-equipment";
import { analogSemiconductorCompaniesGuide } from "@/content/guides/analog-semiconductor-companies";
import { equipmentEngineerRouteGuide } from "@/content/guides/equipment-engineer-route";
import { electronicsToSemiconductorProcessEngineerGuide } from "@/content/guides/electronics-to-semiconductor-process-engineer";
import { icChipManufacturingCompaniesGuide } from "@/content/guides/ic-chip-manufacturing-companies";
import { qualityEngineerRouteGuide } from "@/content/guides/quality-engineer-route";
import { productionEngineeringToSemiconductorProcessEngineerGuide } from "@/content/guides/production-engineering-to-semiconductor-process-engineer";
import { photolithographyProcessGuide } from "@/content/guides/photolithography-process";
import { semiconductorCareerEnglishLevelGuide } from "@/content/guides/semiconductor-career-english-level";
import { semiconductorCareerChatgptGuide } from "@/content/guides/semiconductor-career-chatgpt";
import { semiconductorCareerStartGuide } from "@/content/guides/semiconductor-career-start";
import { semiconductorCleaningEquipmentManufacturersGuide } from "@/content/guides/semiconductor-cleaning-equipment-manufacturers";
import { semiconductorCleaningProcessGuide } from "@/content/guides/semiconductor-cleaning-process";
import { semiconductorCmpEquipmentManufacturersGuide } from "@/content/guides/semiconductor-cmp-equipment-manufacturers";
import { semiconductorCmpProcessGuide } from "@/content/guides/semiconductor-cmp-process";
import { semiconductorInspectionMetrologyGuide } from "@/content/guides/semiconductor-inspection-metrology";
import { semiconductorInspectionEquipmentManufacturersGuide } from "@/content/guides/semiconductor-inspection-equipment-manufacturers";
import { semiconductorMarketCapRankingGuide } from "@/content/guides/semiconductor-market-cap-ranking";
import { semiconductorManufacturingProcessGuide } from "@/content/guides/semiconductor-manufacturing-process";
import { semiconductorPackagingProcessGuide } from "@/content/guides/semiconductor-packaging-process";
import { semiconductorPackagingEquipmentManufacturersGuide } from "@/content/guides/semiconductor-packaging-equipment-manufacturers";
import { semiconductorWaferTestGuide } from "@/content/guides/semiconductor-wafer-test";
import { semiconductorDepositionProcessGuide } from "@/content/guides/semiconductor-deposition-process";
import { semiconductorDicingProcessGuide } from "@/content/guides/semiconductor-dicing-process";
import { semiconductorDicingEquipmentManufacturersGuide } from "@/content/guides/semiconductor-dicing-equipment-manufacturers";
import { semiconductorDepositionEquipmentManufacturersGuide } from "@/content/guides/semiconductor-deposition-equipment-manufacturers";
import { semiconductorEquipmentManufacturersGuide } from "@/content/guides/semiconductor-equipment-manufacturers";
import { semiconductorEtchingEquipmentManufacturersGuide } from "@/content/guides/semiconductor-etching-equipment-manufacturers";
import { semiconductorEtchingProcessGuide } from "@/content/guides/semiconductor-etching-process";
import { semiconductorFinalTestGuide } from "@/content/guides/semiconductor-final-test";
import { semiconductorFoundryGuide } from "@/content/guides/semiconductor-foundry";
import { semiconductorInterconnectProcessGuide } from "@/content/guides/semiconductor-interconnect-process";
import { semiconductorIonImplantationEquipmentManufacturersGuide } from "@/content/guides/semiconductor-ion-implantation-equipment-manufacturers";
import { semiconductorIonImplantationProcessGuide } from "@/content/guides/semiconductor-ion-implantation-process";
import { semiconductorLithographyEquipmentManufacturersGuide } from "@/content/guides/semiconductor-lithography-equipment-manufacturers";
import { semiconductorOxidationThermalProcessGuide } from "@/content/guides/semiconductor-oxidation-thermal-process";
import { semiconductorRecruitmentAgentReviewGuide } from "@/content/guides/semiconductor-recruitment-agent-review";
import { semiconductorSalaryRankingGuide } from "@/content/guides/semiconductor-salary-ranking";
import { semiconductorSiliconWaferManufacturingGuide } from "@/content/guides/semiconductor-silicon-wafer-manufacturing";
import { semiconductorTesterAteGuide } from "@/content/guides/semiconductor-tester-ate";
import { semiconductorTestHandlerManufacturersGuide } from "@/content/guides/semiconductor-test-handler-manufacturers";
import { semiconductorThermalProcessingEquipmentManufacturersGuide } from "@/content/guides/semiconductor-thermal-processing-equipment-manufacturers";
import type { GuideArticle } from "@/content/guides/types";

export type { GuideArticle } from "@/content/guides/types";

const guideArticles: GuideArticle[] = [
  semiconductorCareerStartGuide,
  icChipManufacturingCompaniesGuide,
  analogSemiconductorCompaniesGuide,
  semiconductorFoundryGuide,
  semiconductorEquipmentManufacturersGuide,
  appliedMaterialsSemiconductorEquipmentGuide,
  semiconductorTesterAteGuide,
  semiconductorTestHandlerManufacturersGuide,
  semiconductorManufacturingProcessGuide,
  photolithographyProcessGuide,
  semiconductorLithographyEquipmentManufacturersGuide,
  semiconductorDepositionEquipmentManufacturersGuide,
  semiconductorDepositionProcessGuide,
  semiconductorEtchingEquipmentManufacturersGuide,
  semiconductorEtchingProcessGuide,
  semiconductorCleaningEquipmentManufacturersGuide,
  semiconductorCleaningProcessGuide,
  semiconductorIonImplantationEquipmentManufacturersGuide,
  semiconductorIonImplantationProcessGuide,
  semiconductorThermalProcessingEquipmentManufacturersGuide,
  semiconductorCmpEquipmentManufacturersGuide,
  semiconductorCmpProcessGuide,
  semiconductorInspectionEquipmentManufacturersGuide,
  semiconductorInspectionMetrologyGuide,
  semiconductorWaferTestGuide,
  semiconductorDicingEquipmentManufacturersGuide,
  semiconductorDicingProcessGuide,
  semiconductorPackagingEquipmentManufacturersGuide,
  semiconductorPackagingProcessGuide,
  semiconductorFinalTestGuide,
  semiconductorInterconnectProcessGuide,
  semiconductorOxidationThermalProcessGuide,
  semiconductorSiliconWaferManufacturingGuide,
  electronicsToSemiconductorProcessEngineerGuide,
  productionEngineeringToSemiconductorProcessEngineerGuide,
  semiconductorCareerChatgptGuide,
  semiconductorMarketCapRankingGuide,
  semiconductorSalaryRankingGuide,
  semiconductorRecruitmentAgentReviewGuide,
  semiconductorCareerEnglishLevelGuide,
  equipmentEngineerRouteGuide,
  qualityEngineerRouteGuide,
];

function assertStructuredPresentation(guide: GuideArticle) {
  if (guide.status !== "published" || guide.presentation !== "structured") {
    return;
  }

  const blocks = [
    ...(guide.overviewBlocks ?? []),
    ...guide.sections.flatMap((section) => section.blocks ?? []),
  ];
  const blockTypes = new Set(blocks.map((block) => block.type));

  if (blockTypes.size < 3) {
    throw new Error(`${guide.slug}: structured guide must use at least three block types`);
  }
  if (!blocks.some((block) => block.type === "quote")) {
    throw new Error(`${guide.slug}: structured guide must retain at least one first-person quote`);
  }
  if (guide.sections.some((section) => section.paragraphs.length > 2)) {
    throw new Error(`${guide.slug}: structured guide cannot have more than two consecutive paragraphs`);
  }
}

for (const guide of guideArticles) {
  if (guide.presentation === "legacy" && guide.publishedAt >= "2026-07-12") {
    throw new Error(`${guide.slug}: new guides must use the structured presentation`);
  }
  assertStructuredPresentation(guide);
}

export const beginnerGuides = guideArticles.filter((guide) => guide.status === "published");

export function getGuideBySlug(slug: string) {
  return beginnerGuides.find((guide) => guide.slug === slug);
}
