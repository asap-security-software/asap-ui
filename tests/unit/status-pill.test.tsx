import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { StatusPill } from "../../src/components/ui/status-pill";

describe("StatusPill", () => {
  test("renders a tinted pill and a status dot", () => {
    render(<StatusPill status="done">Done</StatusPill>);
    const pill = screen.getByText("Done");
    expect(pill.getAttribute("data-slot")).toBe("status-pill");
    expect(pill.className).toContain("bg-success-soft");
    expect(pill.className).toContain("text-success-foreground");
    const dot = pill.querySelector("[data-slot=badge-dot]");
    expect(dot).toBeTruthy();
    expect(dot?.className).toContain("bg-success");
  });

  test("uses the scheduled tone when no status is set", () => {
    render(<StatusPill>Scheduled</StatusPill>);
    expect(screen.getByText("Scheduled").className).toContain("bg-scheduled-soft");
  });
});
