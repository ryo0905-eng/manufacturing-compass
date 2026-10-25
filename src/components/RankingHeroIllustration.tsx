import Image from "next/image";

export function RankingHeroIllustration() {
  return (
    <Image
      className="ranking-hero-illustration"
      src="/images/guides/semiconductor-ranking-hero.webp"
      width={660}
      height={480}
      sizes="(min-width: 768px) 220px, 120px"
      alt=""
      aria-hidden="true"
    />
  );
}
