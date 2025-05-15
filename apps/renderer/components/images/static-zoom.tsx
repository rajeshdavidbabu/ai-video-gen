import { Img, random } from "remotion";

const MIN_ZOOM = 1.2;
const MAX_ZOOM = 1.4;

interface StaticZoomProps {
  src: string;
  duration: number;
}

export const StaticZoom: React.FC<StaticZoomProps> = ({ src, duration }) => {
  // Generate consistent random zoom value for this image
  const randomSeed = random(src);
  const zoom = MIN_ZOOM + randomSeed * (MAX_ZOOM - MIN_ZOOM);

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
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
};
