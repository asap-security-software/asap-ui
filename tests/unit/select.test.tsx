import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Select, SelectTrigger, SelectValue } from "../../src/components/ui/select";

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
});
