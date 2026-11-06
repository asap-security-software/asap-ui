import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Start" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Mark done" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Assignee: Anyone" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Back" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Start" },
};

export const TouchTargets: Story = {
  render: () => (
    <div className="flex w-[358px] flex-col gap-3">
      <article className="rounded-xl border border-border-soft bg-surface p-3.5">
        <div className="text-asap-xs font-semibold text-primary">Example Hospital · Access</div>
        <h3 className="mt-1 text-asap-xl font-semibold tracking-asap-tight text-ink">
          Floor 3 — north wing readers
        </h3>
        <div className="mt-2 mb-3 flex items-center gap-2.5">
          <Badge status="progress" size="md">
            In progress
          </Badge>
          <span className="text-asap-sm text-muted tabular-nums">Due Nov 8</span>
        </div>
        <Button variant="secondary" size="touch" className="w-full">
          Mark done
        </Button>
      </article>
      <article className="rounded-xl border border-border-soft bg-surface p-3.5">
        <div className="text-asap-xs font-semibold text-primary">Example Hospital</div>
        <h3 className="mt-1 text-asap-xl font-semibold tracking-asap-tight text-ink">
          Mount backboxes & power supplies
        </h3>
        <div className="mt-2 mb-3 flex items-center gap-2.5">
          <Badge status="scheduled" size="md">
            Scheduled
          </Badge>
          <span className="text-asap-sm text-muted tabular-nums">Due Nov 10</span>
        </div>
        <Button size="touch" className="w-full">
          Start
        </Button>
      </article>
    </div>
  ),
};
