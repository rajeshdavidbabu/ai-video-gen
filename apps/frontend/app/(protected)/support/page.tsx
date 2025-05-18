"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Support() {
  return (
    <div className="min-h-screen p-4 sm:p-8 overflow-auto">
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold font-serif">Talk to us on Discord</h1>
          </div>
          <p className="text-muted-foreground font-sans">
            Join our Discord server to get in touch with us.
          </p>
          <Link href="https://discord.com/channels/1121796870231040020/1373769111531950301" target="_blank">
            <Button className="mt-4">Join Discord</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
