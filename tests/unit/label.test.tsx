import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Checkbox } from "../../src/components/ui/checkbox";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";

function Field() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <Checkbox
        id="parts"
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value === true);
        }}
      />
      <Label htmlFor="parts">Include parts</Label>
    </>
  );
}

describe("Label", () => {
  test("toggles the labeled checkbox", async () => {
    const user = userEvent.setup();
    render(<Field />);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("false");
    await user.click(screen.getByText("Include parts"));
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("true");
  });

  test("focuses the matching Input when its text is clicked", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" />
        <Input id="other" aria-label="Other" />
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(document.activeElement).toBe(document.body);
    await user.click(screen.getByText("Email address"));
    expect(document.activeElement).toBe(input);
  });
});
