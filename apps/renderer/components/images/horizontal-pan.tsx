import { Img, useCurrentFrame, interpolate, random } from "remotion";

interface HorizontalPanProps {
  src: string;
  duration: number;
  key: string;
}

export const HorizontalPan: React.FC<HorizontalPanProps> = ({
  src,
  duration,
}) => {
  const frame = useCurrentFrame();

  // Use src as seed to get consistent random direction for each image
  const direction = random(src) > 0.5 ? 1 : -1;

  // Normalize progress to 0-1 range regardless of duration
  const progress = frame / duration;

  const moveX = interpolate(
    progress,
    [0, 1],
    [0, 8 * direction], // Multiply by direction to randomize left/right
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => Math.sin((t * Math.PI) / 4),
    }
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          transform: "scale(1.18)",
        }}
      >
        <Img
          src={src}
          className="absolute top-1/2 left-1/2 w-full h-full object-cover"
          style={{
            transform: `translate(-50%, -50%) translateX(${moveX}%)`,
          }}
        />
      </div>
    </div>
  );
};
