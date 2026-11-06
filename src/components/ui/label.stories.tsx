import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithField: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-2">
      <Label htmlFor="job-name">Job name</Label>
      <Input id="job-name" defaultValue="Floor 3 readers" />
    </div>
  ),
};
