export type ShortVideoManifest = {
  id: string;
  sourceSlug: string;
  contentType: "REF" | "EXP";
  title: string;
  hook: string[];
  conclusion: string[];
  cta: string[];
  audio: {
    narrationFile: string;
    bgmFile: string;
    bgmTitle: string;
    bgmArtist: string;
    bgmLicenseStatus: "confirmation-required" | "confirmed";
  };
  reviewedAt: string;
  status: "draft" | "approved";
};

export const semiconductorInspectionManifest: ShortVideoManifest = {
  id: "short-001-semiconductor-inspection",
  sourceSlug: "semiconductor-manufacturing-process",
  contentType: "REF",
  title: "検査は最後だけではない",
  hook: ["半導体の検査は", "完成後だけ？"],
  conclusion: ["工程の途中で測り、", "結果を工程へ戻す"],
  cta: ["詳しい製造工程は", "プロフィールの記事で図解"],
  audio: {
    narrationFile: "audio/narration-short-001.m4a",
    bgmFile: "audio/bgm-short-001.mp3",
    bgmTitle: "Shining",
    bgmArtist: "Leon Albertson feat. Adryon de León",
    bgmLicenseStatus: "confirmation-required",
  },
  reviewedAt: "2026-08-16",
  status: "draft",
};
