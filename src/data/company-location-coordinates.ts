import type { LocationCoordinates, LocationSource } from "@/types/company-location";

// Only coordinates explicitly supplied by the operator's map links are included.
// The viewport centre (@lat,lng) is never substituted for a place pin (!3d,!4d).
const records = [
  { id: "rapidus-chitose-iim", latitude: 42.7872775, longitude: 141.7072874, publisher: "Rapidus", url: "https://www.rapidus.inc/about/", evidenceUrl: "https://maps.app.goo.gl/48xJ7W8NzbNuiVE46", note: "公式事業所一覧のIIM-1（北海道千歳市美々758-62）から案内される施設ピンを照合。画面中心ではなく対象施設の座標を使用。" },
  { id: "kioxia-kitakami", latitude: 39.3382716, longitude: 141.1244575, publisher: "キオクシア岩手", url: "https://www.kioxia-iwate.co.jp/access.html", evidenceUrl: "https://www.kioxia-iwate.co.jp/access.html", note: "公式アクセスページのキオクシア岩手への地図リンクと公式住所（北工業団地5番29号）を照合。敷地の代表点であり、第2製造棟単独の座標ではない。" },
  { id: "micron-hiroshima", latitude: 34.385406, longitude: 132.679406, publisher: "Micron", url: "https://jp.micron.com/about/locations", evidenceUrl: "https://jp.micron.com/about/locations", note: "公式拠点一覧の「日本、広島県」、吉川工業団地7-10に付随する経路案内の目的地座標を照合。西条昭和町の別拠点とは区別。新クリーンルーム単独の位置ではない。" },
  { id: "micron-hashimoto", latitude: 35.577021, longitude: 139.351267, publisher: "Micron", url: "https://jp.micron.com/about/locations", evidenceUrl: "https://jp.micron.com/about/locations", note: "公式拠点一覧の橋本エンジニアリングセンター、南橋本3-1-35に付随する経路案内の目的地座標を照合。" },
  { id: "advantest-gunma-rd", latitude: 36.20812, longitude: 139.4891142, publisher: "アドバンテスト", url: "https://www.advantest.com/ja/about/offices/gunma-rd-center/", evidenceUrl: "https://maps.app.goo.gl/gTQK2hf4KqVqxPQ18", note: "公式ページの大輪336-1の地図リンクをたどり、群馬R&Dセンタの施設座標を照合。" },
  { id: "advantest-tokyo-hq", latitude: 35.684129, longitude: 139.766408, publisher: "アドバンテスト", url: "https://www.advantest.com/ja/about/offices/japan-offices/", evidenceUrl: "https://maps.app.goo.gl/wdj5jzw6spH9fLNm8", note: "公式国内拠点一覧の本社（丸の内1-6-2）の地図リンクをたどり、施設座標を照合。フロア位置を表さない。" },
  { id: "rohm-kyoto-hq-factory", latitude: 34.9947069, longitude: 135.7288762, publisher: "ローム", url: "https://www.rohm.co.jp/company/about/branch", evidenceUrl: "https://maps.app.goo.gl/wjqhvSx6Q5ahCHqK7", note: "公式国内拠点一覧の本社・本社工場（西院溝崎町21）から案内される施設ピンを照合。敷地内の個別建屋を区別しない。" },
  { id: "renesas-tokyo-toyosu", latitude: 35.6575322, longitude: 139.7950199, publisher: "ルネサス", url: "https://www.renesas.com/ja/about/profile/global", evidenceUrl: "https://goo.gl/maps/BpEq6VMGsdQLLUhS8", note: "公式本社住所（豊洲3-2-24）に付随する地図リンクの豊洲フォレシアの施設ピンを照合。フロア位置を表さない。" },
  { id: "renesas-takasaki", latitude: 36.3316716, longitude: 139.0698733, publisher: "ルネサス", url: "https://www.renesas.com/ja/about/profile/global", evidenceUrl: "https://www.renesas.com/ja/about/profile/global", note: "公式拠点一覧の高崎工場（西横手町111）の地図リンクから施設ピンを照合。工場と研究開発機能で共有する物理拠点の代表点。" },
];

export const coordinateSources: LocationSource[] = records.map(record => ({
  id: `COORD-${record.id}`, title: `${record.publisher}：公式拠点案内の位置情報`, url: record.url,
  publisher: record.publisher, accessedAt: "2026-10-20", supports: ["address", "coordinates"],
}));
export const verifiedLocationCoordinates: Record<string, LocationCoordinates> = Object.fromEntries(records.map((record): [string, LocationCoordinates] => [record.id, {
  latitude: record.latitude, longitude: record.longitude, precision: "facility", method: "official-map",
  sourceId: `COORD-${record.id}`, verifiedAt: "2026-10-20", reviewStatus: "agent-verified",
  verificationNote: record.note, evidenceUrl: record.evidenceUrl,
}]));
