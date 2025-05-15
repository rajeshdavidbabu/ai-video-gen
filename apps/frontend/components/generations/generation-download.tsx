import { useState, useRef } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Generation } from "@/types/common";
import { toast } from "sonner";

type GenerationDownloadProps = {
  generation: Generation;
};

export function GenerationDownload({ generation }: GenerationDownloadProps) {
  if (generation.status !== "completed") return null;
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setLimitReached(false);
    try {
      // Fetch signed URL with download limit enforcement
      const initRes = await fetch(`/api/download-url/${generation.jobId}`);
      if (initRes.status === 429) {
        setLimitReached(true);
        toast.error("Download limit reached");
        setIsDownloading(false);
        return;
      }
      if (!initRes.ok) throw new Error("Failed to get download URL");
      const { url: signedUrl } = await initRes.json();

      const resp = await fetch(signedUrl);
      if (!resp.ok || !resp.body) throw new Error("Failed to download video");

      // Stream the response and track progress
      const contentLength = Number(resp.headers.get("Content-Length"));
      const reader = resp.body.getReader();
      let received = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (contentLength) setProgress(Math.round((received / contentLength) * 100));
        }
      }
      const blob = new Blob(chunks, { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `video-${generation.jobId}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      setProgress(null);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
      setProgress(null);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          disabled={isDownloading || limitReached}
        >
          {isDownloading ? (
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Show spinner only if progress is not available yet */}
              {progress === null && (
                <Loader2 className="absolute h-8 w-8 animate-spin text-primary opacity-40" />
              )}
              {progress !== null && (
                <svg className="absolute h-8 w-8" viewBox="0 0 32 32">
                  <circle
                    cx="16" cy="16" r="14"
                    fill="none"
                    stroke="currentColor"
                    className="text-primary"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={2 * Math.PI * 14 * (1 - progress / 100)}
                    style={{ transition: 'stroke-dashoffset 0.2s' }}
                  />
                </svg>
              )}
            </div>
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div style={{ minWidth: 120 }}>
          <p>{limitReached ? "Download limit reached" : "Download video"}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default GenerationDownload;
