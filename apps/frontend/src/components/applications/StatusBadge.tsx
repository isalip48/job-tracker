// components/applications/StatusBadge.tsx
//
// Displays a coloured pill for each application status.
// Used in the table and the detail page.

import { Status } from "@prisma/client";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

// Map each status to a Tailwind colour + human-readable label
const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  WISHLIST:     { label: "Wishlist",     className: "bg-slate-100 text-slate-700 border-slate-200" },
  APPLIED:      { label: "Applied",      className: "bg-blue-100 text-blue-700 border-blue-200" },
  PHONE_SCREEN: { label: "Phone Screen", className: "bg-purple-100 text-purple-700 border-purple-200" },
  INTERVIEW:    { label: "Interview",    className: "bg-amber-100 text-amber-700 border-amber-200" },
  OFFER:        { label: "Offer 🎉",     className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED:     { label: "Rejected",     className: "bg-red-100 text-red-700 border-red-200" },
  GHOSTED:      { label: "Ghosted",      className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// Export for use in tests and other files
export { STATUS_CONFIG };