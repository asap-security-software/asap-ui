import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Separator } from "../../src/components/ui/separator";

describe("Separator", () => {
  test("is hidden from assistive tech by default", () => {
    render(<Separator />);
    expect(screen.queryByRole("separator")).toBeNull();
  });

  test("exposes orientation when it is meaningful", () => {
    const { rerender } = render(<Separator decorative={false} />);
    expect(screen.getByRole("separator").getAttribute("aria-orientation") ?? "horizontal").toBe(
      "horizontal",
    );
    rerender(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });
});
