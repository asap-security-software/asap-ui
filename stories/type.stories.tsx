import type { Meta, StoryObj } from "@storybook/react-vite";
import { fontSize, letterSpacing } from "../src/tokens";

const meta = {
  title: "Tokens/Type",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const dates = ["Oct 14", "Oct 16", "Oct 28", "Nov 7", "Nov 10", "Nov 14", "Nov 18"];

export const Scale: Story = {
  render: () => (
    <div className="max-w-content">
      <h1 className="text-asap-2xl font-semibold tracking-asap-tight text-ink">
        Inter, with Geist as the fallback
      </h1>
      <p className="mt-2 max-w-xl text-asap-base leading-asap-normal text-muted">
        Body copy is 14px. Titles pull in slightly. Dates and counts use tabular figures so columns
        of due dates stay aligned.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {Object.entries(fontSize).map(([name, size]) => (
          <div key={name} className="flex items-baseline gap-4 border-b border-border-soft pb-3">
            <div className="w-16 shrink-0 text-asap-xs text-muted tabular-nums">{size}</div>
            <div className="w-12 shrink-0 text-asap-xs font-semibold text-muted">{name}</div>
            <div style={{ fontSize: size }} className="font-semibold tracking-asap-snug text-ink">
              SO-EXAMPLE — Example Hospital
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-10 mb-3 text-asap-xs font-semibold tracking-asap-eyebrow text-muted uppercase">
        Tabular dates
      </h2>
      <div className="flex gap-12">
        <div>
          <div className="mb-2 text-asap-xs text-muted">tabular-nums</div>
          <div className="text-asap-sm text-ink tabular-nums">
            {dates.map((date) => (
              <div key={date}>{date}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-asap-xs text-muted">proportional</div>
          <div
            className="text-asap-sm text-ink"
            style={{ fontVariantNumeric: "proportional-nums" }}
          >
            {dates.map((date) => (
              <div key={date}>{date}</div>
            ))}
          </div>
        </div>
      </div>
      <h2 className="mt-10 mb-3 text-asap-xs font-semibold tracking-asap-eyebrow text-muted uppercase">
        Tracking
      </h2>
      <div className="flex flex-col gap-2">
        {Object.entries(letterSpacing).map(([name, value]) => (
          <div key={name} className="text-asap-base text-ink" style={{ letterSpacing: value }}>
            {name} · Phase 1 — Pre-install & rough-in
          </div>
        ))}
      </div>
    </div>
  ),
};
