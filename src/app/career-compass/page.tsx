import type { Metadata } from "next";
import { CareerCompassTool } from "@/components/CareerCompassTool";

export const metadata: Metadata = {
  title: "半導体キャリア市場価値診断",
  description: "職種、経験年数、英語力、転職の狙いから、半導体業界での市場価値スコア、想定年収、伸ばすべきスキル、今日の一手を整理します。",
};

export default function CareerCompassPage() {
  return (
    <main className="page">
      <CareerCompassTool />
    </main>
  );
}
