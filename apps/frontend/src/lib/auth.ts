// lib/auth.ts
//
// NextAuth config lives here (not inside the route file) so you can
// import `authOptions` in Server Components and API routes alike.

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // PrismaAdapter stores sessions + accounts in your Postgres DB
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database", // stores session in Postgres (not JWT)
  },

  pages: {
    signIn: "/login", // redirect to our custom login page
  },

  callbacks: {
    // Add userId to the session so we can use it in API routes
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};