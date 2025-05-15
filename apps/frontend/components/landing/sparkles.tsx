"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  speed: number;
  depth: number;
  driftX: number;
  phase: number;
}

const random = (seed: string) => Math.random();
const interpolate = (value: number, [min, max]: number[], [outMin, outMax]: number[]) => 
  outMin + (outMax - outMin) * ((value - min) / (max - min));

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => {
    const depth = random(`depth${i}`); // 0 = background, 1 = foreground
    const driftRange = interpolate(depth, [0, 1], [10, 30]);
    const drift = random(`drift${i}`) * driftRange - driftRange / 2;
    return {
      id: i,
      initialX: random(`x${i}`) * 100,
      initialY: 100,
      size: interpolate(depth, [0, 1], [2, 6]),
      speed: interpolate(depth, [0, 1], [2, 4]),
      depth,
      driftX: drift,
      phase: random(`phase${i}`),
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
  count = 50,
  baseColor = "#FFE5B4",
  speed = 0.3,
  baseOpacity = 0.7,
}) => {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <div className="relative w-full h-full pointer-events-none">
      {particles.map((particle) => {
        const maxOpacity = interpolate(
          particle.depth,
          [0, 1],
          [baseOpacity * 0.3, baseOpacity]
        );
        const blur = interpolate(particle.depth, [0, 1], [2, 0.5]);
        const duration = particle.speed / speed;
        const timedDelay = -particle.phase * duration;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.initialX}%`,
              top: `${particle.initialY}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: baseColor,
              boxShadow: `0 0 ${particle.size * (1 + particle.depth)}px ${baseColor}`,
              zIndex: Math.floor(particle.depth * 100),
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              left: `${particle.initialX + particle.driftX}%`,
              top: `0%`,
              opacity: [0, maxOpacity, maxOpacity, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: duration,
              delay: timedDelay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};
