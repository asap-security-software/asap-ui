import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusPill } from "./status-pill";
import { statusTones } from "./status-tone";

const meta = {
  title: "UI/StatusPill",
  component: StatusPill,
  args: { children: "Scheduled", status: "scheduled" },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  done: "Done",
  progress: "In progress",
  scheduled: "Scheduled",
  warning: "Needs attention",
  danger: "Overdue",
} as const;

export const Scheduled: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      {statusTones.map((tone) => (
        <StatusPill key={tone} status={tone}>
          {labels[tone]}
        </StatusPill>
      ))}
    </div>
  ),
};
