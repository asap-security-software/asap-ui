import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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

  test("checkbox item reports the next checked value and exposes it", async () => {
    const user = userEvent.setup();
    const values: boolean[] = [];
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>View</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={(next) => {
              values.push(next);
            }}
          >
            Show grid
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole("button", { name: "View" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(item.getAttribute("aria-checked")).toBe("false");
    await user.click(item);
    expect(values).toEqual([true]);
  });

  test("checkbox item reports false when toggled off", async () => {
    const user = userEvent.setup();
    const values: boolean[] = [];
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>View</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked
            onCheckedChange={(next) => {
              values.push(next);
            }}
          >
            Show grid
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole("button", { name: "View" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(item.getAttribute("aria-checked")).toBe("true");
    await user.click(item);
    expect(values).toEqual([false]);
  });

  test("radio item reports the chosen value and marks only it checked", async () => {
    const user = userEvent.setup();
    const values: string[] = [];
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Sort</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value="name"
            onValueChange={(next) => {
              values.push(next);
            }}
          >
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole("button", { name: "Sort" }));
    const name = screen.getByRole("menuitemradio", { name: "Name" });
    const date = screen.getByRole("menuitemradio", { name: "Date" });
    expect(name.getAttribute("aria-checked")).toBe("true");
    expect(date.getAttribute("aria-checked")).toBe("false");
    await user.click(date);
    expect(values).toEqual(["date"]);
  });
});
