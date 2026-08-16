# Manufacturing Compass Video

SEO記事を正本として、ショート動画をローカル生成する独立パッケージです。

## Commands

```bash
npm install
npm run studio
npm run still
npm run render
```

生成した画像・動画は `output/` に保存され、Git管理には含めません。

ナレーションは `public/audio/`、複数動画で使うBGMは `public/audio/common/` に公開用の短いファイル名で置きます。音声素材と生成物はGit管理へ含めず、元の録音名や個人を特定し得るメタデータを公開コードへ残しません。

次の動画は [`docs/short-video-workflow.md`](./docs/short-video-workflow.md) と [`manifests/_template.ts`](./manifests/_template.ts) を起点に作ります。制作ごとの設定、公開日、学び、計測値は [`docs/production-log.md`](./docs/production-log.md) に残します。

## Editorial boundary

- 動画は必ず `sourceSlug` で公開記事と結びつける
- 記事から自動生成した文は下書きとして扱う
- REFは出典と確認日、EXPは匿名化と本人確認を経てから `approved` にする
- 投稿は生成動画を人が最後まで確認してから行う
- BGMは曲名、制作者、ライセンス、帰属表示の要否をマニフェストへ記録する
