import React from "react";
import {
  random,
  interpolate,
  useCurrentFrame,
  interpolateColors,
} from "remotion";
import { useVideoConfig } from "remotion";

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  speed: number;
  delay: number;
  depth: number; // Z-depth value (0-1)
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => {
    const depth = random(`depth${i}`); // 0 = background, 1 = foreground
    return {
      id: i,
      initialX: random(`x${i}`) * 100,
      initialY: random(`y${i}`) * 100,
      // Size varies with depth - smaller in background, larger in foreground
      size: interpolate(depth, [0, 1], [2, 8]),
      // Speed varies with depth - slower in background, faster in foreground
      speed: interpolate(depth, [0, 1], [0.02, 0.08]),
      delay: random(`delay${i}`) * 200,
      depth,
    };
  });
};

interface SparklesProps {
  count?: number;
  baseColor?: string;
  speed?: number;
  baseOpacity?: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  count = 80, // More particles for better depth effect
  baseColor = "#FFE5B4",
  speed = 0.3,
  baseOpacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const particles = React.useMemo(() => generateParticles(count), [count]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => {
        const adjustedFrame = Math.max(0, frame - particle.delay);
        const progress = (adjustedFrame * particle.speed * speed * 0.2) % 1;

        // Movement range based on depth
        const driftRange = interpolate(particle.depth, [0, 1], [3, 15]);
        const verticalRange = interpolate(particle.depth, [0, 1], [5, 20]);

        const x = interpolate(
          progress,
          [0, 1],
          [
            particle.initialX,
            particle.initialX +
              (random(`drift${particle.id}`) * driftRange - driftRange / 2),
          ]
        );

        const y = interpolate(
          progress,
          [0, 1],
          [particle.initialY, particle.initialY - verticalRange]
        );

        // Opacity varies with depth
        const maxOpacity = interpolate(
          particle.depth,
          [0, 1],
          [baseOpacity * 0.5, baseOpacity]
        );

        const particleOpacity = interpolate(
          progress,
          [0, 0.2, 0.8, 1],
          [0, maxOpacity, maxOpacity, 0],
          {
            extrapolateRight: "clamp",
          }
        );

        // Pulsing effect varies with depth
        const pulsingIntensity = interpolate(
          particle.depth,
          [0, 1],
          [0.1, 0.2]
        );
        const pulsingSpeed = interpolate(particle.depth, [0, 1], [0.03, 0.06]);

        const pulsingSize =
          particle.size *
          (1 + Math.sin(adjustedFrame * pulsingSpeed) * pulsingIntensity);

        // Color variation based on depth
        const particleColor = interpolateColors(
          particle.depth,
          [0, 0.5, 1],
          ["#FFE5B4", "#FFD700", "#FFA500"] // Vary from light to warmer colors
        );

        // Blur based on depth
        const blur = interpolate(particle.depth, [0, 1], [1.5, 0]);

        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: pulsingSize,
              height: pulsingSize,
              backgroundColor: particleColor,
              opacity: particleOpacity,
              boxShadow: `0 0 ${
                pulsingSize * (1 + particle.depth)
              }px ${particleColor}`,
              transform: "translate(-50%, -50%)",
              filter: `blur(${blur}px)`,
              zIndex: Math.floor(particle.depth * 100),
            }}
          />
        );
      })}
    </div>
  );
};
