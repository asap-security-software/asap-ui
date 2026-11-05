import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { StatusPill } from "./status-pill";
import type { StatusTone } from "./status-tone";
import {
  nextSortDirection,
  type SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "UI/Table",
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows: { task: string; due: string; tone: StatusTone; label: string }[] = [
  { task: "Pull wire", due: "Nov 6", tone: "scheduled", label: "Scheduled" },
  { task: "Mount readers", due: "Nov 8", tone: "progress", label: "In progress" },
  { task: "Test doors", due: "Nov 10", tone: "warning", label: "Needs attention" },
];

function DueTable({ size }: { size?: "dense" | "touch" }) {
  const [sort, setSort] = useState<SortDirection | false>("asc");
  const ordered = [...rows].sort((a, b) =>
    sort === "desc" ? b.due.localeCompare(a.due) : a.due.localeCompare(b.due),
  );
  return (
    <Table size={size} className="max-w-[640px]">
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead
            sortable
            sort={sort}
            onSort={() => {
              setSort((current) => nextSortDirection(current));
            }}
          >
            Due
          </TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordered.map((row) => (
          <TableRow key={row.task}>
            <TableCell className="font-medium">{row.task}</TableCell>
            <TableCell className="tabular-nums text-muted">{row.due}</TableCell>
            <TableCell>
              <StatusPill status={row.tone}>{row.label}</StatusPill>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Dense: Story = {
  render: () => <DueTable />,
};

export const Touch: Story = {
  render: () => <DueTable size="touch" />,
};
