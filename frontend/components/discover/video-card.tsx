"use client";

import { useState } from "react";
import { SkeletonCard } from "@/components/discover/skeleton-card";
import { useInView } from "react-intersection-observer";
import { Play, Loader2 } from "lucide-react";
import { getShortsThumbnail } from "@/lib/utils";
import type { Short } from "@/lib/state/sample-videos";
import Image from "next/image";

export function VideoCard({ short }: { short: Short }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const { ref } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div className="space-y-2">
      <div
        ref={ref}
        className="relative aspect-[9/16] rounded-lg overflow-hidden border bg-card group cursor-pointer"
        onClick={() => {
          setIsIframeLoading(true);
          setIsPlaying(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsIframeLoading(true);
            setIsPlaying(true);
          }
        }}
      >
        {!isPlaying ? (
          <>
            {isLoading && <SkeletonCard />}
            <Image
              src={getShortsThumbnail(short.id)}
              alt={short.title}
              width={320}
              height={568}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={() => setIsLoading(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </>
        ) : (
          <>
            <Image
              src={getShortsThumbnail(short.id)}
              alt={short.title}
              width={320}
              height={568}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {isIframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}
            <iframe
              src={`https://www.youtube.com/embed/${short.id}?controls=1&disablekb=1&rel=0&modestbranding=1&playsinline=1&showinfo=0&fs=0&volume=25&iv_load_policy=3&autohide=1&autoplay=1`}
              title={short.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full z-10"
              onLoad={() => setIsIframeLoading(false)}
            />
          </>
        )}
      </div>
      <h4 className="text-sm font-medium line-clamp-2 px-1">{short.title}</h4>
    </div>
  );
}
