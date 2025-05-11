import Image from "next/image";
import { useState } from "react";
import { Sparkles } from "./sparkles";

export function HeroImages() {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = 3;

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[300px] h-[400px] sm:w-[400px] sm:h-[600px]">
        <div className="relative w-full h-full">
          <Image
            src="/landing/images/image-1.png"
            alt="AI generated video preview 1"
            className="object-cover rounded-md shadow-lg animate-buttonheartbeat"
            fill
            onLoad={handleImageLoad}
            priority
          />
        </div>
        
        <div className="absolute -bottom-6 -left-6 w-[150px] h-[200px] sm:w-[200px] sm:h-[300px]">
          <Image
            src="/landing/images/image-2.png"
            alt="AI generated video preview 2"
            className="object-cover rounded-md shadow-lg animate-buttonheartbeat"
            fill
            onLoad={handleImageLoad}
            priority
          />
        </div>

        <div className="absolute -top-6 -right-6 w-[150px] h-[200px] sm:w-[200px] sm:h-[300px]">
          <Image
            src="/landing/images/image-3.png"
            alt="AI generated video preview 3"
            className="object-cover rounded-md shadow-lg animate-buttonheartbeat"
            fill
            onLoad={handleImageLoad}
            priority
          />
        </div>

        {imagesLoaded === totalImages && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Sparkles 
              count={50}
              baseColor="#FFE5B4"
              speed={0.4}
              baseOpacity={0.7}
            />
          </div>
        )}
      </div>
    </div>
  );
}
