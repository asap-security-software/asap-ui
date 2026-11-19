import { describe, expect, test } from "bun:test";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Edit task</DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit task</DialogTitle>
        <DialogDescription>Change the title.</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function WithOutsideControl() {
  return (
    <>
      <button type="button">Outside control</button>
      <Dialog>
        <DialogTrigger>Edit task</DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Change the title.</DialogDescription>
          <input aria-label="Task title" />
          <button type="button">Save</button>
        </DialogContent>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  test("opens and closes", async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Edit task" }));
    expect(screen.getByRole("dialog", { name: "Edit task" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("closes from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Edit task" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("returns focus to the trigger after Escape closes it", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Edit task" });
    await user.click(trigger);
    // Opening moves focus off the trigger and into the dialog.
    expect(screen.getByRole("dialog", { name: "Edit task" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("returns focus to the trigger after the Close button closes it", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Edit task" });
    await user.click(trigger);
    const close = screen.getByRole("button", { name: "Close" });
    expect(document.activeElement).toBe(close);
    await user.click(close);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("closes when the overlay is clicked and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Edit task" });
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeNull();
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).not.toBeNull();
    if (overlay === null) return;
    await user.click(overlay);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("describes the dialog with the DialogDescription text", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Edit task" }));
    const dialog = screen.queryByRole("dialog", { description: "Change the title." });
    expect(dialog).not.toBeNull();
    if (dialog === null) return;
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(describedBy).not.toBeNull();
    if (describedBy === null) return;
    const description = document.getElementById(describedBy);
    expect(description).not.toBeNull();
    expect(description?.textContent).toBe("Change the title.");
  });

  describe("focus trap", () => {
    async function openDialog() {
      const user = userEvent.setup();
      render(<WithOutsideControl />);
      await user.click(screen.getByRole("button", { name: "Edit task" }));
      const dialog = screen.getByRole("dialog", { name: "Edit task" });
      return {
        user,
        dialog,
        outside: screen.getByRole("button", { name: "Outside control", hidden: true }),
        field: screen.getByRole("textbox", { name: "Task title" }),
        save: screen.getByRole("button", { name: "Save" }),
        close: screen.getByRole("button", { name: "Close" }),
      };
    }

    test("Tab cycles through the dialog controls and wraps without reaching outside", async () => {
      const { user, dialog, outside, field, save, close } = await openDialog();
      expect(document.activeElement).toBe(field);
      for (const expected of [save, close, field, save, close, field]) {
        await user.tab();
        expect(document.activeElement).toBe(expected);
        expect(dialog.contains(document.activeElement)).toBe(true);
        expect(document.activeElement).not.toBe(outside);
        expect(document.activeElement).not.toBe(document.body);
      }
    });

    test("hides outside content and returns focus to the field when outside is focused", async () => {
      const { dialog, outside, field } = await openDialog();
      expect(document.activeElement).toBe(field);
      // Only modal mode hides the rest of the page from assistive tech.
      expect(outside.closest("[aria-hidden=true]")).not.toBeNull();
      expect(dialog.closest("[aria-hidden=true]")).toBeNull();
      act(() => {
        outside.focus();
      });
      expect(document.activeElement).toBe(field);
      expect(document.activeElement).not.toBe(outside);
      expect(document.activeElement).not.toBe(document.body);
    });

    test("Shift+Tab cycles backwards and wraps without reaching outside", async () => {
      const { user, dialog, outside, field, save, close } = await openDialog();
      expect(document.activeElement).toBe(field);
      for (const expected of [close, save, field, close, save, field]) {
        await user.tab({ shift: true });
        expect(document.activeElement).toBe(expected);
        expect(dialog.contains(document.activeElement)).toBe(true);
        expect(document.activeElement).not.toBe(outside);
        expect(document.activeElement).not.toBe(document.body);
      }
    });
  });
});
