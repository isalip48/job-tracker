// lib/prisma.ts
//
// Why a singleton?
// Next.js hot-reloads modules in dev mode. Without this pattern,
// you'd create a new DB connection pool on every file save — quickly
// exhausting Postgres's connection limit.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"] // logs SQL in dev
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}