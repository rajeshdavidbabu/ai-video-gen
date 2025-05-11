import type React from "react";
import { useCurrentFrame, interpolate, staticFile } from "remotion";
import { useVideoConfig } from "remotion";

interface MovieGrainProps {
  opacity?: number;
  speed?: number;
  type?: "cement" | "noise";
}

export const MovieGrain: React.FC<MovieGrainProps> = ({
  opacity = 0.1,
  speed = 1,
  type = "cement",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Create keyframe positions for the grain animation
  const positions = [
    { x: 0, y: 0 },
    { x: -5, y: -8 },
    { x: -12, y: -15 },
    { x: -3, y: -20 },
    { x: -8, y: -5 },
    { x: -15, y: -12 },
    { x: -7, y: -18 },
    { x: -10, y: -3 },
    { x: -4, y: -15 },
    { x: -18, y: -7 },
    { x: -2, y: -10 },
    { x: -14, y: -4 },
    { x: -6, y: -16 },
    { x: -11, y: -8 },
    { x: -16, y: -13 },
    { x: -8, y: -19 },
    { x: -13, y: -6 },
    { x: -5, y: -11 },
    { x: -17, y: -9 },
    { x: -9, y: -14 },
  ];

  // Calculate current position based on frame
  const progress = (frame * speed) % positions.length;
  const currentIndex = Math.floor(progress);
  const nextIndex = (currentIndex + 1) % positions.length;

  // Interpolate between positions
  const x = interpolate(
    progress % 1,
    [0, 1],
    [positions[currentIndex].x, positions[nextIndex].x]
  );

  const y = interpolate(
    progress % 1,
    [0, 1],
    [positions[currentIndex].y, positions[nextIndex].y]
  );

  const texture = staticFile(`/textures/${type}-texture.jpg`);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute"
        style={{
          width: "300%",
          height: "300%",
          top: "-100%",
          left: "-100%",
          backgroundImage: `url(${texture})`,
          backgroundRepeat: "repeat",
          opacity: opacity,
          transform: `translate(${x}%, ${y}%)`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};
