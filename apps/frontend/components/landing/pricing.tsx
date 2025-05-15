"use client";

import {
  Sparkles,
  Zap,
} from "lucide-react";
import { PricingSection } from "@/components/blocks/pricing-section";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Define the pricing tiers
export const betaPricingTiers = [
  {
    id: "starter-pack",
    name: "Starter Pack",
    price: {
      monthly: 5,
      yearly: 5,
      original: 8, // 40% off beta pricing
    },
    description: "2 credits to create AI-powered short videos",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30 blur-2xl rounded-full" />
        <Zap className="w-7 h-7 relative z-10 text-primary/70 animate-[float_3s_ease-in-out_infinite]" />
      </div>
    ),
    features: [
      {
        name: "2 Video Credits",
        description: "Each credit creates one 60fps video in 9:16 format",
        included: true,
      },
      {
        name: "High-Quality AI Generation",
        description: "Midjourney for images, Elevenlabs for audio & captions",
        included: true,
      },
      {
        name: "Perfect for Social",
        description: "Optimized for YouTube Shorts, TikTok, and Reels",
        included: true,
      },
      {
        name: "Private Discord Support",
        description: "Access to exclusive Discord channel",
        included: true,
      },
      {
        name: "Never Expires",
        description: "Credits remain valid until used",
        included: true,
      },
    ],
  },
  {
    id: "value-pack",
    name: "Value Pack",
    price: {
      monthly: 10,
      yearly: 10,
      original: 17, // 40% off beta pricing
    },
    description: "5 credits to create AI-powered short videos",
    highlight: true,
    badge: "Best Value",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/30 blur-2xl rounded-full" />
        <Sparkles className="w-7 h-7 relative z-10 animate-[float_3s_ease-in-out_infinite]" />
      </div>
    ),
    features: [
      {
        name: "5 Video Credits",
        description: "Each credit creates one 60fps video in 9:16 format",
        included: true,
      },
      {
        name: "High-Quality AI Generation",
        description: "Midjourney for images, Elevenlabs for audio & captions",
        included: true,
      },
      {
        name: "Perfect for Social",
        description: "Optimized for YouTube Shorts, TikTok, and Reels",
        included: true,
      },
      {
        name: "Private Discord Support",
        description: "Access to exclusive Discord channel",
        included: true,
      },
      {
        name: "Never Expires",
        description: "Credits remain valid until used",
        included: true,
      },
    ],
  },
];

interface PricingProps {
  showHeader?: boolean;
}

// PricingButton component for landing page
export function PricingButton({ tierId, highlight }: { tierId: string, highlight?: boolean }) {
  const router = useRouter();
  
  const buttonStyles = {
    default: cn(
      "h-12 bg-white dark:bg-zinc-900",
      "hover:bg-zinc-50 dark:hover:bg-zinc-800",
      "text-zinc-900 dark:text-zinc-100",
      "border border-zinc-200 dark:border-zinc-800",
      "hover:border-zinc-300 dark:hover:border-zinc-700",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium",
      "w-full relative transition-all duration-300"
    ),
    highlight: cn(
      "h-12 bg-zinc-900 dark:bg-zinc-100",
      "hover:bg-zinc-800 dark:hover:bg-zinc-300",
      "text-white dark:text-zinc-900",
      "shadow-[0_1px_15px_rgba(0,0,0,0.1)]",
      "hover:shadow-[0_1px_20px_rgba(0,0,0,0.15)]",
      "font-semibold text-base",
      "w-full relative transition-all duration-300"
    ),
  };

  return (
    <Button
      className={highlight ? buttonStyles.highlight : buttonStyles.default}
      onClick={() => {
        router.push("/create");
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        Get started
        <ArrowRightIcon className="w-4 h-4" />
      </span>
    </Button>
  );
}

export function Pricing({ showHeader = true }: PricingProps) {
  const [paymentModel, setPaymentModel] = useState<"payg" | "subscription">("payg");

  return (
    <div className="relative py-10 px-4 md:py-16 lg:py-24 bg-background text-foreground">
      <div className="w-full max-w-5xl mx-auto">
        {showHeader && (
          <div className="flex flex-col items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 font-serif">
              Simple, transparent pricing
            </h2>

            <div className="flex flex-col items-center gap-2">
              <div className="relative inline-flex items-center p-1.5 bg-white/50 dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <button
                  onClick={() => setPaymentModel("payg")}
                  className={cn(
                    "px-8 py-2.5 text-sm font-medium rounded-full transition-all",
                    paymentModel === "payg"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  Pay as you go
                </button>
                <div className="px-8 py-2.5">
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">
                    Subscription
                  </span>
                </div>
              </div>

              {/* Subscription Coming Soon Banner */}
              <div className="inline-block px-4 py-2 rounded-full bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Monthly subscriptions coming soon! 🚀
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingSection
            tier={betaPricingTiers[0]}
            className="h-full"
          >
            <PricingButton 
              tierId={betaPricingTiers[0].id} 
              highlight={betaPricingTiers[0].highlight} 
            />
          </PricingSection>
          
          <PricingSection
            tier={betaPricingTiers[1]}
            className="h-full"
          >
            <PricingButton 
              tierId={betaPricingTiers[1].id} 
              highlight={betaPricingTiers[1].highlight} 
            />
          </PricingSection>
        </div>
      </div>
    </div>
  );
}
