"use client";

import Link from "next/link";
import { ALL_SHORTS_DATA } from "@/lib/state/sample-videos";
import { VideoCard } from "@/components/discover/video-card";
import { ParticleButton } from "@/components/ui/particle-button";
import { MousePointerClick } from "lucide-react";

const SHORTS_DATA = ALL_SHORTS_DATA;

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-8 overflow-auto">
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold font-serif">AI Shorts Pro</h1>
          </div>
          <p className="text-muted-foreground font-sans">
            Discover what our users have already created
          </p>
        </div>

        {/* Shorts Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SHORTS_DATA.map((short) => (
            <VideoCard key={short.id} short={short} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center py-8">
          <Link href="/create" className="inline-block">
            <ParticleButton
              successDuration={1000}
              variant="default"
              className="w-full text-md font-semibold font-sans group"
            >
              Let's Create Yours
              <MousePointerClick className="h-4 w-4" />
            </ParticleButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
