// app/(dashboard)/applications/page.tsx
//
// Fetches applications on the server, seeds Zustand store via a
// Client Component, then renders the interactive table.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationsClient } from "@/app/(dashboard)/applications/ApplicationsClient";

async function getApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: { reminders: { where: { done: false } } },
    orderBy: { appliedDate: "desc" },
  });
}

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);
  const applications = await getApplications(session!.user.id);

  // Serialize: pass plain objects to the Client Component
  return <ApplicationsClient initialApplications={JSON.parse(JSON.stringify(applications))} />;
}