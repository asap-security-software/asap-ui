import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "Scheduled", status: "scheduled" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduled: Story = {};

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Badge status="done">Done</Badge>
      <Badge status="progress">In progress</Badge>
      <Badge status="scheduled">Scheduled</Badge>
      <Badge status="warning">Needs attention</Badge>
      <Badge status="danger">Overdue</Badge>
    </div>
  ),
};

export const WithoutDot: Story = {
  args: { dot: false, status: "done", children: "Done" },
};
