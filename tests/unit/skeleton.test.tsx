import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Skeleton } from "../../src/components/ui/skeleton";

describe("Skeleton", () => {
  test("is hidden from assistive tech while content loads", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const node = container.querySelector("[data-slot=skeleton]");
    expect(node?.getAttribute("aria-hidden")).toBe("true");
    expect(node?.className).toContain("animate-pulse");
  });
});
