"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/route-list";
import { toast } from "sonner";
import { useEffect } from "react";
import { IconGoogleLogo } from "@/components/ui/icons";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      let errorMessage = "";

      switch (error) {
        case "OAuthAccountNotLinked":
          errorMessage =
            "Another account is already linked with this email. Please sign in with the other account.";
          break;
        case "NotInvitedError":
          errorMessage =
            "You are not invited. Please contact the administrator for an invitation.";
          break;
        case "EmailNotFound":
          errorMessage =
            "There seems to be a problem with your email. Try with a different email.";
          break;
        default:
          errorMessage = "Unknown error occurred during sign-in";
      }
      console.log("error toast should be called ", error);
      setTimeout(() => toast.error(errorMessage));
    }
  }, [error]);

  const onClick = async (provider: "google" | "github") => {
    await signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-y-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <IconGoogleLogo className="w-8 h-8 pr-2" />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};
