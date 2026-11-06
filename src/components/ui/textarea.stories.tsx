import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: { placeholder: "What changed on site?", "aria-label": "Note" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Touch: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-2">
      <Label htmlFor="site-note">Note for the office</Label>
      <Textarea id="site-note" size="touch" placeholder="The stair reader needs a new backbox." />
    </div>
  ),
};
