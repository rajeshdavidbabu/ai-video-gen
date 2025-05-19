"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "./posthog/providers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PostHogProvider>{children}</PostHogProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
