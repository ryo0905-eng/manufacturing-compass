import type {ShortVideoManifest} from "../src/types/short-video";

// このファイルを複製し、記事・台本・音声・公開状態を1本単位で管理する。
export const shortVideoTemplateManifest: ShortVideoManifest = {
  id: "short-XXX-topic",
  sourceSlug: "replace-with-published-guide-slug",
  sourceLabel: "記事タイトルを入力",
  contentType: "REF",
  title: "動画の管理用タイトル",
  seriesLabel: "1分でわかる半導体製造",
  hook: ["冒頭の問い", "強調する短い言葉"],
  conclusion: ["要点の前半", "要点の後半"],
  cta: ["詳しい内容は", "プロフィールの記事で確認"],
  audio: {
    narrationFile: "audio/narration-short-XXX.m4a",
    narrationStartFrame: 12,
    narrationVolume: 1,
    bgmFile: "audio/bgm-short-XXX.mp3",
    bgmTitle: "曲名を入力",
    bgmArtist: "制作者名を入力",
    bgmSource: "入手元を入力",
    bgmVolume: 0.28,
    bgmFadeInFrames: 30,
    bgmFadeOutFrames: 75,
    bgmLicenseStatus: "confirmation-required",
    bgmAttributionStatus: "confirmation-required",
  },
  reviewedAt: "YYYY-MM-DD",
  status: "draft",
};
