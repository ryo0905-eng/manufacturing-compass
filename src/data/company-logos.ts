type CompanyLogoAsset = { src: string; aspectRatio: number };

// Existing identification assets acquired on 2026-09-23; provenance and usage notes:
// public/images/company-logos/README.md. Ratios describe artwork within square PNGs.
// Keep this registry independent of ranking snapshots loaded by other pages.
export const companyLogoAssets: Partial<Record<string, CompanyLogoAsset>> = {
  tsmc: { src: '/images/company-logos/tsmc.png', aspectRatio: 1.273632 },
  micron: { src: '/images/company-logos/micron.png', aspectRatio: 4.654545 },
  'tokyo-electron': { src: '/images/company-logos/tokyo-electron.png', aspectRatio: 2.438095 },
  renesas: { src: '/images/company-logos/renesas.png', aspectRatio: 6.243902 },
  screen: { src: '/images/company-logos/screen-holdings.png', aspectRatio: 7.757576 },
  advantest: { src: '/images/company-logos/advantest.png', aspectRatio: 8.258065 },
  rohm: { src: '/images/company-logos/rohm.png', aspectRatio: 1.299492 },
  nvidia: { src: '/images/company-logos/nvidia.png', aspectRatio: 5.22449 },
  amd: { src: '/images/company-logos/amd.png', aspectRatio: 4.196721 },
  broadcom: { src: '/images/company-logos/broadcom.png', aspectRatio: 7.314286 },
  'samsung-electronics': { src: '/images/company-logos/samsung-electronics.png', aspectRatio: 6.564103 },
  'sk-hynix': { src: '/images/company-logos/sk-hynix.png', aspectRatio: 1.910448 },
  intel: { src: '/images/company-logos/intel.png', aspectRatio: 2.37037 },
  'applied-materials': { src: '/images/company-logos/applied-materials.png', aspectRatio: 3.121951 },
  'lam-research': { src: '/images/company-logos/lam-research.png', aspectRatio: 2.942529 },
  asml: { src: '/images/company-logos/asml.png', aspectRatio: 3.555556 },
  kla: { src: '/images/company-logos/kla.png', aspectRatio: 4.491228 },
  infineon: { src: '/images/company-logos/infineon.png', aspectRatio: 2.285714 },
  stmicroelectronics: { src: '/images/company-logos/stmicroelectronics.png', aspectRatio: 1.882353 },
  nxp: { src: '/images/company-logos/nxp.png', aspectRatio: 2.909091 },
  qualcomm: { src: '/images/company-logos/qualcomm.png', aspectRatio: 5.446809 },
  'analog-devices': { src: '/images/company-logos/analog-devices.png', aspectRatio: 3.506849 },
  'texas-instruments': { src: '/images/company-logos/texas-instruments.png', aspectRatio: 8 },
  disco: { src: '/images/company-logos/disco.png', aspectRatio: 1 },
  lasertec: { src: '/images/company-logos/lasertec.png', aspectRatio: 4.571429 },
  sumco: { src: '/images/company-logos/sumco.png', aspectRatio: 2.694737 },
};
