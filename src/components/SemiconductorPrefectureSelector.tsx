import styles from "@/components/semiconductor-location-map.module.css";

const regions = [
  { name: "北海道", prefectures: [["01", "北海道"]] },
  { name: "東北", prefectures: [["02", "青森"], ["03", "岩手"], ["04", "宮城"], ["05", "秋田"], ["06", "山形"], ["07", "福島"]] },
  { name: "関東", prefectures: [["08", "茨城"], ["09", "栃木"], ["10", "群馬"], ["11", "埼玉"], ["12", "千葉"], ["13", "東京"], ["14", "神奈川"]] },
  { name: "中部", prefectures: [["15", "新潟"], ["16", "富山"], ["17", "石川"], ["18", "福井"], ["19", "山梨"], ["20", "長野"], ["21", "岐阜"], ["22", "静岡"], ["23", "愛知"]] },
  { name: "近畿", prefectures: [["24", "三重"], ["25", "滋賀"], ["26", "京都"], ["27", "大阪"], ["28", "兵庫"], ["29", "奈良"], ["30", "和歌山"]] },
  { name: "中国", prefectures: [["31", "鳥取"], ["32", "島根"], ["33", "岡山"], ["34", "広島"], ["35", "山口"]] },
  { name: "四国", prefectures: [["36", "徳島"], ["37", "香川"], ["38", "愛媛"], ["39", "高知"]] },
  { name: "九州・沖縄", prefectures: [["40", "福岡"], ["41", "佐賀"], ["42", "長崎"], ["43", "熊本"], ["44", "大分"], ["45", "宮崎"], ["46", "鹿児島"], ["47", "沖縄"]] },
] as const;

type SemiconductorPrefectureSelectorProps = {
  counts: Map<string, number>;
  onSelect: (prefectureCode: string) => void;
  selectedPrefectureCode?: string;
};

export function SemiconductorPrefectureSelector({
  counts,
  onSelect,
  selectedPrefectureCode,
}: SemiconductorPrefectureSelectorProps) {
  return (
    <div className={styles.regionSelector}>
      <header>
        <p className="section-label">地域から選ぶ</p>
        <h3>都道府県を選択</h3>
        <p>地域ブロックから勤務地候補を探せます。この図は施設の正確な位置や距離を表す地図ではありません。</p>
      </header>
      <div className={styles.regionGrid}>
        {regions.map((region) => (
          <section className={styles.regionBlock} key={region.name} aria-labelledby={`region-${region.name}`}>
            <h4 id={`region-${region.name}`}>{region.name}</h4>
            <div>
              {region.prefectures.map(([code, name]) => {
                const count = counts.get(code) ?? 0;
                const isSelected = selectedPrefectureCode === code;
                return (
                  <button
                    aria-label={`${name}${count > 0 ? `、掲載${count}拠点` : "、掲載拠点なし"}${isSelected ? "、選択中" : ""}`}
                    aria-pressed={isSelected}
                    disabled={count === 0}
                    key={code}
                    onClick={() => onSelect(code)}
                    type="button"
                  >
                    <span>{name}</span>
                    {count > 0 ? <small>{count}</small> : null}
                    {isSelected ? <em>選択中</em> : null}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
