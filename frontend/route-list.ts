/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/privacy",
  "/api/webhook/polar",
  "/auto-logout",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /chat
 * @type {string[]}
 */
export const authRoutes = ["/auth/login"];

/**
 * The prefix for API authentication routes used by Next-Auth
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/discover";

/**
 * Protected routes that require authentication
 * @type {string[]}
 */
export const protectedRoutes = [
  "/discover",
  "/generations",
  "/create",
  "/connect",
  "/credits",
];
