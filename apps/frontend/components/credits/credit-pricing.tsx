"use client";

import { PricingSection } from "@/components/blocks/pricing-section";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { betaPricingTiers } from "@/components/landing/pricing";

// StripeButton component for the credits page
export function StripeButton({ tierId, highlight }: { tierId: string, highlight?: boolean }) {
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

  // Polar.sh checkout links production
  const polarLinks = {
    'starter-pack': 'https://buy.polar.sh/polar_cl_X63iLXA2Lu7cCRxAumMjnRqfKl1rT1XNQD9HY0GrEUH',
    'value-pack': 'https://buy.polar.sh/polar_cl_1VdAO6BLxsn21dALigElzx5tl7QZL1YOJFzZv2vgxCf'
  };

  // Polar.sh checkout links sandbox
  // const polarLinks = {
  //   'value-pack': 'https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_VBOHHlJDD2WODCi9LQeSUpA4dlviES1HTyYF91Pz9vq/redirect',
  //   'starter-pack': 'https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_Y08L331UzbVkZmSjSamYwoOjIEZCjDF3rvNC60f7Vwg/redirect'
  // };

  return (
    <Button
      className={highlight ? buttonStyles.highlight : buttonStyles.default}
      onClick={() => {
        // Redirect to Polar.sh checkout
        window.location.href = polarLinks[tierId as keyof typeof polarLinks];
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        Buy credits
        <ArrowRightIcon className="w-4 h-4" />
      </span>
    </Button>
  );
}

export function CreditPricing() {
  return (
    <div className="space-y-6">
      <fieldset className="space-y-6">
        <legend className="text-xl font-serif mb-4">Buy More Credits</legend>
        
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
            <PricingSection
              tier={betaPricingTiers[0]}
              className="h-full"
            >
              <StripeButton 
                tierId={betaPricingTiers[0].id} 
                highlight={betaPricingTiers[0].highlight} 
              />
            </PricingSection>
            
            <PricingSection
              tier={betaPricingTiers[1]}
              className="h-full"
            >
              <StripeButton 
                tierId={betaPricingTiers[1].id} 
                highlight={betaPricingTiers[1].highlight} 
              />
            </PricingSection>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-600 dark:text-zinc-300">
            <span className="font-medium">Note:</span> After purchasing, credits will be immediately added to your account.
            Credits never expire and can be used at any time.
          </p>
        </div>
      </fieldset>
    </div>
  );
} 