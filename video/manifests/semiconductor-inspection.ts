import type {ShortVideoManifest} from "../src/types/short-video";

export const semiconductorInspectionManifest: ShortVideoManifest = {
  id: "short-001-semiconductor-inspection",
  sourceSlug: "semiconductor-manufacturing-process",
  sourceLabel: "半導体の製造工程を図解",
  contentType: "REF",
  title: "検査は最後だけではない",
  seriesLabel: "1分でわかる半導体製造",
  hook: ["半導体の検査は", "完成後だけ？"],
  conclusion: ["工程の途中で測り、", "結果を工程へ戻す"],
  cta: ["詳しい製造工程は", "プロフィールの記事で図解"],
  audio: {
    narrationFile: "audio/narration-short-001.m4a",
    narrationStartFrame: 12,
    narrationVolume: 1,
    bgmFile: "audio/common/shining-leon-albertson.mp3",
    bgmTitle: "Shining",
    bgmArtist: "Leon Albertson feat. Adryon de León",
    bgmSource: "YouTube Audio Library",
    bgmVolume: 0.28,
    bgmFadeInFrames: 30,
    bgmFadeOutFrames: 75,
    bgmLicenseStatus: "confirmed",
    bgmAttributionStatus: "not-required",
  },
  reviewedAt: "2026-08-16",
  status: "published",
  publication: {
    platform: "youtube",
    publishedAt: "2026-08-16",
  },
};
