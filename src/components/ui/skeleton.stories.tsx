import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskCard: Story = {
  render: () => (
    <div className="w-[360px] rounded-xl border border-border-soft bg-surface p-3.5">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-2 h-5 w-56" />
      <Skeleton className="mt-3 h-7 w-24 rounded-full" />
    </div>
  ),
};
