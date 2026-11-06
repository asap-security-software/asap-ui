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

  test("does not change while disabled", () => {
    render(<Switch aria-label="Notify the office" disabled />);
    expect(screen.getByRole("switch")).toHaveProperty("disabled", true);
  });

  test("touch size is the 52px target", () => {
    render(<Switch aria-label="Notify the office" size="touch" />);
    expect(screen.getByRole("switch").className).toContain("size-touch");
  });
});
