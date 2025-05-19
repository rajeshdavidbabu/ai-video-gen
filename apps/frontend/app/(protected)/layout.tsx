import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PostHogIdentify } from "@/app/posthog/identify";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user.id;

  if (!session || !userId || session.error?.name === "UserNotFoundError") {
    // When user is not found you force logout
    return redirect("/auto-logout");
  }

  return (
    <SessionProvider session={session}>
      <PostHogIdentify />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-screen flex flex-col overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="p-1">
            <SidebarTrigger />
          </div>
      {children}
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
