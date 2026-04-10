// app/(dashboard)/applications/ApplicationsClient.tsx
//
// This is the "bridge" pattern in Next.js:
//   Server Component (page.tsx) fetches data → passes to Client Component
//   Client Component seeds Zustand → interactive components read from store
//
// Why not fetch in the Client Component with useEffect?
// Server-side fetching is faster (no waterfall), more SEO-friendly,
// and avoids loading spinners on first paint.

"use client";

import { useEffect } from "react";
import { useApplicationStore, ApplicationWithReminders } from "@/store/useApplicationStore";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

interface ApplicationsClientProps {
  initialApplications: ApplicationWithReminders[];
}

export function ApplicationsClient({ initialApplications }: ApplicationsClientProps) {
  const setApplications = useApplicationStore((s) => s.setApplications);

  // Seed the store once when the page loads
  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications, setApplications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-muted-foreground">
          Manage and track all your job applications
        </p>
      </div>

      {/* ErrorBoundary wraps the table so a render error won't crash the page */}
      <ErrorBoundary>
        <ApplicationTable />
      </ErrorBoundary>

      {/* Modal form — rendered here so it's always in the tree */}
      <ApplicationForm />
    </div>
  );
}