import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../../src/components/ui/checkbox";

describe("Checkbox", () => {
  test("reports checked when clicked", async () => {
    const user = userEvent.setup();
    const calls: Array<boolean | "indeterminate"> = [];
    render(
      <Checkbox
        aria-label="Include parts"
        onCheckedChange={(value) => {
          calls.push(value);
        }}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Include parts" }));
    expect(calls).toEqual([true]);
  });

  test("exposes the mixed state", () => {
    render(<Checkbox aria-label="Some rows" checked="indeterminate" />);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("mixed");
  });

  test("does not change while disabled", () => {
    render(<Checkbox aria-label="Include parts" disabled />);
    expect(screen.getByRole("checkbox")).toHaveProperty("disabled", true);
  });

  test("touch size is the 52px target", () => {
    render(<Checkbox aria-label="Include parts" size="touch" />);
    expect(screen.getByRole("checkbox").className).toContain("size-touch");
  });
});
