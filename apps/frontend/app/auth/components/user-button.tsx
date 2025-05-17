"use client";

import { signOut, useSession } from "next-auth/react";
import { ChevronsUpDown, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/app/auth/components/logout-button";

export const UserButton = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          <Avatar className="h-9 w-9">
            {user.image ? (
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={user.image}
                  alt={user.name || "User profile"}
                  fill
                  sizes="36px"
                  className="object-cover"
                  unoptimized={false}
                />
              </div>
            ) : (
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
