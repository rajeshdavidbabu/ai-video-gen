import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

type GenerationCopyProps = {
  jobId: string;
};

export function GenerationCopy({ jobId }: GenerationCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jobId)
      .then(() => {
        setCopied(true);
        toast.success("Job ID copied");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy Job ID");
      });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? "Copied!" : "Copy job id"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default GenerationCopy;
