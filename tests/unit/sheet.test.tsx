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
});
