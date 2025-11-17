import { randomUUID } from "crypto";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "~/env";
import { db } from "~/server/db";

// Helper to ensure URL doesn't have trailing slash
const getBaseURL = () => {
  const url =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  return url.replace(/\/$/, ""); // Remove trailing slash
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  basePath: "/api/auth",
  secret:
    env.BETTER_AUTH_SECRET ??
    "development-secret-change-in-production-min-32-chars",
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.VERCEL_URL
      ? [`https://${process.env.VERCEL_URL}`.replace(/\/$/, "")]
      : []),
    ...(process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")]
      : []),
  ],
  advanced: {
    cookiePrefix: "better-auth",
    generateId: () => randomUUID(),
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: `${getBaseURL()}/api/auth/callback/github`,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
