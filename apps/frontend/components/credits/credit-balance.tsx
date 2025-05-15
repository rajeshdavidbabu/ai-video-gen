"use client";

import { Coins, Clock, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CreditBalanceProps {
  credits?: {
    total: number;
    pending: number;
    available: number;
  };
  isLoading: boolean;
}

export function CreditBalance({ credits, isLoading }: CreditBalanceProps) {
  return (
    <div className="space-y-6">
      <fieldset className="space-y-6">
        <legend className="text-xl font-serif mb-2">Balance</legend>
        
        {/* Total Credits Summary */}
        <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Credits</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{credits?.total || 0}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                <span className={cn(
                  "inline-flex items-center gap-1.5",
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                )}>
                  <Coins className="h-3 w-3" />
                  {credits?.available || 0} Available
                </span>
              </div>
              <div className="mt-1.5">
                <span className={cn(
                  "inline-flex items-center gap-1.5",
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                )}>
                  <Clock className="h-3 w-3" />
                  {credits?.pending || 0} Pending
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Credits */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                <Coins className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Available Credits</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{credits?.available || 0}</p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Credits available for creating new videos
            </p>
          </div>

          {/* Pending Credits */}
          <div className="bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Credits</h3>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{credits?.pending || 0}</p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Credits reserved for videos currently being generated
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <span className="font-medium">How credits work:</span> Each video generation requires 1 credit. 
            Credits are reserved when you start a generation and are consumed when the video is successfully completed.
            If a generation fails, the reserved credits are returned to your balance.
          </p>
        </div>
      </fieldset>
    </div>
  );
} 