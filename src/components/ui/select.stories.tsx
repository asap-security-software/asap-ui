import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const dot = "inline-block size-2 shrink-0 rounded-full";

export const Touch: Story = {
  render: () => (
    <div className="w-[360px]">
      <Select defaultValue="progress">
        <SelectTrigger size="touch" aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="progress">In progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="w-[360px] rounded-xl border border-border bg-surface p-5">
      <div className="mb-2 text-asap-2xs font-semibold tracking-asap-eyebrow text-muted uppercase">
        Status
      </div>
      <Select defaultValue="progress">
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scheduled">
            <span className="flex items-center gap-2.5">
              <span className={`${dot} bg-scheduled`} />
              Scheduled
            </span>
          </SelectItem>
          <SelectItem value="progress">
            <span className="flex items-center gap-2.5">
              <span className={`${dot} bg-primary`} />
              In progress
            </span>
          </SelectItem>
          <SelectItem value="done">
            <span className="flex items-center gap-2.5">
              <span className={`${dot} bg-success`} />
              Done
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="mt-3 text-asap-xs leading-asap-snug text-muted">
        The open list is a hairline panel. The current row uses the primary tint. No glass, no heavy
        shadow.
      </p>
    </div>
  ),
};
