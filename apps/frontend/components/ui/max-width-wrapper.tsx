import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-2.5", className)}>
      {children}
    </div>
  );
}
