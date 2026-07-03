import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="page-hero">
        <p className="eyebrow">Not found</p>
        <h1>ページが見つかりません</h1>
        <p>企業データや比較ページは、公開情報を確認しながら順次追加しています。</p>
        <div className="actions">
          <Link className="button primary" href="/companies">
            企業一覧を見る
          </Link>
          <Link className="button ghost" href="/">
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
