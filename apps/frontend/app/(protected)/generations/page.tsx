"use client";

import { useQuery } from "@tanstack/react-query";
import { GenerationCard } from "@/components/generations/generation-card";
import { Generation } from "@/types/common";
import Link from "next/link";
import { ParticleButton } from "@/components/ui/particle-button";
import { Sparkles } from "lucide-react";

export default function GenerationsPage() {
  // Main query for all generations
  const { data: generations = [], isLoading } = useQuery<Generation[]>({
    queryKey: ["generations"],
    queryFn: async () => {
      const res = await fetch("/api/user-generations");
      if (!res.ok) throw new Error("Failed to fetch generations");
      return res.json();
    },
    refetchOnMount: "always",
    // Only refetch if there are pending/processing items
    refetchInterval: (query) => {
      const hasActiveGenerations = query.state.data?.some((gen) =>
        ["pending", "processing"].includes(gen.status)
      );
      return hasActiveGenerations ? 5000 : false;
    },
  });

  return (
    <div className="p-4 sm:p-8 overflow-auto">
      <main className="max-w-7xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold font-serif">Your Generations</h1>
          </div>
          <p className="text-muted-foreground font-sans">
            Track your video generation progress
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
            <div className="col-span-full flex flex-col space-y-2 justify-center items-center">
              <p className="text-muted-foreground font-sans">
                Loading your generations...
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {!isLoading && generations.length === 0 && (
            <div className="col-span-full flex flex-col space-y-2 justify-center items-center">
              <p className="text-muted-foreground font-sans">
                You don't have any generations yet.
              </p>
              <Link href="/create">
                <ParticleButton
                  successDuration={1000}
                  variant="default"
                  className="w-full text-md font-semibold font-sans group"
                >
                  Let's Create Yours
                  <Sparkles className="h-4 w-4" />
                </ParticleButton>
              </Link>
            </div>
          )}
          {generations.map((generation) => (
            <GenerationCard key={generation.jobId} generation={generation} />
          ))}
        </div>
      </main>
    </div>
  );
}
