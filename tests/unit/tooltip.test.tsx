import { describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../src/components/ui/tooltip";

describe("Tooltip", () => {
  test("shows the note on focus", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Due date</TooltipTrigger>
          <TooltipContent>November 8</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    await user.tab();
    expect((await screen.findByRole("tooltip")).textContent).toContain("November 8");
  });

  test("shows the note on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Due date</TooltipTrigger>
          <TooltipContent>November 8</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    await user.hover(screen.getByRole("button", { name: "Due date" }));
    expect((await screen.findByRole("tooltip")).textContent).toContain("November 8");
  });

  test("hides a visible note on Escape and keeps focus on the trigger", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Due date</TooltipTrigger>
          <TooltipContent>November 8</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Due date" });
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  test("hides a visible note when the pointer leaves the trigger", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Due date</TooltipTrigger>
          <TooltipContent>November 8</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByRole("button", { name: "Due date" }));
    await screen.findByRole("tooltip");
    await user.unhover(screen.getByRole("button", { name: "Due date" }));
    await user.pointer({ target: document.body, coords: { clientX: 500, clientY: 500 } });
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });
});
