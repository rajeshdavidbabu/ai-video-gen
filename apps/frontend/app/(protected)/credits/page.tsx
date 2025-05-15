"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditBalance } from "@/components/credits/credit-balance";
import { CreditPricing } from "@/components/credits/credit-pricing";

export default function CreditsPage() {
  // Fetch user credit balance
  const { data: credits, isLoading } = useQuery({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const res = await fetch("/api/user-credits");
      if (!res.ok) throw new Error("Failed to fetch credits");
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="grid h-[calc(100vh-40px)]">
      {/* Center container */}
      <div className="flex justify-center px-2 sm:px-8 py-4">
        {/* Main card - Grid with 2 rows: auto for header, 1fr for content */}
        <div className="w-full max-w-4xl grid grid-rows-[auto_1fr] bg-white rounded-2xl shadow-md border border-gray-100">
          {/* Fixed Header - auto height */}
          <div className="px-4 sm:px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-serif">Your Credits</h1>
          </div>

          {/* Scrollable container - 1fr to take remaining space */}
          <div className="relative">
            {/* Absolute positioned scrollable content */}
            <div className="absolute inset-0 overflow-y-auto">
              <div className="px-4 sm:px-8 py-6 space-y-10">
                <CreditBalance credits={credits} isLoading={isLoading} />
                <CreditPricing />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 