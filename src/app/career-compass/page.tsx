import type { Metadata } from "next";
import { CareerCompassTool } from "@/components/CareerCompassTool";

export const metadata: Metadata = {
  title: "12問で分かる製造業経験と半導体職種のつながり",
  description: "生産技術、品質、設備、設計、製造DXなどの経験から、近い半導体職種、伝えやすい強み、足りない経験、今日15分でできる準備を確認します。登録不要です。",
  alternates: { canonical: "/career-compass" },
};

export default function CareerCompassPage() {
  return (
    <main className="page">
      <CareerCompassTool />
    </main>
  );
}
