"use client";

import { ALL_SHORTS_DATA } from "@/lib/state/sample-videos";
import { useEffect, useState } from "react";
import { VideoCard } from "@/components/discover/video-card";
import { Marquee } from "@/components/ui/marquee";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function VideoShowcase() {
  const [randomVideos, setRandomVideos] = useState(
    ALL_SHORTS_DATA.slice(0, 10)
  );

  useEffect(() => {
    setRandomVideos(shuffleArray(ALL_SHORTS_DATA).slice(0, 10));
  }, []);

  return (
    <section className="py-20 overflow-hidden border-t border-border/60">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-4xl font-bold text-center font-serif">
          Latest Creations
        </h2>
        <p className="text-muted-foreground text-center mt-4 font-sans">
          Check out what others are creating with AI Shorts Pro
        </p>
      </div>

      <div className="relative flex w-full items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:180s]">
          {randomVideos.map((short) => (
            <div key={short.id} className="w-[300px]">
              <VideoCard short={short} />
            </div>
          ))}
        </Marquee>

        {/* Left gradient blur */}
        <div className="pointer-events-none absolute left-0 w-8 h-full bg-gradient-to-r from-background to-transparent z-10" />

        {/* Right gradient blur */}
        <div className="pointer-events-none absolute right-0 w-8 h-full bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
}
