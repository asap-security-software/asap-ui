import { describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  canChangeStatus,
  type StatusOption,
  StatusSelect,
  visibleStatusOptions,
} from "../../src/components/ui/status-select";

const options: StatusOption[] = [
  { value: "scheduled", label: "Scheduled", tone: "scheduled" },
  { value: "progress", label: "In progress", tone: "progress" },
  { value: "done", label: "Done", tone: "done" },
  { value: "hold", label: "On hold", tone: "warning" },
];

describe("canChangeStatus", () => {
  test("allows only a listed move", () => {
    expect(canChangeStatus("scheduled", "progress", ["progress"])).toBe(true);
    expect(canChangeStatus("scheduled", "scheduled", ["progress"])).toBe(false);
    expect(canChangeStatus("scheduled", "done", ["progress"])).toBe(false);
    expect(canChangeStatus("done", "progress", [])).toBe(false);
  });
});

describe("visibleStatusOptions", () => {
  test("keeps the current status and the allowed moves", () => {
    expect(
      visibleStatusOptions(options, "scheduled", ["progress"]).map((option) => option.value),
    ).toEqual(["scheduled", "progress"]);
  });

  test("drops allowed values that are not real options", () => {
    expect(
      visibleStatusOptions(options, "progress", ["missing", "done"]).map((option) => option.value),
    ).toEqual(["progress", "done"]);
  });

  test("shows the current value even when it is not an allowed move", () => {
    expect(visibleStatusOptions(options, "done", []).map((option) => option.value)).toEqual([
      "done",
    ]);
  });

  test("labels an unknown current value and dedupes", () => {
    const visible = visibleStatusOptions(
      [...options, { value: "progress", label: "Again", tone: "progress" }],
      "review",
      ["progress"],
    );
    expect(visible.map((option) => option.label)).toEqual(["review", "In progress"]);
  });

  test("does not invent an item for an empty value", () => {
    expect(visibleStatusOptions(options, "", ["progress"]).map((option) => option.value)).toEqual([
      "progress",
    ]);
  });
});

function Harness() {
  const [value, setValue] = useState("scheduled");
  return (
    <StatusSelect value={value} options={options} allowed={["progress"]} onValueChange={setValue} />
  );
}

function TrackedHarness({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState("scheduled");
  return (
    <StatusSelect
      aria-label="Status"
      value={value}
      options={options}
      allowed={["progress"]}
      onValueChange={(next) => {
        onChange(next);
        setValue(next);
      }}
    />
  );
}

function EmptyHarness() {
  const [value, setValue] = useState("");
  return (
    <StatusSelect
      aria-label="Status"
      placeholder="Choose a status"
      value={value}
      options={options}
      allowed={["scheduled"]}
      onValueChange={setValue}
    />
  );
}

describe("StatusSelect", () => {
  test("locks the field when there is nowhere to move", () => {
    render(<StatusSelect aria-label="Status" value="done" options={options} allowed={[]} />);
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveProperty("disabled", true);
  });

  test("stays controlled when the value starts empty", async () => {
    const user = userEvent.setup();
    const messages: string[] = [];
    const originalError = console.error;
    const originalWarn = console.warn;
    const record = (...args: unknown[]) => {
      messages.push(args.map((arg) => (typeof arg === "string" ? arg : String(arg))).join(" "));
    };
    console.error = (...args: unknown[]) => {
      record(...args);
      originalError(...args);
    };
    console.warn = (...args: unknown[]) => {
      record(...args);
      originalWarn(...args);
    };
    try {
      render(<EmptyHarness />);
      const combo = screen.getByRole("combobox", { name: "Status" });
      expect(combo.textContent).toContain("Choose a status");
      await user.click(combo);
      await user.click(screen.getByRole("option", { name: "Scheduled" }));
      expect(screen.getByRole("combobox", { name: "Status" }).textContent).toContain("Scheduled");
      expect(messages.join("\n")).not.toMatch(/changing from uncontrolled to controlled/);
      expect(messages.join("\n")).not.toMatch(/changing from controlled to uncontrolled/);
    } finally {
      console.error = originalError;
      console.warn = originalWarn;
    }
  });

  test("changes only to an allowed status", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("combobox", { name: "Status" }));
    expect(screen.getByRole("option", { name: "In progress" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Done" })).toBeNull();
    expect(screen.queryByRole("option", { name: "On hold" })).toBeNull();
    await user.click(screen.getByRole("option", { name: "In progress" }));
    expect(screen.getByRole("combobox", { name: "Status" }).textContent).toContain("In progress");
  });

  for (const key of ["{Enter}", "{ }"]) {
    test(`opening with ${key} and choosing with the keyboard offers and picks only the allowed status`, async () => {
      const user = userEvent.setup();
      const changes: string[] = [];
      render(<TrackedHarness onChange={(next) => changes.push(next)} />);

      await user.tab();
      const trigger = screen.getByRole("combobox", { name: "Status" });
      expect(document.activeElement).toBe(trigger);
      expect(trigger.textContent).toBe("Scheduled");

      await user.keyboard(key);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      const scheduled = screen.getByRole("option", { name: "Scheduled" });
      const progress = screen.getByRole("option", { name: "In progress" });
      await waitFor(() => expect(document.activeElement).toBe(scheduled));
      expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
        "Scheduled",
        "In progress",
      ]);
      expect(screen.queryByRole("option", { name: "Done" })).toBeNull();
      expect(screen.queryByRole("option", { name: "On hold" })).toBeNull();
      expect(scheduled.getAttribute("data-state")).toBe("checked");
      expect(progress.getAttribute("data-state")).toBe("unchecked");

      await user.keyboard("{ArrowDown}");
      expect(document.activeElement).toBe(progress);
      expect(changes).toEqual([]);

      await user.keyboard("{Enter}");
      expect(changes).toEqual(["progress"]);
      expect(screen.queryByRole("listbox")).toBeNull();
      const closedTrigger = screen.getByRole("combobox", { name: "Status" });
      expect(closedTrigger.textContent).toBe("In progress");
      // In this harness "progress" has no further allowed move, so the field
      // locks itself (disabled) after the change and the browser drops focus.
      expect(closedTrigger.hasAttribute("disabled")).toBe(true);
      await waitFor(() => expect(document.activeElement).toBe(document.body));
    });
  }
});
