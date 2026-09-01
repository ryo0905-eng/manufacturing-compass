# Conversion Architecture

最終更新日: 2026-07-21

## 目的

ユーザーが、ページを読んだ後に「何を理解できたか」「次に何を確認するか」を迷わない導線を作ります。転職エージェントのクリックだけをコンバージョンとしません。

## 主な行動

1. 業界・工程・企業を理解する
2. 自分の経験と半導体職種の接点を整理する
3. 求人票や職務経歴書で確認する項目を決める
4. 今日できる小さな準備を行う
5. 必要な場合だけ、相談先と相談論点を選ぶ

## 現行導線

```text
検索 / SNS / 直接流入
  ├─ 技術・業界ガイド → 関連工程・企業・職種
  ├─ 企業・比較 → キャリア準備・関連ガイド
  └─ キャリア記事 → Career Compass / 関連記事

企業一覧 / 業界地図 / 企業比較
  → ページの文脈に合う Career Compass 導線
  → 経験に近い職種と次の準備を整理

Career Compass
  → 経験の翻訳・参考年収・企業例・準備
  → 今日の行動
  → 企業研究 / 相談準備 / エージェント比較
```

## ページの役割

- `/`: サービスの価値と主要な入口を示す
- `/career-compass`: 現在地と準備を同一ページ内で整理する
- `/guides/[slug]`: 検索意図へ答え、関連する理解へつなぐ
- `/industry-map`, `/segments/[slug]`: 工程を背骨に企業・職種の位置関係を探索し、選んだ対象の詳細へつなぐ
- `/companies/[slug]`: 公開事実とキャリア視点を示す
- `/compare/[slug]`: 同じ基準で企業を比較する
- `/career-consultation`: 相談前に職種、実績、条件、質問を整理する
- `/career-agents`: 対象ユーザー、相談テーマ、広告区分を比較する

存在しない `/diagnosis/result`、`/agents`、`/english` を導線設計に使いません。

## CTA の選び方

- 技術理解が目的なら、次の工程・装置・企業を優先する
- 企業研究が目的なら、比較・採用情報・キャリア準備を優先する
- 経験整理が目的なら、Career Compass や職務経歴書記事を優先する
- 第三者確認が必要な時だけ、相談準備とエージェント比較を出す
- 同じページに複数の主CTAを競合させない
- Career Compass へのリンクは「診断する」だけでなく、遷移後に分かる職種・強み・準備を文脈に合わせて示す
- 企業比較から相談先へ進む場合は、必要に応じて Career Compass による経験整理を先に置く

## エージェント CTA の前提

クリック前に、少なくとも次のどれかが分かる状態を作ります。

- 相談したい職種
- 伝えたい改善・立ち上げ・顧客対応の実績
- 確認したい年収、勤務地、勤務形態、出張、英語の条件
- 職務経歴書で伝わりにくい点

「今すぐ登録しないと損」などの緊急性を作りません。

## 計測

- `career_compass_cta_click`
- `diagnosis_start`
- `diagnosis_progress`
- `diagnosis_complete`
- `result_detail_open`
- `today_quest_copy`
- `agent_cta_click`
- `affiliate_outbound_click`
- `industry_map_mode_change`
- `industry_map_node_open`
- `industry_map_content_click`
- `cpk_tool_viewed`
- `cpk_sample_changed`
- `cpk_input_mode_changed`
- `cpk_calculation_completed`
- `cpk_related_content_click`

`career_compass_cta_click` には `source_page`、`cta_location`、`cta_variant` の有限値だけを付与します。検索語や入力内容は送信しません。GA4 のページ表示からCTAクリック、1問目回答、4・8・12問到達、完了までを流入元別に確認します。

評価する時は単一イベントだけでなく、流入ページ、Career Compass 完了、内部遷移、外部クリックを一連で見ます。氏名、連絡先、自由記述、現年収、回答一式は送信せず、完了時の職種領域・転職目的・結果タイプ・相談テーマは集計可能な粗いカテゴリに限定します。
