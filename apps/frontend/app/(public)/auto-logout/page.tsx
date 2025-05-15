"use client";

import { DancingLoader } from "@/components/ui/dancing-loader";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function AutoLogout() {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  }, []);

  return (
    <MaxWidthWrapper className="flex-1 flex items-center justify-center w-full h-screen">
      <DancingLoader size="lg" />
    </MaxWidthWrapper>
  );
}
