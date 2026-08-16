import type {ReactNode} from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../theme";

export const Chrome = ({
  children,
  reviewedAt,
  seriesLabel,
  sourceLabel,
}: {
  children: ReactNode;
  reviewedAt: string;
  seriesLabel: string;
  sourceLabel: string;
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.background, color: theme.text, fontFamily: theme.font}}>
      <div style={{height: 12, backgroundColor: theme.border, width: "100%"}}>
        <div style={{height: "100%", width: `${progress}%`, backgroundColor: theme.action}} />
      </div>

      <div style={{position: "absolute", top: 56, left: 72, right: 72, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontSize: 25, fontWeight: 700, letterSpacing: "0.04em"}}>Manufacturing Compass</div>
        <div style={{fontSize: 22, color: theme.muted, letterSpacing: "0.08em"}}>{seriesLabel}</div>
      </div>

      {children}

      <div style={{position: "absolute", left: 72, right: 72, bottom: 46, display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: theme.muted}}>
        <div style={{fontSize: 18, lineHeight: 1.45}}>
          <div>出典・詳細：{sourceLabel}</div>
          <div>確認日 {reviewedAt}</div>
        </div>
        <div style={{fontSize: 20, fontWeight: 700}}>mfg-compass.com</div>
      </div>
    </AbsoluteFill>
  );
};
