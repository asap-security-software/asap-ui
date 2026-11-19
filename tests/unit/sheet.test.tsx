import { describe, expect, test } from "bun:test";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../src/components/ui/sheet";

function Example({ side }: { side?: "right" | "bottom" | "left" | "top" }) {
  return (
    <Sheet>
      <SheetTrigger>Open task</SheetTrigger>
      <SheetContent side={side}>
        <SheetTitle>North wing readers</SheetTitle>
        <SheetDescription>Replace the two failed readers.</SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  test("opens from the right by default", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Open task" }));
    const dialog = screen.getByRole("dialog", { name: "North wing readers" });
    expect(dialog.getAttribute("data-side")).toBe("right");
    expect(dialog.className).toContain("animate-drawer-right");
    expect(document.querySelector("[data-slot=sheet-handle]")).toBeNull();
  });

  test("bottom sheet shows a handle", async () => {
    const user = userEvent.setup();
    render(<Example side="bottom" />);
    await user.click(screen.getByRole("button", { name: "Open task" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("data-side")).toBe("bottom");
    expect(dialog.className).toContain("animate-drawer-bottom");
    expect(document.querySelector("[data-slot=sheet-handle]")).toBeTruthy();
  });

  test("left sheet sets data-side, animation class and has no handle", async () => {
    const user = userEvent.setup();
    render(<Example side="left" />);
    await user.click(screen.getByRole("button", { name: "Open task" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("data-side")).toBe("left");
    expect(dialog.className).toContain("animate-drawer-left");
    expect(document.querySelector("[data-slot=sheet-handle]")).toBeNull();
  });

  test("top sheet sets data-side, animation class and has no handle", async () => {
    const user = userEvent.setup();
    render(<Example side="top" />);
    await user.click(screen.getByRole("button", { name: "Open task" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("data-side")).toBe("top");
    expect(dialog.className).toContain("animate-drawer-top");
    expect(document.querySelector("[data-slot=sheet-handle]")).toBeNull();
  });

  test("Escape closes the sheet and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open task" });
    expect(document.activeElement).toBe(document.body);

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "North wing readers" });
    expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Close" }));

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("North wing readers")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  describe("focus trap", () => {
    async function openSheet() {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">Outside control</button>
          <Sheet>
            <SheetTrigger>Open task</SheetTrigger>
            <SheetContent>
              <SheetTitle>North wing readers</SheetTitle>
              <SheetDescription>Replace the two failed readers.</SheetDescription>
              <input aria-label="Task title" />
              <button type="button">Save</button>
            </SheetContent>
          </Sheet>
        </>,
      );
      await user.click(screen.getByRole("button", { name: "Open task" }));
      const dialog = screen.queryByRole("dialog", { name: "North wing readers" });
      expect(dialog).not.toBeNull();
      return {
        user,
        outside: screen.getByRole("button", { name: "Outside control", hidden: true }),
        field: screen.getByRole("textbox", { name: "Task title" }),
        save: screen.getByRole("button", { name: "Save" }),
        close: screen.getByRole("button", { name: "Close" }),
      };
    }

    test("Tab from the last control wraps to the first and never reaches the outside button", async () => {
      const { user, outside, field, save, close } = await openSheet();
      expect(document.activeElement).toBe(field);
      await user.tab();
      expect(document.activeElement).toBe(save);
      await user.tab();
      expect(document.activeElement).toBe(close);

      const stops: Array<Element | null> = [];
      for (let i = 0; i < 3; i++) {
        await user.tab();
        stops.push(document.activeElement);
      }
      expect(stops).toEqual([field, save, close]);
      expect(stops.some((stop) => stop === outside)).toBe(false);
      expect(document.activeElement).toBe(close);
    });

    test("Shift+Tab from the first control wraps to the last and never reaches the outside button", async () => {
      const { user, outside, field, save, close } = await openSheet();
      expect(document.activeElement).toBe(field);

      const stops: Array<Element | null> = [];
      for (let i = 0; i < 3; i++) {
        await user.tab({ shift: true });
        stops.push(document.activeElement);
      }
      expect(stops).toEqual([close, save, field]);
      expect(stops.some((stop) => stop === outside)).toBe(false);
      expect(document.activeElement).toBe(field);
    });
  });
});
