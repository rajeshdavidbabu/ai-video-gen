import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  protectedRoutes,
} from "@/route-list";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );

  // 1) If it's an API auth route, continue with the next steps in the app
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2) If it's an auth route and the user is logged in, redirect to DEFAULT_LOGIN_REDIRECT
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // 3) If it's a protected route and the user is not logged in, redirect to login with callback URL
  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // 4) If it's not a public route and not a protected route and the user is not logged in, redirect to login
  if (!isPublicRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
});

/**
 * '/((?!.+\.[\w]+$|_next).*)':
 * It will not match any route that ends with a file extension or contains _next.
 * '/':
 * This will match the root route of your application.
 * '/(api|trpc)(.*)':
 * This will match any route that starts with api or trpc, followed by any characters.
 */
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
