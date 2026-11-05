import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
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
});
