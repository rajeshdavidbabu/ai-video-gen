"use client";

import { signOut } from "next-auth/react";
import { Button } from "../../../components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = async () => {
    await signOut();
  };

  return (
    <span className="w-full" onClick={onClick}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </span>
  );
};
