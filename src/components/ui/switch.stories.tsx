import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Notify the office", defaultChecked: true },
};

export const Touch: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Switch id="notify" size="touch" defaultChecked />
      <Label htmlFor="notify">Notify the office</Label>
    </div>
  ),
};
