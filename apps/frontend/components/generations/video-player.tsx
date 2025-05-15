import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Generation } from "@/types/common";
import Image from "next/image";
import { Download } from "lucide-react";
import { toast } from "sonner";

type VideoPlayerProps = {
  generation: Generation;
};

// Export as both a named export and default export for backward compatibility
export function VideoPlayer({ generation }: VideoPlayerProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isLoadingPosterUrl, setIsLoadingPosterUrl] = useState(false);
  const [posterError, setPosterError] = useState(false);

  // Fetch the CloudFront URL for the poster
  useEffect(() => {
    const fetchPosterUrl = async () => {
      if (!generation.jobId) return;
      
      setIsLoadingPosterUrl(true);
      setPosterError(false);
      
      try {
        const res = await fetch(`/api/assets/poster/${generation.jobId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch poster URL');
        }
        
        const data = await res.json();
        if (data?.url) {
          setPosterUrl(data.url);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching poster URL:', error);
        setPosterError(true);
      } finally {
        setIsLoadingPosterUrl(false);
      }
    };
    
    fetchPosterUrl();
  }, [generation.jobId]);

  // Show spinner while loading poster
  const showPosterSpinner = isLoadingPosterUrl || (posterUrl && !fadeIn);

  // Handle image load complete with fade-in effect
  const handleImageLoaded = () => {
    setIsImageLoaded(true);
    // Add a small delay before starting the fade-in animation
    setTimeout(() => setFadeIn(true), 50);
  };

  // Common transition classes
  const fadeTransition = "transition-opacity duration-500";
  const fadeClasses = (shouldFade: boolean) => 
    `${fadeTransition} ${shouldFade ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-lg border bg-card">
      {/* Spinner while loading poster */}
      {showPosterSpinner && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      {/* Error state */}
      {posterError && !isLoadingPosterUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/50 text-white text-center p-4">
          <p>Failed to load image</p>
          <button 
            onClick={() => setPosterError(false)} 
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
      {/* Poster image only (playback disabled) */}
      {posterUrl && (
        <div className="relative w-full h-full">
          <div className={fadeClasses(fadeIn)}>
            <Image
              src={posterUrl}
              alt="Video thumbnail"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
              onLoadingComplete={handleImageLoaded}
              onError={() => {
                console.error("Failed to load poster image");
                setPosterError(true);
              }}
            />
          </div>
          {/* Centered custom download button */}
          <DownloadWithProgress generation={generation} />
        </div>
      )}
    </div>
  );
}

// Also export as default
export default VideoPlayer;

// Custom download button with progress for video poster
function DownloadWithProgress({ generation }: { generation: Generation }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setLimitReached(false);
    try {
      const initRes = await fetch(`/api/download-url/${generation.jobId}`);
      if (initRes.status === 429) {
        setLimitReached(true);
        toast.error("Download limit reached");
        return;
      }
      if (!initRes.ok) throw new Error("Failed to get download URL");
      const { url: signedUrl } = await initRes.json();

      const resp = await fetch(signedUrl);
      if (!resp.ok || !resp.body) throw new Error("Failed to download video");

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
      // Optionally show error
    } finally {
      setIsDownloading(false);
      setProgress(null);
    }
  };

  // Button appearance (large, centered, play-style)
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <button
        ref={buttonRef}
        className="group bg-black/40 rounded-full p-0 flex items-center justify-center border-4 border-white shadow-lg hover:scale-105 transition-all w-14 h-14 md:w-16 md:h-16 focus:outline-none disabled:opacity-60"
        onClick={handleDownload}
        disabled={isDownloading || limitReached}
        aria-label="Download video"
      >
        {/* Progress spinner/arc */}
        {isDownloading ? (
          <svg className="absolute w-14 h-14 md:w-16 md:h-16" viewBox="0 0 32 32">
            <circle
              cx="16" cy="16" r="13"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              opacity="0.25"
            />
            <circle
              cx="16" cy="16" r="13"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeDasharray={2 * Math.PI * 13}
              strokeDashoffset={progress !== null ? 2 * Math.PI * 13 * (1 - progress / 100) : 2 * Math.PI * 13 * 0.95}
              style={{ transition: 'stroke-dashoffset 0.2s' }}
            />
            {progress !== null && (
              <text
                x="16" y="20"
                textAnchor="middle"
                fontSize="10"
                fill="#fff"
                fontWeight="bold"
              >{progress}%</text>
            )}
          </svg>
        ) : (
          <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 32 32">
            <path d="M16 4v16m0 0l-6-6m6 6l6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <rect x="8" y="24" width="16" height="2.5" rx="1" fill="#fff" />
          </svg>
        )}
      </button>
    </div>
  );
}
