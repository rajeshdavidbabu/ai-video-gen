import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { getUserById } from "./db/api/user";
import type { Role } from "@prisma/client";
import {
  deleteAccountTokens,
  getAccountByProvider,
  updateAccountTokens,
  getAccountByUser,
  refreshAccessToken,
} from "./db/api/account";
import { prisma } from "@/db/prisma";

export const { handlers, auth, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  events: {
    async signOut(message) {
      try {
        if ("token" in message) {
          const token = message.token;
          if (token?.userId) {
            await deleteAccountTokens(token.userId.toString());
          }
        }
      } catch (error) {
        console.error("Error occurred at signOut event", error);
      }
      // Clean the stale tokens from the account table
    },
    async createUser(message) {
      try {
        const { user } = message;

        if (!user.id) {
          throw new Error("User id is required");
        }

        // Do something here when user is created
      } catch (error) {
        console.error("Error occurred at createUser event", error);
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    async signIn({ user, account }) {
      // Check if user is allowed to sign-in
      const email = user?.email;

      if (!email) {
        return "/auth/login?error=EmailNotFound";
      }

      try {
        if (account && user) {
          // If user signs in for very first time then account should be null
          const providerAccount = await getAccountByProvider(
            account.provider,
            account.providerAccountId
          );

          // If provider account exists already then update the tokens with the new ones
          // As Next-Auth is not doing it properly
          // issue: https://github.com/nextauthjs/next-auth/issues/3599
          if (providerAccount) {
            await updateAccountTokens(account);
          }
        }

        return true;
      } catch (error) {
        console.error("Error occurred at sign-in event", error);
        return false;
      }
    },
    async jwt({ token }) {
      // token is not available at initial sign-in
      // only account and user are available
      if (!token.sub) {
        return token;
      }

      const googleAccount = await getAccountByUser(token.sub);
      const expiresAt = googleAccount?.expires_at;
      const refreshToken = googleAccount?.refresh_token;

      // Refresh access token if expired;
      if (expiresAt && expiresAt * 1000 < Date.now() && refreshToken) {
        try {
          await refreshAccessToken(refreshToken, token.sub);
        } catch (error) {
          if (error instanceof RefreshTokenError) {
            token.error = error;
          }
        }
      }

      console.log("user coming in ", token.sub);

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        token.error = new UserNotFoundError(
          `${token.sub} user-id is not found`
        );

        return token;
      }

      const { role, name, email } = existingUser;

      token.name = name;
      token.email = email;
      token.role = role;

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        const { role, name, email, sub, error } = token;

        if (!sub || !email) {
          // Log user out using this error
          const error = new UserNotFoundError(
            "No email or sub found in token, this should not happen"
          );

          session.error = error;

          return session;
        }

        session.user = {
          ...session.user,
          id: sub,
          role: role as Role,
          name,
          email,
        };

        // For now only tracking refresh token errors
        // As we do not expect any other errors
        // User should be logged out on this error
        if (
          error instanceof RefreshTokenError ||
          error instanceof UserNotFoundError
        ) {
          session.error = error;
        }
      }

      return session;
    },
  },
  ...authConfig,
});

export class RefreshTokenError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "RefreshTokenError";
  }
}

class UserNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

declare module "next-auth" {
  interface Session {
    error?: RefreshTokenError | UserNotFoundError;
  }
}
