import Image from "next/image";

export function RankingHeroIllustration() {
  return (
    <Image
      className="ranking-hero-illustration"
      src="/images/guides/semiconductor-ranking-hero-v2.webp"
      width={1440}
      height={810}
      sizes="(max-width: 960px) 100vw, 960px"
      priority
      alt=""
      aria-hidden="true"
    />
  );
}
