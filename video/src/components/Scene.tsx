import type {CSSProperties, ReactNode} from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const Scene = ({
  start,
  end,
  children,
  style,
}: {
  start: number;
  end: number;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [start, start + 12, end - 12, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enter = spring({fps, frame: frame - start, config: {damping: 18, stiffness: 105}});

  return (
    <div
      style={{
        position: "absolute",
        inset: "150px 72px 130px",
        opacity,
        transform: `translateY(${32 * (1 - enter)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
