import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
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
