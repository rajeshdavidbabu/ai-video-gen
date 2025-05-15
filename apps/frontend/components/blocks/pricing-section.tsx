"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  description: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: {
    monthly: number;
    yearly: number;
    original?: number; // Original price before discount
  };
  description: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
  id: string; // Add an id to identify each tier
}

interface PricingSectionProps {
  tier: PricingTier;
  className?: string;
  children?: React.ReactNode;
}

function PricingSection({ 
  tier, 
  className, 
  children
}: PricingSectionProps) {
  return (
    <div
      className={cn(
        "relative group backdrop-blur-sm",
        "rounded-2xl transition-all duration-300",
        "flex flex-col",
        tier.highlight
          ? "bg-gradient-to-b from-zinc-100/80 to-transparent dark:from-zinc-400/[0.15]"
          : "bg-white dark:bg-zinc-800/50",
        "border",
        tier.highlight
          ? "border-zinc-400/50 dark:border-zinc-400/20 shadow-xl"
          : "border-zinc-200 dark:border-zinc-700 shadow-md",
        "hover:shadow-lg",
        className
      )}
    >
      {tier.badge && tier.highlight && (
        <div className="absolute -top-3 left-6">
          <Badge className={cn(
            "px-3 py-1 text-sm font-medium",
            "bg-zinc-900 dark:bg-zinc-100",
            "text-white dark:text-zinc-900",
            "border-none shadow-md"
          )}>{tier.badge}</Badge>
        </div>
      )}

      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "p-2.5 rounded-xl",
              tier.highlight
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            )}
          >
            {tier.icon}
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {tier.name}
            </h3>
            <span className="text-[0.6rem] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              BETA PRICING
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2">
            {tier.price.original && (
              <span className="text-lg line-through text-zinc-400 dark:text-zinc-500">
                ${tier.price.original}
              </span>
            )}
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              ${tier.price.monthly}
            </span>
            {tier.price.original && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 self-start mt-2">
                Save 40%
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {tier.description}
          </p>
        </div>

        <div className="space-y-3">
          {tier.features.map((feature) => (
            <div key={feature.name} className="flex gap-3">
              <div
                className={cn(
                  "mt-1 p-0.5 rounded-full transition-colors duration-200",
                  feature.included
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-400 dark:text-zinc-600"
                )}
              >
                <CheckIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {feature.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        {children}
      </div>
    </div>
  );
}

export { PricingSection };
