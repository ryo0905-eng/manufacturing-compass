const careerRoutes = [
  { source: "工程改善", detail: "条件出し・歩留まり", target: "プロセスエンジニア" },
  { source: "品質・不良解析", detail: "原因究明・再発防止", target: "品質保証・信頼性" },
  { source: "設備保全", detail: "保全・停止時間短縮", target: "装置エンジニア" },
  { source: "機械・電気設計", detail: "仕様設計・立ち上げ", target: "装置設計・回路設計" },
  { source: "製造DX・データ分析", detail: "可視化・自動化", target: "スマートファクトリー" },
  { source: "顧客対応・技術支援", detail: "課題整理・現場対応", target: "FAE・フィールドサービス" },
] as const;

export function CareerRouteMap() {
  return (
    <div className="career-route-map" role="img" aria-label="製造業の経験からつながる半導体職種の例">
      <div className="career-route-map__labels" aria-hidden="true">
        <span>現在の製造業経験</span>
        <span>接続できる半導体職種</span>
      </div>
      <ol>
        {careerRoutes.map((route, index) => (
          <li key={route.source}>
            <div className="career-route-map__source">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{route.source}</strong><small>{route.detail}</small></div>
            </div>
            <span className="career-route-map__connector" aria-hidden="true"><i /><b>→</b></span>
            <div className="career-route-map__target">
              <span aria-hidden="true">MC</span>
              <strong>{route.target}</strong>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
