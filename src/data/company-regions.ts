// Flag assets and provenance: public/images/country-flags/README.md.
export const countryFlagAssets: Partial<Record<string, string>> = {
  米国: "/images/country-flags/us.svg",
  台湾: "/images/country-flags/tw.svg",
  韓国: "/images/country-flags/kr.svg",
  オランダ: "/images/country-flags/nl.svg",
  中国: "/images/country-flags/cn.svg",
  英国: "/images/country-flags/gb.svg",
  日本: "/images/country-flags/jp.svg",
  ドイツ: "/images/country-flags/de.svg",
};

type CompanyHeadquarters = {
  country: string;
  sourceUrl: string;
  checkedAt: string;
};

export const headquartersCheckedAt = "2026-10-17";
const checkedAt = headquartersCheckedAt;

// Headquarters of the listed company or parent group, not manufacturing locations.
// Kept independent of ranking snapshots and the full company profile database.
export const companyHeadquarters: Partial<Record<string, CompanyHeadquarters>> = {
  asml: { country: "オランダ", sourceUrl: "https://www.asml.com/en/company/about-asml/locations", checkedAt },
  "applied-materials": { country: "米国", sourceUrl: "https://www.appliedmaterials.com/us/en/contact.html", checkedAt },
  "lam-research": { country: "米国", sourceUrl: "https://www.lamresearch.com/company/company-overview/", checkedAt },
  "tokyo-electron": { country: "日本", sourceUrl: "https://www.tel.com/about/summary/index.html", checkedAt },
  kla: { country: "米国", sourceUrl: "https://ir.kla.com/", checkedAt },
  advantest: { country: "日本", sourceUrl: "https://www.advantest.com/en/about/overview/", checkedAt },
  naura: { country: "中国", sourceUrl: "https://www.naura.com/about/subsidiary.html", checkedAt },
  "asm-international": { country: "オランダ", sourceUrl: "https://www.asm.com/contact-us", checkedAt },
  screen: { country: "日本", sourceUrl: "https://www.screen.co.jp/en/about/outline", checkedAt },
  teradyne: { country: "米国", sourceUrl: "https://investors.teradyne.com/company-information", checkedAt },
  "samsung-electronics": { country: "韓国", sourceUrl: "https://www.samsung.com/sec/ir/reports-disclosures/public-disclosure/4005/", checkedAt },
  "sk-hynix": { country: "韓国", sourceUrl: "https://www.skhynix.com/company/UI-FR-CP06/", checkedAt },
  micron: { country: "米国", sourceUrl: "https://www.micron.com/about/locations", checkedAt },
  cxmt: { country: "中国", sourceUrl: "https://www.cxmt.com/en/clause.html", checkedAt },
  nanya: { country: "台湾", sourceUrl: "https://www.nanya.com/en/About/7/Contact%20Us", checkedAt },
  winbond: { country: "台湾", sourceUrl: "https://www.winbond.com/hq/about-winbond/company-profile/?__locale=en", checkedAt },
  psmc: { country: "台湾", sourceUrl: "https://www.powerchip.com/en-global/contact", checkedAt },
  kioxia: { country: "日本", sourceUrl: "https://www.kioxia-holdings.com/en-jp/about/company.html", checkedAt },
  sandisk: { country: "米国", sourceUrl: "https://www.sandisk.com/en-ie/company/office-locations", checkedAt },
};
