// app/(auth)/login/page.tsx
//
// Simple login page. The (auth) folder group means this route is
// /login — the parentheses are just for organisation, not in the URL.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginButtons } from "@/app/(auth)/login/LoginButtons";

export default async function LoginPage() {
  // If already logged in, go straight to the dashboard
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Job Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to track your applications
          </p>
        </div>
        <LoginButtons />
      </div>
    </main>
  );
}