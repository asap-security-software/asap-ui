import { describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/ui/select";

describe("Select", () => {
  test("touch trigger uses the 52px target", () => {
    render(
      <Select>
        <SelectTrigger size="touch" aria-label="Status">
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Status" }).className).toContain("min-h-touch");
  });

  test("choosing an item reports its value and shows its label in the trigger", async () => {
    const user = userEvent.setup();
    const changes: string[] = [];
    render(
      <Select onValueChange={(value) => changes.push(value)}>
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="progress">In progress</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger.textContent).toBe("Choose a status");

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "In progress" }));

    expect(changes).toEqual(["progress"]);
    expect(screen.getByRole("combobox", { name: "Status" }).textContent).toBe("In progress");
  });

  for (const key of ["{Enter}", "{ }"]) {
    test(`opening with ${key} and choosing with the keyboard reports the value and labels the trigger`, async () => {
      const user = userEvent.setup();
      const changes: string[] = [];
      render(
        <Select onValueChange={(value) => changes.push(value)}>
          <SelectTrigger aria-label="Status">
            <SelectValue placeholder="Choose a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="progress">In progress</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.tab();
      const trigger = screen.getByRole("combobox", { name: "Status" });
      expect(document.activeElement).toBe(trigger);

      await user.keyboard(key);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      const scheduled = screen.getByRole("option", { name: "Scheduled" });
      const progress = screen.getByRole("option", { name: "In progress" });
      await waitFor(() => expect(document.activeElement).toBe(scheduled));

      await user.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(progress);
      expect(changes).toEqual([]);

      await user.keyboard("{Enter}");
      expect(changes).toEqual(["progress"]);
      expect(screen.queryByRole("listbox")).toBeNull();
      const closedTrigger = screen.getByRole("combobox", { name: "Status" });
      expect(closedTrigger.textContent).toBe("In progress");
      await waitFor(() => expect(document.activeElement).toBe(closedTrigger));
    });
  }
});
