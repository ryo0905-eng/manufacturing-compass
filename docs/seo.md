# SEO Strategy

## URL 方針

```text
/
/industry-map
/companies
/companies/skyworks
/companies/micron
/segments/fabless
/segments/foundry
/segments/equipment
/compare/skyworks-vs-qorvo
/rankings/market-cap
/rankings/revenue
/articles/what-is-idm
/articles/fabless-vs-foundry
/career-readiness/process-engineer
/career-path/quality-to-process-engineer
```

Phase 1 で作る URL は、`/`、`/industry-map`、`/companies`、`/companies/[slug]`、`/compare` または `/compare/[slug]` に絞ります。`/rankings`、`/articles`、`/career-readiness`、`/career-path` は Phase 2 以降で追加します。

## 狙うキーワード

- 半導体 転職
- 半導体メーカー 年収
- 半導体 業界地図
- 半導体 会社一覧
- Skyworks 転職
- Micron 年収
- TSMC 仕事内容
- 半導体 製造装置メーカー
- ファブレス ファウンドリ 違い
- 半導体 プロセスエンジニア 転職
- 品質保証 半導体 転職
- 生産技術 半導体 転職
- 半導体 転職 英語

## メタデータルール

- title は検索意図とページ内容を一致させる
- description はユーザーが得られる情報を具体的に書く
- 企業ページは「会社名 + 転職 + 年収/仕事内容/英語/日本拠点」などを意識する
- 比較ページは比較対象企業名を title に含める
- 記事ページは初心者が検索する言葉を優先する

## 内部リンクルール

- トップページから業界地図、企業一覧、主要記事へリンクする
- 業界地図からセグメントページへリンクする
- セグメントページから関連企業へリンクする
- 企業ページから競合企業、比較ページ、関連記事、キャリア準備ページへリンクする
- 記事ページから企業ページや CTA へ自然につなぐ

## 構造化データ案

- Organization
- Article
- BreadcrumbList
- FAQPage
- WebSite
- ItemList

企業ページでは Organization、記事では Article、比較や一覧では ItemList を検討します。

## sitemap 方針

- Phase 1 では静的ページ、企業ページ、比較ページを sitemap に含める
- Phase 2 以降でセグメントページ、ランキングページ、記事ページを sitemap に追加する
- 更新頻度が高い企業ページと記事ページは lastmod を持たせる
- noindex ページを sitemap に含めない

## コンテンツ更新方針

- 企業情報は定期的に更新する
- 財務情報は年度と情報ソースを明記する
- 古い採用情報や募集職種は更新日を確認する
- 半導体用語記事と比較記事を継続的に追加する
- 検索順位、クリック率、CTA クリック率を見て改善する
