import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type StatusOption, StatusSelect } from "./status-select";

const options: StatusOption[] = [
  { value: "scheduled", label: "Scheduled", tone: "scheduled" },
  { value: "progress", label: "In progress", tone: "progress" },
  { value: "done", label: "Done", tone: "done" },
  { value: "hold", label: "On hold", tone: "warning" },
];

const meta = {
  title: "UI/StatusSelect",
  component: StatusSelect,
  args: {
    value: "scheduled",
    options,
    allowed: ["progress", "hold"],
  },
} satisfies Meta<typeof StatusSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const allowedFrom: Record<string, string[]> = {
  scheduled: ["progress", "hold"],
  progress: ["done", "hold"],
  hold: ["progress"],
  done: [],
};

function AllowedStory({ size }: { size?: "md" | "lg" | "touch" }) {
  const [value, setValue] = useState("scheduled");
  return (
    <div className="w-[360px]">
      <StatusSelect
        size={size}
        value={value}
        options={options}
        allowed={allowedFrom[value] ?? []}
        onValueChange={setValue}
      />
      <p className="mt-3 text-asap-xs text-muted">
        Only the moves this status allows are in the list. Done cannot move.
      </p>
    </div>
  );
}

export const AllowedMoves: Story = {
  render: () => <AllowedStory />,
};

export const Touch: Story = {
  render: () => <AllowedStory size="touch" />,
};
