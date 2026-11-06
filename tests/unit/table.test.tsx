import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  nextSortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/ui/table";

describe("nextSortDirection", () => {
  test("starts at ascending and then toggles", () => {
    expect(nextSortDirection(false)).toBe("asc");
    expect(nextSortDirection(undefined)).toBe("asc");
    expect(nextSortDirection("asc")).toBe("desc");
    expect(nextSortDirection("desc")).toBe("asc");
  });
});

describe("Table", () => {
  test("exposes sort state and calls onSort", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sort="asc"
              onSort={() => {
                calls.push("due");
              }}
            >
              Due
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Nov 8</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const header = screen.getByRole("columnheader", { name: "Due" });
    expect(header.getAttribute("aria-sort")).toBe("ascending");
    await user.click(screen.getByRole("button", { name: "Due" }));
    expect(calls).toEqual(["due"]);
  });

  test("leaves aria-sort off a column that cannot sort", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.getByRole("columnheader", { name: "Task" }).hasAttribute("aria-sort")).toBe(
      false,
    );
  });

  test("touch rows use the 52px target", () => {
    render(
      <Table size="touch">
        <TableBody>
          <TableRow>
            <TableCell>Wire</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("cell", { name: "Wire" }).className).toContain("min-h-touch");
  });
});
