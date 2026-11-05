import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
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

describe("StatusSelect", () => {
  test("locks the field when there is nowhere to move", () => {
    render(<StatusSelect aria-label="Status" value="done" options={options} allowed={[]} />);
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveProperty("disabled", true);
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
});
