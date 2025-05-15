"use client";

import { Card } from "@/components/ui/card";
import { GenerationStatus } from "./generation-status";
import { GenerationDelete } from "./generation-delete";
import { GenerationRerender } from "./generation-rerender";
import { GenerationDownload } from "./generation-download";
import { GenerationCopy } from "./generation-copy"; // Added import
import { VideoPlayer } from "./video-player";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Generation } from "@/types/common";


type GenerationCardProps = {
  generation: Generation;
};

export function GenerationCard({
  generation,
}: GenerationCardProps) {
  const queryClient = useQueryClient();

  const retryMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch("/api/retry-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error("Failed to retry generation");
      }
      return response.json();
    },
    onError: (error) => {
      console.error("Error retrying generation:", error);
      toast.error("Failed to retry generation");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });

  if (generation.status === "completed" && generation.renderS3Key) {
    return (
      <div className="space-y-2 relative overflow-hidden">
        <VideoPlayer generation={generation} />
        <div className="flex justify-end gap-2">
          <GenerationCopy jobId={generation.jobId} />
          <GenerationDownload generation={generation} />
          <GenerationRerender generation={generation} />
          <GenerationDelete generation={generation} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Card className="aspect-[9/16] relative flex flex-col items-center justify-center p-4 text-center">
        <GenerationStatus
          generation={generation}
          retryMutation={retryMutation}
        />
      </Card>
      {generation.status === "failed" && (
        <div className="flex justify-end gap-2">
          <GenerationDelete generation={generation} />
        </div>
      )}
    </div>
  );
}
