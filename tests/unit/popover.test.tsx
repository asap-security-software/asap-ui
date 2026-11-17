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

  test("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Due Nov 8</PopoverTrigger>
        <PopoverContent>Saturday, Nov 8</PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Due Nov 8" });
    expect(document.activeElement).toBe(document.body);

    await user.click(trigger);
    expect(screen.getByText("Saturday, Nov 8")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("dialog"));

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Saturday, Nov 8")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
