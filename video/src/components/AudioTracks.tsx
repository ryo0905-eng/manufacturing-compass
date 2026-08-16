import {Html5Audio, interpolate, Sequence, staticFile, useVideoConfig} from "remotion";
import type {ShortVideoAudio} from "../types/short-video";

export const AudioTracks = ({audio}: {audio: ShortVideoAudio}) => {
  const {durationInFrames} = useVideoConfig();
  const fadeOutStart = Math.max(audio.bgmFadeInFrames, durationInFrames - audio.bgmFadeOutFrames);

  return (
    <>
      <Sequence from={audio.narrationStartFrame} layout="none">
        <Html5Audio
          name="Narration"
          src={staticFile(audio.narrationFile)}
          volume={audio.narrationVolume}
        />
      </Sequence>
      <Html5Audio
        name="Background music"
        src={staticFile(audio.bgmFile)}
        volume={(frame) => interpolate(
          frame,
          [0, audio.bgmFadeInFrames, fadeOutStart, durationInFrames],
          [0, audio.bgmVolume, audio.bgmVolume, 0],
          {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
        )}
      />
    </>
  );
};
