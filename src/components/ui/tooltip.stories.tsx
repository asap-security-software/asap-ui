import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Due: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">Due Nov 8</Button>
      </TooltipTrigger>
      <TooltipContent>Saturday, Nov 8 · morning crew</TooltipContent>
    </Tooltip>
  ),
};
