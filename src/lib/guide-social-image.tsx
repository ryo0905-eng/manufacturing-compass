import { ImageResponse } from "next/og";
import { getGuideBySlug } from "@/data/editorial";

const categoryLabels = {
  experience: "RYOの実体験",
  foundation: "半導体転職の基本",
  role: "職種別ルート",
  technology: "半導体製造工程シリーズ",
} as const;

const processSteps = [
  ["01", "材料・基板", "シリコンウェーハ"],
  ["02", "素子形成", "成膜・露光・加工"],
  ["03", "配線・計測", "平坦化・配線・検査"],
  ["04", "テスト・組立", "試験・個片化・封止"],
] as const;

const careerSteps = [
  ["01", "UNDERSTAND", "仕事と業界を知る"],
  ["02", "ORGANIZE", "経験との接点を整理"],
  ["03", "NEXT ACTION", "次の準備を決める"],
] as const;

export function createGuideSocialImage(slug: string) {
  const guide = getGuideBySlug(slug);
  const isProcessGuide = guide?.category === "technology";
  const steps: ReadonlyArray<readonly [string, string, string]> = isProcessGuide ? processSteps : careerSteps;
  const title = guide?.title ?? "製造業経験を半導体キャリアへ";
  const category = guide ? categoryLabels[guide.category] : "Manufacturing Compass ガイド";
  const query = guide?.targetQuery ?? "半導体業界・キャリアガイド";

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#f8fafb",
          color: "#11181c",
          padding: "58px 62px",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, display: "flex", width: "100%", height: 9, background: "#0f4450" }} />
        <div style={{ position: "absolute", top: 9, left: 0, display: "flex", width: 320, height: 5, background: "#30b6c9" }} />
        <div style={{ position: "absolute", right: -80, bottom: -100, display: "flex", width: 330, height: 330, border: "1px solid rgba(0, 107, 128, 0.12)", borderRadius: 999 }} />
        <div style={{ position: "absolute", right: -12, bottom: -34, display: "flex", width: 200, height: 200, border: "1px solid rgba(0, 107, 128, 0.1)", borderRadius: 999 }} />

        <div style={{ display: "flex", width: 735, height: "100%", flexDirection: "column", paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", color: "#006b80", fontSize: 17, fontWeight: 700, letterSpacing: "0.04em" }}>
            <span style={{ display: "flex", width: 13, height: 13, marginRight: 10, background: "#30b6c9" }} />
            {category}
          </div>

          <div style={{ display: "flex", marginTop: 30, fontSize: 49, fontWeight: 700, lineHeight: 1.32, letterSpacing: "-0.035em" }}>
            {title}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
            <span style={{ display: "flex", border: "1px solid #cbd8dd", borderRadius: 999, background: "#ffffff", color: "#526168", padding: "8px 14px", fontSize: 14 }}>
              {query}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: "auto", borderTop: "1px solid #dce5e8", paddingTop: 19 }}>
            <strong style={{ color: "#0f4450", fontSize: 21, letterSpacing: "-0.015em" }}>Manufacturing Compass</strong>
            <span style={{ display: "flex", marginLeft: 17, color: "#627177", fontSize: 13 }}>製造業の経験から、半導体を考える</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: 341,
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: 12,
            background: "#0f4450",
            color: "#ffffff",
            padding: "30px 29px",
          }}
        >
          <div style={{ display: "flex", marginBottom: 22, color: "#85ddec", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>
            {isProcessGuide ? "PROCESS FLOW" : "CAREER GUIDE"}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.map(([number, label, detail], index) => (
              <div key={number} style={{ position: "relative", display: "flex", minHeight: isProcessGuide ? 86 : 105 }}>
                {index < steps.length - 1 ? <span style={{ position: "absolute", top: 29, bottom: 0, left: 13, display: "flex", width: 1, background: "rgba(110, 231, 168, 0.34)" }} /> : null}
                <span style={{ zIndex: 1, display: "flex", width: 28, height: 28, flexShrink: 0, alignItems: "center", justifyContent: "center", border: "1px solid rgba(110, 231, 168, 0.7)", background: "#0f4450", color: "#6ee7a8", fontSize: 9, fontWeight: 700 }}>
                  {number}
                </span>
                <div style={{ display: "flex", minWidth: 0, flexDirection: "column", marginLeft: 13 }}>
                  <strong style={{ display: "flex", fontSize: 17, lineHeight: 1.35 }}>{label}</strong>
                  <span style={{ display: "flex", marginTop: 4, color: "rgba(255, 255, 255, 0.62)", fontSize: 12, lineHeight: 1.45 }}>{detail}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 2, borderTop: "1px solid rgba(255, 255, 255, 0.16)", paddingTop: 16, color: "rgba(255, 255, 255, 0.54)", fontSize: 11 }}>
            mfg-compass.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
