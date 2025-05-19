"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";

export function PostHogIdentify() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      posthog.identify(session.user.id);
      posthog.people.set({ name: session.user.name });
    }
  }, [session]);
  return null;
}