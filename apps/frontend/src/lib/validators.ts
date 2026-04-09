// lib/validators.ts
//
// Zod schemas are the single source of truth for API input shapes.
// They run at runtime (catching bad requests) AND generate TypeScript
// types (catching mistakes at compile time). Two birds, one stone.

import { z } from "zod";
import { Status } from "@prisma/client";

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  status: z.nativeEnum(Status).default("APPLIED"),
  appliedDate: z.string().datetime({ message: "Invalid date format" }),
  salary: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(5000).optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

// Infer TypeScript types directly from the schemas — no duplication
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;