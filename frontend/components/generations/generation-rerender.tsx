import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Generation } from "@/types/common";

type GenerationRerenderProps = {
  generation: Generation;
};

export function GenerationRerender({
  generation,
}: GenerationRerenderProps) {
  const queryClient = useQueryClient();

  // Check if generation is older than 24 hours
  const isGenerationExpiredForRerender = () => {
    const updatedAt = new Date(generation.updatedAt);
    const now = new Date();
    const hoursDifference = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
    return hoursDifference > 24;
  };

  const [isRerendering, setIsRerendering] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const handleRerender = async () => {
    setIsRerendering(true);
    setLimitReached(false);
    try {
      const initRes = await fetch(`/api/rerender`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: generation.jobId }),
      });
      if (initRes.status === 429) {
        setLimitReached(true);
        toast.error("Re-render limit reached");
        setIsRerendering(false);
        return;
      }
      if (!initRes.ok) throw new Error("Failed to re-render video");
      const result = await initRes.json();
      toast.success("Re-render started", {
        description: "Your video is being re-rendered. This may take a few minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      return result;
    } catch (error: any) {
      toast.error("Re-render failed", {
        description: error.message,
      });
    } finally {
      setIsRerendering(false);
    }
  };

  // Don't show the button if:
  // 1. The generation is not completed
  // 2. The generation is older than 24 hours
  if (generation.status !== "completed" || isGenerationExpiredForRerender()) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRerender}
            disabled={isRerendering}
          >
            {isRerendering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isGenerationExpiredForRerender() 
              ? "Re-render not available for generations older than 24 hours" 
              : "Re-render video for next 24 hours"}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
} 