import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Include parts", defaultChecked: true },
};

export const Touch: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Checkbox id="parts" size="touch" defaultChecked />
      <Label htmlFor="parts">Include parts</Label>
    </div>
  ),
};
