import { foundryMarket } from "@/data/foundry-market-share";
import { memoryMarkets } from "@/data/memory-market-share";
import { equipmentSalesCompanies } from "@/data/semiconductor-equipment-sales";
import { japanSemiconductorMarketCapRanking, worldSemiconductorMarketCapRanking } from "@/data/semiconductor-market-cap";
import { semiconductorSalaryRanking } from "@/data/semiconductor-salary";

type ItemListEntry = { "@type": "ListItem"; position: number; name: string; url: string };
type ItemList = { "@context": "https://schema.org"; "@type": "ItemList"; name: string; itemListElement: ItemListEntry[] };
type RankedRow = { rank: number; name: string };

function itemList(name: string, itemListElement: ItemListEntry[]): ItemList {
  return { "@context": "https://schema.org", "@type": "ItemList", name, itemListElement };
}

function rankedList(name: string, rows: readonly RankedRow[], url: string): ItemList {
  return itemList(name, rows.map((row) => ({ "@type": "ListItem", position: row.rank, name: row.name, url })));
}

const builders = new Map<string, (url: string) => ItemList[]>([
  ["semiconductor-market-cap-ranking", (url) => [
    itemList("半導体メーカー世界ランキング（時価総額）", worldSemiconductorMarketCapRanking.map((company) => ({ "@type": "ListItem", position: company.rank, name: company.name, url: `${url}#world-company-${company.id}` }))),
    itemList("半導体メーカー日本ランキング（時価総額）", japanSemiconductorMarketCapRanking.map((company) => ({ "@type": "ListItem", position: company.domesticRank, name: company.name, url: `${url}#japan-company-${company.id}` }))),
  ]],
  ["foundry-manufacturer-ranking", (url) => [rankedList("ファウンドリメーカー売上ランキング", foundryMarket.rows, url)]],
  ["memory-manufacturer-ranking", (url) => [
    rankedList("メモリメーカー DRAMランキング", memoryMarkets.dram.rows, url),
    rankedList("メモリメーカー NANDランキング", memoryMarkets.nand.rows, url),
  ]],
  ["semiconductor-equipment-sales-ranking", (url) => [rankedList("半導体製造装置メーカー売上ランキング", equipmentSalesCompanies, url)]],
  ["semiconductor-salary-ranking", (url) => [rankedList("半導体メーカー年収ランキング", semiconductorSalaryRanking, url)]],
]);

export function buildGuideItemLists(slug: string, siteUrl: string): ItemList[] {
  return builders.get(slug)?.(`${siteUrl}/guides/${slug}`) ?? [];
}
