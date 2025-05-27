import { Audio, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface BackgroundMusicProps {
  src: string;
  startVolume?: number;
  fadeOutDuration?: number;
}

// Fade in and out background music
export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  src,
  startVolume = 0.1,
  fadeOutDuration = 3, // in seconds
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Reduce the requested startVolume by 10%
  const adjustedStartVolume = startVolume * 0.5;

  // Calculate the fade-out timing
  const fadeOutFrames = fadeOutDuration * fps;
  const fadeOutStart = durationInFrames - fadeOutFrames;

  // Calculate the background music volume with smooth fade
  const volume = interpolate(
    frame,
    [0, fadeOutStart, durationInFrames],
    [adjustedStartVolume, adjustedStartVolume, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => t * t, // Quadratic easing for smooth fade
    }
  );

  return <Audio src={src} volume={volume} />;
};
