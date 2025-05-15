import {
  useCurrentFrame,
  interpolate,
  Img,
  spring,
  useVideoConfig,
  random,
} from "remotion";

const MIN_ZOOM = 1.2;
const MAX_ZOOM = 1.3;
const MIN_MOVEMENT = 1;
const MAX_MOVEMENT = 2;

interface ZoomAndShakeProps {
  src: string;
  duration: number;
}

// Dynamic zoom and shake
export const ZoomAndShake: React.FC<ZoomAndShakeProps> = ({
  src,
  duration,
}) => {
  const frame = useCurrentFrame();

  // Generate consistent random values for this image
  const randomSeed = random(src);
  const randomSeed2 = random(`${src}2`);
  const randomSeed4 = random(`${src}4`);
  const randomSeed5 = random(`${src}5`);

  // Random zoom and movement values for this image
  const randomZoom = MIN_ZOOM + randomSeed * (MAX_ZOOM - MIN_ZOOM);
  const randomMovement =
    MIN_MOVEMENT + randomSeed2 * (MAX_MOVEMENT - MIN_MOVEMENT);

  // Phase 1: Zoom (takes first 50% of duration)
  const zoomDuration = duration * 0.5;
  const zoom = interpolate(frame, [0, zoomDuration], [1, randomZoom], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: (t) => Math.sin((t * Math.PI) / 8),
  });

  // Phase 2: Movement starts after zoom completes
  const startAngle = randomSeed4 * 360;
  const endAngle = (startAngle + 120 + randomSeed5 * 120) % 360;

  const getCoordinates = (angle: number, magnitude: number) => ({
    x: Math.cos((angle * Math.PI) / 180) * magnitude,
    y: Math.sin((angle * Math.PI) / 180) * magnitude,
  });

  const startPos = getCoordinates(startAngle, 0);
  const endPos = getCoordinates(endAngle, randomMovement);

  // Movement interpolation starting from zoomDuration
  const moveX = interpolate(
    frame,
    [zoomDuration, duration],
    [startPos.x, endPos.x],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => Math.sin((t * Math.PI) / 2),
    }
  );

  const moveY = interpolate(
    frame,
    [zoomDuration, duration],
    [startPos.y, endPos.y],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => Math.sin((t * Math.PI) / 2),
    }
  );

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
