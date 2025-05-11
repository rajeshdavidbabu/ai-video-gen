import {
  useCurrentFrame,
  interpolate,
  Img,
  useVideoConfig,
  random,
} from "remotion";

const MIN_ZOOM = 1.2;
const MAX_ZOOM = 1.4;
const MIN_MOVEMENT = 1;
const MAX_MOVEMENT = 2;

interface ShakeProps {
  src: string;
  duration: number;
}

// Static zoom and shake
export const Shake: React.FC<ShakeProps> = ({ src, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate consistent random values for this image
  const randomSeed = random(src);
  const randomSeed2 = random(`${src}2`);
  const randomSeed3 = random(`${src}3`);
  const randomSeed4 = random(`${src}4`);
  const randomSeed5 = random(`${src}5`);

  // Pre-calculated random zoom for this image
  const zoom = MIN_ZOOM + randomSeed * (MAX_ZOOM - MIN_ZOOM);
  const randomMovement =
    MIN_MOVEMENT + randomSeed2 * (MAX_MOVEMENT - MIN_MOVEMENT);

  // Random direction angles (0-360 degrees)
  const startAngle = randomSeed4 * 360;
  const endAngle = (startAngle + 120 + randomSeed5 * 120) % 360;

  // Convert angles to x,y coordinates for movement
  const getCoordinates = (angle: number, magnitude: number) => ({
    x: Math.cos((angle * Math.PI) / 180) * magnitude,
    y: Math.sin((angle * Math.PI) / 180) * magnitude,
  });

  const startPos = getCoordinates(startAngle, 0);
  const endPos = getCoordinates(endAngle, randomMovement);

  // Slower movement interpolation
  const moveX = interpolate(frame, [0, duration], [startPos.x, endPos.x], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => Math.sin((t * Math.PI) / 2),
  });

  const moveY = interpolate(frame, [0, duration], [startPos.y, endPos.y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => Math.sin((t * Math.PI) / 2),
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          transform: `scale(${zoom})`,
        }}
      >
        <Img
          src={src}
          className="absolute top-1/2 left-1/2 w-full h-full object-cover"
          style={{
            transform: `translate(calc(-50% + ${moveX}%), calc(-50% + ${moveY}%))`,
          }}
        />
      </div>
    </div>
  );
};
