import { afterEach, describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster, toast, toastWithUndo } from "../../src/components/ui/sonner";

afterEach(() => {
  toast.dismiss();
});

describe("toast", () => {
  test("undo runs the handler", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(<Toaster />);
    toastWithUndo("Marked done", () => {
      calls.push("undo");
    });
    expect(await screen.findByText("Marked done")).toBeTruthy();
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(calls).toEqual(["undo"]);
  });
});
