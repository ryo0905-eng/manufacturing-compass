export const opticalMeta = { checkedAt: "2026-09-18", sourceSlug: "optical-semiconductor-manufacturers" } as const;
export const opticalCategoryIds = ["led", "laser", "image-sensor", "photodiode"] as const;
export type OpticalCategoryId = typeof opticalCategoryIds[number];
export type OpticalSelection = "all" | OpticalCategoryId;
export const opticalCategories: Record<OpticalCategoryId, { label: string; purpose: string; input: string; output: string; description: string }> = {
  led: { label: "LED", purpose: "照らす・表示する", input: "電気", output: "光", description: "電気を光に変える発光素子です。照明や表示など、必要な色や明るさに応じて製品を選びます。" },
  laser: { label: "半導体レーザー", purpose: "レーザー光を出す", input: "電気", output: "レーザー光", description: "LD（レーザーダイオード）とも呼ばれる光源です。センシングやプリンターなどに使われ、用途に合う波長や出力を確認します。" },
  "image-sensor": { label: "イメージセンサー", purpose: "画像を撮る", input: "光", output: "画素ごとの信号", description: "光を画素ごとの電気信号として読み出します。カメラや産業用の画像取得などに使うセンサーです。" },
  photodiode: { label: "フォトダイオード", purpose: "光を検出する", input: "光", output: "電気信号", description: "受けた光を電気信号に変える受光素子です。検出したい光の波長に対応する製品を確認します。" },
};
export type OpticalProduct = { category: OpticalCategoryId; name: string; role: string; url: string };
export type OpticalCompany = { id: string; name: string; companySlug?: string; products: OpticalProduct[] };
// 編集上の掲載例。順位・網羅的な取扱製品一覧を表すものではない。
export const opticalCompanies: OpticalCompany[] = [
  { id: "nichia", name: "日亜化学工業", products: [
    { category: "led", name: "LED", role: "光源となるLEDを開発・製造。", url: "https://www.nichia.co.jp/jp/product/" },
    { category: "laser", name: "LD（半導体レーザー）", role: "レーザー光源となるLDを開発・製造。", url: "https://led-ld.nichia.co.jp/jp/product/ld_top.html" },
  ] },
  { id: "ams-osram", name: "ams OSRAM", products: [
    { category: "led", name: "白色・カラーLED", role: "照明や表示などに向けた発光素子。", url: "https://ams-osram.com/products/leds" },
    { category: "laser", name: "EEL・VCSEL", role: "端面発光型と面発光型の半導体レーザー。", url: "https://ams-osram.com/products/lasers" },
    { category: "photodiode", name: "フォトダイオード", role: "光を検出する受光素子。", url: "https://ams-osram.com/products/photodetectors" },
  ] },
  { id: "sony-semicon", name: "ソニーセミコンダクタソリューションズ", products: [
    { category: "image-sensor", name: "CMOSイメージセンサー", role: "画像を取得するための受光・読み出しを担う。", url: "https://www.sony-semicon.com/ja/products/is/index.html" },
  ] },
  { id: "hamamatsu", name: "浜松ホトニクス", products: [
    { category: "image-sensor", name: "CCD・CMOS・NMOS／InGaAsイメージセンサ", role: "分光計測や産業用の画像取得などに使うセンサー。", url: "https://www.hamamatsu.com/jp/ja/product/optical-sensors/image-sensor/" },
    { category: "photodiode", name: "Si・InGaAsフォトダイオード", role: "検出する波長などに合わせて選ぶ受光素子。", url: "https://www.hamamatsu.com/jp/ja/product/optical-sensors/photodiodes.html" },
  ] },
  { id: "rohm", name: "ローム", companySlug: "rohm", products: [
    { category: "led", name: "チップLED", role: "小型パッケージなどで提供する発光素子。", url: "https://www.rohm.co.jp/products/led" },
    { category: "laser", name: "半導体レーザー", role: "プリンターやセンシングなどに用いる光源。", url: "https://www.rohm.co.jp/products/laser-diodes" },
  ] },
  { id: "onsemi", name: "onsemi", companySlug: "onsemi", products: [
    { category: "image-sensor", name: "産業向けCMOSイメージセンサー", role: "マシンビジョンで画像を取得するためのセンサー。", url: "https://www.onsemi.com/solutions/industrial/industrial-automation/machine-vision" },
  ] },
];
export function selectOpticalCompanies(selection: OpticalSelection, companies: readonly OpticalCompany[] = opticalCompanies) {
  return companies.filter(company => selection === "all" || company.products.some(product => product.category === selection));
}
