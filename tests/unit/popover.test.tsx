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

  test("removes its content from the DOM when an outside button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside action</button>
        <Popover>
          <PopoverTrigger>Pick a date</PopoverTrigger>
          <PopoverContent>Friday, Dec 12</PopoverContent>
        </Popover>
      </div>,
    );
    const trigger = screen.getByRole("button", { name: "Pick a date" });
    const outside = screen.getByRole("button", { name: "Outside action" });
    expect(screen.queryByText("Friday, Dec 12")).toBeNull();

    await user.click(trigger);
    expect(screen.getByText("Friday, Dec 12").textContent).toBe("Friday, Dec 12");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.queryByRole("dialog")).not.toBeNull();

    await user.click(outside);
    expect(screen.queryByText("Friday, Dec 12")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
