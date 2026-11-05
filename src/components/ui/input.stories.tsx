import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  args: { placeholder: "Search tasks", "aria-label": "Search tasks" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "not an email",
    type: "email",
    "aria-label": "Email",
  },
};

export const Touch: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-2">
      <Label htmlFor="note-title">What did you finish?</Label>
      <Input id="note-title" size="touch" placeholder="Replaced the north reader" />
    </div>
  ),
};
