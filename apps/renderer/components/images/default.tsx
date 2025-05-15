import { Img } from "remotion";

interface DefaultProps {
  src: string;
  duration: number;
}

export const Default: React.FC<DefaultProps> = ({ src, duration }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute w-full h-full">
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
