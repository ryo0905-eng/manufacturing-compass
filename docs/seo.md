# SEO Strategy

## SEO の役割

SEO は企業一覧へ直接流すためではなく、診断へ流すための集客チャネルとして設計する。

主導線:

```text
検索流入
↓
職種別・悩み別ページ
↓
半導体キャリア市場価値診断
↓
診断結果
↓
転職エージェント / 英語学習 CTA
```

## Phase 1.5 URL 方針

```text
/
/diagnosis
/diagnosis/result
/industry-map
/companies
/companies/tsmc
/companies/micron
/compare/tsmc-vs-micron
```

既存の `/career-compass` は、実装上は残してもよいが、最終的な訴求名は「半導体キャリア市場価値診断」に寄せる。

将来的に追加する URL:

```text
/market-value/process-engineer
/market-value/quality-assurance
/market-value/production-engineer
/market-value/equipment-engineer
/salary/semiconductor-process-engineer
/salary/semiconductor-quality
/career-path/quality-to-semiconductor
/career-path/equipment-to-field-engineer
/english/semiconductor-career
/agents/semiconductor
```

## 狙うキーワード

診断系:

- 半導体 転職 市場価値
- 半導体 転職 年収
- 半導体 キャリア診断
- 半導体 転職 可能性
- 半導体 転職 未経験
- 半導体 転職 英語

職種系:

- 品質保証 半導体 転職
- 生産技術 半導体 転職
- 設備保全 半導体 転職
- プロセスエンジニア 転職
- フィールドエンジニア 半導体 転職
- FAE 半導体 転職

企業系:

- TSMC 転職
- Micron 年収
- 東京エレクトロン 転職
- Skyworks 転職
- 半導体メーカー 年収

学習・準備系:

- 半導体 転職 何を勉強
- 半導体 転職 資格
- 半導体 転職 英語 必要
- 半導体 プロセス 勉強

## メタデータルール

診断ページ:

- title に「市場価値」「年収」「診断」を含める
- description で「今狙える会社」「伸ばすべきスキル」「今日やること」を明示する

職種ページ:

- title に職種名 + 半導体転職 + 年収/市場価値を含める
- 診断への CTA をファーストビュー近くに置く

企業ページ:

- title に会社名 + 転職 + 年収/仕事内容/英語/日本拠点を含める
- 診断結果の根拠ページとして内部リンクする

## 内部リンクルール

- トップページから診断へ強く誘導する
- 診断結果から企業詳細、比較、英語学習、転職エージェント CTA へ誘導する
- 記事ページから診断へ誘導する
- 企業ページから診断へ戻れる導線を置く
- 比較ページから診断へ戻れる導線を置く

## 構造化データ案

- WebSite
- WebApplication
- FAQPage
- Article
- BreadcrumbList
- Organization
- ItemList

診断ページでは WebApplication を検討する。

## sitemap 方針

- Phase 1.5 では診断ページ、トップ、企業ページ、比較ページ、業界地図を sitemap に含める
- Phase 2 以降で職種別市場価値ページ、年収ページ、英語学習ページ、転職エージェントページを追加する

## コンテンツ更新方針

- 診断ロジックと結果文言を継続的に改善する
- 年収レンジの根拠情報を定期更新する
- 職種別ページを増やす
- 診断完了率と CTA クリック率を見てページ構成を改善する
