// app/api/stats/route.ts
//
// This route computes dashboard stats (total applied, by status, etc.)
// and caches the result in Redis for 5 minutes.
// On any application write, the cache is invalidated (see applications routes).

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";
import { Status } from "@prisma/client";

export type DashboardStats = {
  total: number;
  byStatus: Record<Status, number>;
  interviewRate: number; // % of applications that reached interview stage
  offerRate: number;     // % of applications that got an offer
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // cached() checks Redis first; if miss, runs the fetcher and stores result
  const stats = await cached<DashboardStats>(
    `stats:${userId}`,
    300, // TTL: 5 minutes
    async () => {
      // Single DB query — group by status
      const grouped = await prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      });

      // Build a map of status → count (default 0 for missing statuses)
      const byStatus = Object.values(Status).reduce(
        (acc, s) => ({ ...acc, [s]: 0 }),
        {} as Record<Status, number>
      );

      let total = 0;
      for (const row of grouped) {
        byStatus[row.status] = row._count.status;
        total += row._count.status;
      }

      const interviewed =
        byStatus.INTERVIEW + byStatus.OFFER + byStatus.REJECTED;
      const interviewRate = total > 0 ? (interviewed / total) * 100 : 0;
      const offerRate = total > 0 ? (byStatus.OFFER / total) * 100 : 0;

      return { total, byStatus, interviewRate, offerRate };
    }
  );

  return NextResponse.json(stats);
}