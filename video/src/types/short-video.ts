export type ShortVideoAudio = {
  narrationFile: string;
  narrationStartFrame: number;
  narrationVolume: number;
  bgmFile: string;
  bgmTitle: string;
  bgmArtist: string;
  bgmSource: string;
  bgmVolume: number;
  bgmFadeInFrames: number;
  bgmFadeOutFrames: number;
  bgmLicenseStatus: "confirmation-required" | "confirmed";
  bgmAttributionStatus: "confirmation-required" | "required" | "not-required";
};

export type ShortVideoManifest = {
  id: string;
  sourceSlug: string;
  sourceLabel: string;
  contentType: "REF" | "EXP";
  title: string;
  seriesLabel: string;
  hook: string[];
  conclusion: string[];
  cta: string[];
  audio: ShortVideoAudio;
  reviewedAt: string;
  status: "draft" | "approved" | "published";
  publication?: {
    platform: "youtube";
    publishedAt: string;
    url?: string;
  };
};
