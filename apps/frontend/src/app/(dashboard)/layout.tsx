// app/(dashboard)/layout.tsx
//
// Shared layout for all dashboard pages — sidebar + top bar.
// Server Component: fetches the session and redirects if not logged in.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SidebarNav } from "@/app/(dashboard)/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <SidebarNav user={session.user} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}