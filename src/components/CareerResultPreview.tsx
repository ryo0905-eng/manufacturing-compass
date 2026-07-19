export function CareerResultPreview() {
  return (
    <aside className="career-result-preview" aria-label="キャリア現在地チェックの整理結果例">
      <header className="career-result-preview__header">
        <div>
          <span>CAREER COMPASS</span>
          <strong>整理結果のイメージ</strong>
        </div>
        <span className="career-result-preview__status">登録不要</span>
      </header>

      <div className="career-result-preview__route">
        <span>経験と職種の接点</span>
        <p><strong>設備保全</strong><i aria-hidden="true">→</i><b>半導体製造装置エンジニア</b></p>
      </div>

      <dl className="career-result-preview__insights">
        <div>
          <dt>活かせる経験</dt>
          <dd>停止時間の分析・設備改善</dd>
        </div>
        <div>
          <dt>次に整理すること</dt>
          <dd>改善前後の数値と担当範囲</dd>
        </div>
      </dl>
      <small className="career-result-preview__note">回答内容に応じて、近い職種と準備項目を整理します。</small>
    </aside>
  );
}
