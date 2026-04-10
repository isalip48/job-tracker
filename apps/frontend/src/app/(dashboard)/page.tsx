// app/(dashboard)/page.tsx  →  /dashboard
//
// Server Component: fetches stats on the server (no loading spinner).
// The stats API uses Redis caching so this is fast.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cached } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Status } from "@prisma/client";
import type { DashboardStats } from "@/app/api/stats/route";

async function getStats(userId: string): Promise<DashboardStats> {
  return cached(`stats:${userId}`, 300, async () => {
    const grouped = await prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    });

    const byStatus = Object.values(Status).reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<Status, number>
    );

    let total = 0;
    for (const row of grouped) {
      byStatus[row.status] = row._count.status;
      total += row._count.status;
    }

    const interviewed = byStatus.INTERVIEW + byStatus.OFFER + byStatus.REJECTED;
    return {
      total,
      byStatus,
      interviewRate: total > 0 ? (interviewed / total) * 100 : 0,
      offerRate: total > 0 ? (byStatus.OFFER / total) * 100 : 0,
    };
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getStats(session!.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, {session!.user.name?.split(" ")[0]}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Applied"
          value={stats.total}
          subtitle="all time"
        />
        <StatsCard
          title="Interviews"
          value={stats.byStatus.INTERVIEW}
          subtitle={`${stats.interviewRate.toFixed(0)}% interview rate`}
        />
        <StatsCard
          title="Offers"
          value={stats.byStatus.OFFER}
          subtitle={`${stats.offerRate.toFixed(1)}% offer rate`}
        />
        <StatsCard
          title="Active"
          value={
            stats.byStatus.APPLIED +
            stats.byStatus.PHONE_SCREEN +
            stats.byStatus.INTERVIEW
          }
          subtitle="in progress"
        />
      </div>

      {/* Status breakdown */}
      <div>
        <h2 className="mb-3 font-semibold">By Status</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {(Object.entries(stats.byStatus) as [Status, number][]).map(
            ([status, count]) => (
              <div
                key={status}
                className="rounded-lg border bg-card p-3 text-center"
              >
                <p className="text-2xl font-bold">{count}</p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">
                  {status.replace("_", " ").toLowerCase()}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}