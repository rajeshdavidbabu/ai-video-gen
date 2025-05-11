import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Loader2, Trash } from "lucide-react";

type GenerationDeleteProps = {
  generation: {
    jobId: string;
  };
};

export function GenerationDelete({ generation }: GenerationDeleteProps) {
  const queryClient = useQueryClient();
  
  // Set up delete mutation using Tanstack Query
  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch("/api/delete-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete generation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch generations data
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      toast.success("Generation deleted", {
        description: "The generation has been removed from your list",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete generation", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  const handleDelete = async (jobId: string) => {
    // Execute the mutation
    deleteMutation.mutate(jobId);
  };

  return (
    <div className="flex justify-end gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDelete(generation.jobId)}
            disabled={deleteMutation.isPending}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete generation</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
