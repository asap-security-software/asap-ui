import { afterEach, describe, expect, test } from "bun:test";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster, toast, toastWithUndo } from "../../src/components/ui/sonner";

afterEach(() => {
  toast.dismiss();
});

describe("toast", () => {
  test("undo runs the handler once and removes the toast", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(<Toaster />);
    toastWithUndo("Marked done", () => {
      calls.push("undo");
    });
    await screen.findByText("Marked done");
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(calls).toEqual(["undo"]);
    // Sonner unmounts a dismissed toast after a 200ms exit delay.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.queryByText("Marked done")).toBeNull();
  });

  test("a plain toast shows its message and description in the Notifications region", async () => {
    render(<Toaster />);
    toast("Saved", { description: "Two readers updated" });
    await screen.findByText("Saved");
    const region = screen.getByRole("region", { name: /^Notifications/ });
    expect(within(region).getByText("Saved").textContent).toBe("Saved");
    expect(within(region).getByText("Two readers updated").textContent).toBe("Two readers updated");
  });
});
