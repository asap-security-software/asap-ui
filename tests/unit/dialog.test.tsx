import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
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
});
