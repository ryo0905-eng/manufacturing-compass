import {Composition} from "remotion";
import {SemiconductorInspectionShort} from "./compositions/SemiconductorInspectionShort";

export const VIDEO_FPS = 30;
export const VIDEO_DURATION_IN_FRAMES = 1395;

export const VideoRoot = () => (
  <Composition
    id="SemiconductorInspectionShort"
    component={SemiconductorInspectionShort}
    durationInFrames={VIDEO_DURATION_IN_FRAMES}
    fps={VIDEO_FPS}
    width={1080}
    height={1920}
  />
);
