// app/api/applications/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invalidate } from "@/lib/redis";
import { updateApplicationSchema } from "@/lib/validators";

// Helper: fetch and verify that the application belongs to the current user.
// This prevents one user from reading/editing/deleting another user's data.
async function getOwnedApplication(id: string, userId: string) {
  return prisma.application.findFirst({
    where: { id, userId },
  });
}

// ── GET /api/applications/:id ────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.application.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { contacts: true, reminders: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}

// ── PUT /api/applications/:id ────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getOwnedApplication(params.id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      ...(parsed.data.appliedDate
        ? { appliedDate: new Date(parsed.data.appliedDate) }
        : {}),
    },
  });

  await invalidate(`stats:${session.user.id}`);

  return NextResponse.json(updated);
}

// ── DELETE /api/applications/:id ─────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getOwnedApplication(params.id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id: params.id } });
  await invalidate(`stats:${session.user.id}`);

  return new NextResponse(null, { status: 204 });
}