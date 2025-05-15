import { prisma } from "@/db/prisma";
import type { Account as NextAuthAccount } from "next-auth";
import { env } from "@/lib/env.server";
import { RefreshTokenError } from "@/auth";


export const deleteAccountTokens = async (userId: string) => {
  try {
    await prisma.account.updateMany({
      where: { userId },
      data: {
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
      },
    });
    console.log("Deleted tokens for user ", userId);
  } catch (error) {
    console.error("Error occurred at deleteTokens ", error);
    throw error;
  }
};

export const updateAccountTokens = async (account: NextAuthAccount) => {
  try {
    const { provider, providerAccountId } = account;
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      data: {
        refresh_token: account.refresh_token ?? null,
        access_token: account.access_token ?? null,
        expires_at: account.expires_at ?? null,
        token_type: account.token_type ?? null,
        scope: account.scope ?? null,
        id_token: account.id_token ?? null,
        session_state: String(account.session_state) ?? null, // might not needs this
      },
    });
  } catch (error) {
    console.error("Error occurred at updateAccountTokens ", error);
    throw error;
  }
};

export const getAccountByProvider = async (
  provider: string,
  providerAccountId: string
) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
    return account;
  } catch (error) {
    console.error("Error occurred at getAccountByProvider ", error);
    throw error;
  }
};

export const getAccountByUser = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "google",
      },
    });
    return account;
  } catch (error) {
    console.error("Error occurred at getAccountByUserAndProvider ", error);
    throw error;
  }
};

export const refreshAccessToken = async (
  refreshToken: string,
  userId: string
) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.AUTH_GOOGLE_ID,
        client_secret: env.AUTH_GOOGLE_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      method: "POST",
    });

    const tokens = await response.json();

    if (!response.ok) throw tokens;

    const {
      access_token,
      expires_in = 3599,
      token_type,
      scope,
      id_token,
      refresh_token,
    } = tokens;

    await prisma.account.updateMany({
      where: {
        userId,
        provider: "google",
      },
      data: {
        refresh_token: refresh_token ?? refreshToken,
        access_token,
        expires_at: Math.floor(Date.now() / 1000 + expires_in),
        token_type,
        scope,
        id_token,
      },
    });
  } catch (error) {
    const errorObject = error as { error: string; error_description: string };

    if (errorObject?.error === "unauthorized_client") {
      throw new RefreshTokenError(
        `Failed to refresh access token: ${errorObject.error_description}`
      );
    }
  }
};
