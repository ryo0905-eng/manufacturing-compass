import { createGuideSocialImage } from "@/lib/guide-social-image";

export const alt = "Manufacturing Compassの半導体ガイド";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type GuideSocialImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: GuideSocialImageProps) {
  const { slug } = await params;
  return createGuideSocialImage(slug);
}
