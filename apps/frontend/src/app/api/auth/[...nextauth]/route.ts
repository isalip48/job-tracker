// app/api/auth/[...nextauth]/route.ts
//
// This is the catch-all route that NextAuth uses for all its
// endpoints: /api/auth/signin, /api/auth/callback/github, etc.
// We just wire it up here and keep all config in lib/auth.ts.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };