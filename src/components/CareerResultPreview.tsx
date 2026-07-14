export function CareerResultPreview() {
  return (
    <aside className="career-result-preview" aria-label="キャリア診断結果の表示例">
      <header className="career-result-preview__header">
        <div>
          <span>CAREER COMPASS / RESULT</span>
          <strong>診断結果プレビュー</strong>
        </div>
        <span className="career-result-preview__status">登録不要</span>
      </header>

      <div className="career-result-preview__route">
        <span>Career Route</span>
        <p><strong>設備保全</strong><i aria-hidden="true">→</i><b>半導体製造装置エンジニア</b></p>
      </div>

      <div className="career-result-preview__metrics">
        <div className="career-result-preview__score">
          <span>Power Score</span>
          <strong>78<small>/100</small></strong>
          <div aria-hidden="true"><i /></div>
        </div>
        <div>
          <span>想定年収</span>
          <strong>620〜820<small>万円</small></strong>
          <small>関連職種の参考レンジ</small>
        </div>
      </div>

      <dl className="career-result-preview__insights">
        <div>
          <dt><span aria-hidden="true">＋</span> Recommended Skill</dt>
          <dd>停止時間の数値化</dd>
        </div>
        <div className="career-result-preview__quest">
          <dt><span aria-hidden="true">✓</span> Today Quest</dt>
          <dd>改善実績を1つ書く</dd>
        </div>
      </dl>
      <small className="career-result-preview__note">回答内容に応じて、職種・強み・次の行動を整理します。</small>
    </aside>
  );
}
