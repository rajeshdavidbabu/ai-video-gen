import { Generation } from "@/types/common";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type GenerationStatusProps = {
  generation: Generation;
  retryMutation: UseMutationResult<any, Error, string>;
};

export function GenerationStatus({
  generation,
  retryMutation,
}: GenerationStatusProps) {
  return (
    <div className="space-y-4">
      {generation.status === "failed" ? (
        <div className="space-y-4">
          <div className="text-destructive">Generation Failed</div>
        </div>
      ) : (
        <>
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <div>
            <div className="font-medium capitalize">{generation.status}</div>
            {generation.step && (
              <div className="text-sm text-muted-foreground capitalize">
                {generation.step}
              </div>
            )}
          </div>
        </>
      )}
      {generation.statusMessage && (
        <div className="text-xs text-muted-foreground">
          {generation.statusMessage}
          <br />
          <br />
          Job ID: <span className="font-bold">{generation.jobId}</span>
        </div>
      )}
      {generation.status === "failed" &&
        (generation.hasImageAssets || generation.hasAudioAssets) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={() => retryMutation.mutate(generation.jobId)}
                disabled={retryMutation.isPending}
                className="gap-2"
              >
                {retryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                Retry
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Retry with existing assets</p>
            </TooltipContent>
          </Tooltip>
        )}
    </div>
  );
}
