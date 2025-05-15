"use client";

import { Button } from "@/components/ui/button";
import { useCreateVideo } from "@/lib/state/create-video-store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { VideoFormData } from "@/lib/state/create-video-schema";

export function StepEight() {
  const router = useRouter();
  const { getValidatedFormData } = useCreateVideo();
  const { data: session } = useSession();

  const generateMutation = useMutation({
    mutationFn: async (formData: VideoFormData) => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoData: formData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate video");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Video generation started", {
        description: "Your video is being generated. This may take a few minutes.",
      });
      router.push("/generations");
    },
    onError: (error: Error) => {
      toast.error("Generation failed", {
        description: error.message,
      });
    },
  });

  const handleGenerate = () => {
    const formData = getValidatedFormData();
    if (!session?.user?.id) return;

    if (formData) {
      generateMutation.mutate(formData);
    } else {
      const currentErrors = useCreateVideo.getState().errors;
      console.log("Validation failed:", currentErrors);
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-serif">Ready to Generate</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Cost - 1 credit
              </span>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full text-md font-semibold font-sans"
              size="lg"
            >
              Generate Video ✨
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Generate Video ✨ </AlertDialogTitle>
              <AlertDialogDescription>
                This action will use 1 credit from your account. Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
