// lib/utils.ts
// Required by Shadcn components. Merges Tailwind class names safely.

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}