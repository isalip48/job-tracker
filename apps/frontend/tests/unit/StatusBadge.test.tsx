// tests/unit/StatusBadge.test.tsx
//
// Tests that each Status value renders the correct label.
// This is a good first test to write — it's simple, covers real logic,
// and shows you understand component testing.

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge, STATUS_CONFIG } from "@/components/applications/StatusBadge";
import { Status } from "@prisma/client";

describe("StatusBadge", () => {
  // Dynamically test every Status enum value so the test stays in sync
  // with the enum automatically
  const allStatuses = Object.values(Status);

  it.each(allStatuses)("renders the correct label for status %s", (status) => {
    render(<StatusBadge status={status} />);
    const expectedLabel = STATUS_CONFIG[status].label;
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it("applies the correct colour class for OFFER status", () => {
    const { container } = render(<StatusBadge status="OFFER" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("green");
  });

  it("applies the correct colour class for REJECTED status", () => {
    const { container } = render(<StatusBadge status="REJECTED" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("red");
  });

  it("accepts and applies an extra className", () => {
    const { container } = render(
      <StatusBadge status="APPLIED" className="mt-2" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("mt-2");
  });
});