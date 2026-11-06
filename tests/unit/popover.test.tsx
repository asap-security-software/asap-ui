import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverContent, PopoverTrigger } from "../../src/components/ui/popover";

describe("Popover", () => {
  test("shows its content when opened", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Due Nov 8</PopoverTrigger>
        <PopoverContent>Saturday, Nov 8</PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText("Saturday, Nov 8")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Due Nov 8" }));
    expect(screen.getByText("Saturday, Nov 8")).toBeTruthy();
  });
});
