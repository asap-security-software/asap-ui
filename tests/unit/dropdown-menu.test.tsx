import { describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";

const RADIO_INDICATOR = "span.size-2.rounded-full";

function CheckboxHarness({ initial, values }: { initial: boolean; values: boolean[] }) {
  const [checked, setChecked] = useState(initial);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>View</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={checked}
          onCheckedChange={(next) => {
            values.push(next);
            setChecked(next);
          }}
        >
          Show grid
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioHarness({ values }: { values: string[] }) {
  const [value, setValue] = useState("name");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Sort</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            values.push(next);
            setValue(next);
          }}
        >
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

  test.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
  ])("%s on the trigger opens the menu and focuses the first item", async (_name, key) => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Mark done</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
    await user.keyboard(key);
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Mark done" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Archive" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Mark done" }));
  });

  test("Enter on a focused item runs it, closes the menu and refocuses the trigger", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => calls.push("done")}>Mark done</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => calls.push("archive")}>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Mark done" }));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Archive" }));
    await user.keyboard("{Enter}");
    expect(calls).toEqual(["archive"]);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(screen.queryByRole("menuitem")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  test("Enter on a radio item chooses it, closes the menu and refocuses the trigger", async () => {
    const user = userEvent.setup();
    const values: string[] = [];
    render(<RadioHarness values={values} />);
    const trigger = screen.getByRole("button", { name: "Sort" });
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    await user.keyboard("{Enter}");
    expect(document.activeElement).toBe(screen.getByRole("menuitemradio", { name: "Name" }));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("menuitemradio", { name: "Date" }));
    await user.keyboard("{Enter}");
    expect(values).toEqual(["date"]);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    await user.keyboard("{Enter}");
    const name = screen.getByRole("menuitemradio", { name: "Name" });
    const date = screen.getByRole("menuitemradio", { name: "Date" });
    expect(date.getAttribute("aria-checked")).toBe("true");
    expect(date.getAttribute("data-state")).toBe("checked");
    expect(name.getAttribute("aria-checked")).toBe("false");
    expect(name.getAttribute("data-state")).toBe("unchecked");
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
    render(<CheckboxHarness initial={false} values={values} />);
    await user.click(screen.getByRole("button", { name: "View" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(item.getAttribute("aria-checked")).toBe("false");
    expect(item.getAttribute("data-state")).toBe("unchecked");
    expect(item.querySelector("svg")).toBeNull();
    await user.click(item);
    expect(values).toEqual([true]);
    await user.click(screen.getByRole("button", { name: "View" }));
    const after = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(after.getAttribute("aria-checked")).toBe("true");
    expect(after.getAttribute("data-state")).toBe("checked");
    expect(after.querySelector("svg")).not.toBeNull();
  });

  test("checkbox item reports false when toggled off", async () => {
    const user = userEvent.setup();
    const values: boolean[] = [];
    render(<CheckboxHarness initial values={values} />);
    await user.click(screen.getByRole("button", { name: "View" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(item.getAttribute("aria-checked")).toBe("true");
    expect(item.getAttribute("data-state")).toBe("checked");
    expect(item.querySelector("svg")).not.toBeNull();
    await user.click(item);
    expect(values).toEqual([false]);
    await user.click(screen.getByRole("button", { name: "View" }));
    const after = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(after.getAttribute("aria-checked")).toBe("false");
    expect(after.getAttribute("data-state")).toBe("unchecked");
    expect(after.querySelector("svg")).toBeNull();
  });

  test("radio item reports the chosen value and marks only it checked", async () => {
    const user = userEvent.setup();
    const values: string[] = [];
    render(<RadioHarness values={values} />);
    await user.click(screen.getByRole("button", { name: "Sort" }));
    const name = screen.getByRole("menuitemradio", { name: "Name" });
    const date = screen.getByRole("menuitemradio", { name: "Date" });
    expect(name.getAttribute("aria-checked")).toBe("true");
    expect(date.getAttribute("aria-checked")).toBe("false");
    expect(name.getAttribute("data-state")).toBe("checked");
    expect(date.getAttribute("data-state")).toBe("unchecked");
    expect(name.querySelector(RADIO_INDICATOR)).not.toBeNull();
    expect(date.querySelector(RADIO_INDICATOR)).toBeNull();
    await user.click(date);
    expect(values).toEqual(["date"]);
    await user.click(screen.getByRole("button", { name: "Sort" }));
    const nameAfter = screen.getByRole("menuitemradio", { name: "Name" });
    const dateAfter = screen.getByRole("menuitemradio", { name: "Date" });
    expect(dateAfter.getAttribute("aria-checked")).toBe("true");
    expect(dateAfter.getAttribute("data-state")).toBe("checked");
    expect(dateAfter.querySelector(RADIO_INDICATOR)).not.toBeNull();
    expect(nameAfter.getAttribute("aria-checked")).toBe("false");
    expect(nameAfter.getAttribute("data-state")).toBe("unchecked");
    expect(nameAfter.querySelector(RADIO_INDICATOR)).toBeNull();
  });
});
