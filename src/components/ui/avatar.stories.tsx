import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  render: () => (
    <div className="flex items-center gap-2.5">
      <Avatar>
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-asap-sm font-semibold text-ink">Lead tech</div>
        <div className="text-asap-xs text-muted">On site</div>
      </div>
    </div>
  ),
};

export const Touch: Story = {
  args: { size: "touch" },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>LT</AvatarFallback>
    </Avatar>
  ),
};
