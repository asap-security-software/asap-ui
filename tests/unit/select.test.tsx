import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
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
});
