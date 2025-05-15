import { useCurrentFrame, interpolate, Img } from "remotion";
import { Sparkles } from "../overlays/sparkles";

const ZOOM_FACTOR = 1.1;

interface DynamicZoomProps {
  src: string;
  duration: number;
}

export const DynamicZoom: React.FC<DynamicZoomProps> = ({ src, duration }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, duration], [1, ZOOM_FACTOR], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: (t) => Math.sin((t * Math.PI) / 8),
  });

  return (
    <div className="relative w-full h-full">
      <Img
        src={src}
        className="absolute top-1/2 left-1/2 object-cover"
        style={{
          width: `${100 * zoom}%`,
          height: `${100 * zoom}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};
