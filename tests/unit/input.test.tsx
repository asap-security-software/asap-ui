import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { Input } from "../../src/components/ui/input";

describe("Input", () => {
  test("keeps the requested type and does not leak the visual size onto the DOM", () => {
    const { container } = render(
      <Input type="email" size="touch" aria-invalid placeholder="Email" aria-label="Email" />,
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("type")).toBe("email");
    expect(input?.className).toContain("min-h-touch");
    expect(input?.hasAttribute("size")).toBe(false);
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("placeholder")).toBe("Email");
  });

  test("can be disabled", () => {
    const { container } = render(<Input disabled aria-label="Job" />);
    expect(container.querySelector("input")?.disabled).toBe(true);
  });
});
