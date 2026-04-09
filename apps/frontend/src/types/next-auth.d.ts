// types/next-auth.d.ts
//
// TypeScript doesn't know about the custom `id` field we add
// to the session in authOptions.callbacks.session.
// This declaration merges our additions into NextAuth's types.

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}