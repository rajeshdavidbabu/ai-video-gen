"use client";

import Link from "next/link";
import {
  Video,
  Home,
  BookOpen,
  Share2,
  MousePointerClick,
  Sparkles,
  Coins,
  Receipt,
  LifeBuoy,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/app/auth/components/user-button";
import Image from "next/image";
import { useCredits } from "@/hooks/use-credits";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ParticleButton } from "./ui/particle-button";
import { LogoWithLink } from "./landing/logo-with-link";
import { toast } from "sonner";

// Menu items.
const items = [
  {
    title: "Discover",
    url: "/discover",
    icon: Home,
  },
  {
    title: "Generations",
    url: "/generations",
    icon: Video,
  },
  {
    title: "Connect Social",
    url: "/connect",
    icon: Share2,
    hidden: true, // Hide this menu item for now
  },
  {
    title: "Credits",
    url: "/credits",
    icon: Coins,
    showCount: true,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: Receipt,
  },
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const credits = useCredits();

  // Custom hook to access sidebar context
  const sidebarContext = useSidebar();
  
  // Handler to close mobile sidebar
  const handleCreateVideoClick = () => {
    if (sidebarContext.isMobile) {
      sidebarContext.setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Create Video Button */}

        {/* Logo and Title */}
        <LogoWithLink />

        <SidebarHeader>
          <Link href="/create" className="w-full" onClick={handleCreateVideoClick}>
            <ParticleButton
              successDuration={1000}
              variant="default"
              className="w-full text-md font-semibold font-sans group"
            >
              Create Video
              <Sparkles className="h-4 w-4" />
            </ParticleButton>
          </Link>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4 text-primary" />
                        <span className="font-sans font-semibold flex items-center justify-between w-full">
                          {item.title}
                          {item.showCount && !credits.isLoading && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              {credits?.data?.available || 0}
                            </span>
                          )}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
