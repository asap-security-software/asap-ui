import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Badge } from "../../src/components/ui/badge";

const tones = [
  { status: "done", pill: ["bg-success-soft", "text-success-foreground"], dot: "bg-success" },
  { status: "progress", pill: ["bg-primary-soft", "text-primary-ink"], dot: "bg-primary" },
  {
    status: "scheduled",
    pill: ["bg-scheduled-soft", "text-scheduled-foreground"],
    dot: "bg-scheduled",
  },
  { status: "warning", pill: ["bg-warning-soft", "text-warning-foreground"], dot: "bg-warning" },
  { status: "danger", pill: ["bg-danger-soft", "text-danger-foreground"], dot: "bg-danger" },
] as const;

const tokens = (el: Element | null | undefined): string[] =>
  (el?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);

describe("Badge", () => {
  test("renders with data-slot badge", () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText("Label").getAttribute("data-slot")).toBe("badge");
  });

  test("defaults to the scheduled tone with a scheduled dot", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    const classes = tokens(badge);
    expect(classes).toContain("bg-scheduled-soft");
    expect(classes).toContain("text-scheduled-foreground");
    const dot = badge.querySelector("[data-slot=badge-dot]");
    expect(dot).not.toBeNull();
    expect(tokens(dot)).toContain("bg-scheduled");
  });

  test("dot={false} renders no dot", () => {
    render(<Badge dot={false}>No dot</Badge>);
    expect(screen.getByText("No dot").querySelector("[data-slot=badge-dot]")).toBeNull();
  });

  for (const { status, pill, dot } of tones) {
    test(`renders the ${status} tone with its pill and dot classes`, () => {
      render(<Badge status={status}>{status}</Badge>);
      const badge = screen.getByText(status);
      expect(badge.getAttribute("data-slot")).toBe("badge");
      const classes = tokens(badge);
      for (const token of pill) {
        expect(classes).toContain(token);
      }
      const dotEl = badge.querySelector("[data-slot=badge-dot]");
      expect(dotEl).not.toBeNull();
      expect(tokens(dotEl)).toContain(dot);
    });
  }

  test("each tone excludes the other tones' pill and dot classes", () => {
    for (const { status } of tones) {
      const { unmount } = render(<Badge status={status}>{`only-${status}`}</Badge>);
      const badge = screen.getByText(`only-${status}`);
      const classes = tokens(badge);
      const dotClasses = tokens(badge.querySelector("[data-slot=badge-dot]"));
      for (const other of tones) {
        if (other.status === status) continue;
        for (const token of other.pill) {
          expect(classes).not.toContain(token);
        }
        expect(dotClasses).not.toContain(other.dot);
      }
      unmount();
    }
  });

  test("sm size sets exact size classes and is the default", () => {
    render(
      <>
        <Badge size="sm">Small</Badge>
        <Badge>Implicit</Badge>
      </>,
    );
    for (const label of ["Small", "Implicit"]) {
      const classes = tokens(screen.getByText(label));
      expect(classes).toContain("h-6");
      expect(classes).toContain("px-2.5");
      expect(classes).toContain("text-asap-xs");
      expect(classes).not.toContain("h-7");
      expect(classes).not.toContain("text-asap-sm");
    }
  });

  test("md size sets exact size classes", () => {
    render(<Badge size="md">Medium</Badge>);
    const classes = tokens(screen.getByText("Medium"));
    expect(classes).toContain("h-7");
    expect(classes).toContain("px-2.5");
    expect(classes).toContain("text-asap-sm");
    expect(classes).not.toContain("h-6");
    expect(classes).not.toContain("text-asap-xs");
  });
});
