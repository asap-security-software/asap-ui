import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BetweenMeta: Story = {
  render: () => (
    <div className="w-[360px]">
      <div className="text-asap-xs font-semibold text-primary">Memorial Hospital</div>
      <h3 className="mt-1 text-asap-xl font-semibold tracking-asap-tight">North wing readers</h3>
      <Separator className="my-3" />
      <p className="text-asap-sm text-muted">Due Nov 8 · Access</p>
    </div>
  ),
};
