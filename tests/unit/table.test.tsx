import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  nextSortDirection,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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

  test("sort=desc sets aria-sort to descending", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sort="desc" onSort={() => {}}>
              Due
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.getByRole("columnheader", { name: "Due" }).getAttribute("aria-sort")).toBe(
      "descending",
    );
  });

  test("sortable column with no active sort has aria-sort none", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={() => {}}>
              Due
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(screen.getByRole("columnheader", { name: "Due" }).getAttribute("aria-sort")).toBe(
      "none",
    );
  });

  test("TableCaption renders its text with the table-caption slot", () => {
    render(
      <Table>
        <TableCaption>Open tasks</TableCaption>
      </Table>,
    );
    const caption = screen.getByText("Open tasks");
    expect(caption.getAttribute("data-slot")).toBe("table-caption");
    expect(caption.textContent).toBe("Open tasks");
  });

  test("TableFooter renders its text with the table-footer slot", () => {
    render(
      <Table>
        <TableFooter>
          <TableRow>
            <TableCell>Total: 3</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    const footer = screen.getByText("Total: 3").closest("tfoot");
    expect(footer?.getAttribute("data-slot")).toBe("table-footer");
    expect(footer?.textContent).toBe("Total: 3");
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
