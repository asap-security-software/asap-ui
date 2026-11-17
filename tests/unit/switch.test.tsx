import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../../src/components/ui/switch";

describe("Switch", () => {
  test("reports checked when clicked", async () => {
    const user = userEvent.setup();
    const calls: Array<boolean> = [];
    render(
      <Switch
        aria-label="Notify the office"
        onCheckedChange={(value) => {
          calls.push(value);
        }}
      />,
    );
    await user.click(screen.getByRole("switch", { name: "Notify the office" }));
    expect(calls).toEqual([true]);
  });

  test("Space turns it on then off, reporting each change and the exposed checked state", async () => {
    const user = userEvent.setup();
    const calls: Array<boolean> = [];
    render(
      <Switch
        aria-label="Notify the office"
        onCheckedChange={(value) => {
          calls.push(value);
        }}
      />,
    );
    const toggle = screen.getByRole("switch", { name: "Notify the office" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(toggle.getAttribute("data-state")).toBe("unchecked");

    await user.tab();
    expect(document.activeElement).toBe(toggle);

    await user.keyboard(" ");
    expect(calls).toEqual([true]);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(toggle.getAttribute("data-state")).toBe("checked");
    expect(document.activeElement).toBe(toggle);

    await user.keyboard(" ");
    expect(calls).toEqual([true, false]);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(toggle.getAttribute("data-state")).toBe("unchecked");
    expect(document.activeElement).toBe(toggle);
  });

  test("does not change while disabled", () => {
    render(<Switch aria-label="Notify the office" disabled />);
    expect(screen.getByRole("switch")).toHaveProperty("disabled", true);
  });

  test("default size uses the h-6 and w-11 classes and not size-touch", () => {
    render(<Switch aria-label="Notify the office" />);
    const tokens = screen.getByRole("switch").className.split(/\s+/);
    expect(tokens).toContain("h-6");
    expect(tokens).toContain("w-11");
    expect(tokens).not.toContain("size-touch");
  });

  test("touch size is the 52px target", () => {
    render(<Switch aria-label="Notify the office" size="touch" />);
    expect(screen.getByRole("switch").className).toContain("size-touch");
  });
});
