import type { Meta, StoryObj } from "@storybook/react-vite";
import { radius, semanticSpacing, spacing } from "../src/tokens";

const meta = {
  title: "Tokens/Spacing",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="max-w-content">
      <h1 className="text-asap-2xl font-semibold tracking-asap-tight text-ink">Spacing</h1>
      <p className="mt-2 mb-6 text-asap-sm text-muted">
        A 4px grid. Controls are 36px, drawer fields 44px, and the technician action is 52px tall.
        The reading column is 820px.
      </p>
      <div className="flex flex-col gap-2">
        {Object.entries(spacing).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3">
            <div className="w-10 text-asap-xs text-muted tabular-nums">{name}</div>
            <div className="w-14 text-asap-xs text-muted tabular-nums">{value}</div>
            <div className="h-3 rounded-full bg-primary" style={{ width: value }} />
          </div>
        ))}
      </div>
      <h2 className="mt-10 mb-3 text-asap-xs font-semibold tracking-asap-eyebrow text-muted uppercase">
        Semantic
      </h2>
      <div className="flex flex-col gap-2">
        {Object.entries(semanticSpacing).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3">
            <div className="w-28 text-asap-sm text-ink">{name}</div>
            <div className="w-16 text-asap-xs text-muted tabular-nums">{value}</div>
            <div
              className="h-3 max-w-full rounded-full bg-ink"
              style={{ width: name === "contentMax" ? "100%" : value }}
            />
          </div>
        ))}
      </div>
      <h2 className="mt-10 mb-3 text-asap-xs font-semibold tracking-asap-eyebrow text-muted uppercase">
        Radius
      </h2>
      <div className="flex flex-wrap gap-4">
        {Object.entries(radius).map(([name, value]) => (
          <div key={name} className="text-center">
            <div
              className="size-16 border border-border bg-surface-muted"
              style={{ borderRadius: value }}
            />
            <div className="mt-2 text-asap-xs font-semibold text-ink">{name}</div>
            <div className="text-asap-xs text-muted tabular-nums">{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
