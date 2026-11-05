import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";

describe("DropdownMenu", () => {
  test("runs the item action", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              calls.push("done");
            }}
          >
            Mark done
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Mark done" }));
    expect(calls).toEqual(["done"]);
  });

  test("touch items use the 52px target", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent size="touch">
          <DropdownMenuItem>Start</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menuitem", { name: "Start" }).className).toContain("min-h-touch");
  });
});
