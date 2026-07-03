import type { Metadata } from "next";
import { CareerCompassTool } from "@/components/CareerCompassTool";

export const metadata: Metadata = {
  title: "キャリアコンパス",
  description: "職種、経験年数、英語力、転職の狙いから、半導体業界で今近い会社と半年後に向けた準備を整理します。",
};

export default function CareerCompassPage() {
  return (
    <main className="page">
      <CareerCompassTool />
    </main>
  );
}
