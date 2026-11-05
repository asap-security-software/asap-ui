import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DueDate: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Due Nov 8</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-asap-2xs font-semibold tracking-asap-eyebrow text-muted uppercase">
          Due
        </div>
        <p className="mt-1 text-asap-sm font-semibold text-ink">Saturday, Nov 8</p>
        <p className="mt-1 text-asap-xs text-muted">The crew is already booked that morning.</p>
      </PopoverContent>
    </Popover>
  ),
};
