type TodayActionProps = { action: string };

export function TodayAction({ action }: TodayActionProps) {
  return (
    <section className="today-action" aria-labelledby="today-action-title">
      <p>今日15分でやること</p>
      <h2 id="today-action-title">{action}</h2>
      <ol>
        <li>対象にする事例を一つだけ選ぶ</li>
        <li>課題・行動・効果を箇条書きにする</li>
        <li>確認できる数字と、自分の担当範囲を加える</li>
      </ol>
      <small>きれいな文章にする必要はありません。まずは事実を残してください。</small>
    </section>
  );
}
