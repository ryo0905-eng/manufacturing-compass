import { createGuideSocialImage } from "@/lib/guide-social-image";

export const alt = "Manufacturing Compassの半導体・製造業記事";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return createGuideSocialImage("semiconductor-market-cap-ranking");
}
