import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  asap,
  asapDark,
  type ColorPalette,
  type ColorRole,
  defineTheme,
  themeToCss,
} from "../src/tokens";

const groups: { title: string; roles: ColorRole[] }[] = [
  {
    title: "Brand",
    roles: ["primary", "primaryHover", "primaryForeground", "primarySoft", "primaryInk"],
  },
  {
    title: "Ink and muted",
    roles: ["ink", "inkSecondary", "muted", "mutedSoft"],
  },
  {
    title: "Surfaces",
    roles: ["background", "surface", "surfaceMuted", "border", "borderSoft", "overlay"],
  },
  {
    title: "Status",
    roles: [
      "success",
      "successSoft",
      "successForeground",
      "warning",
      "warningSoft",
      "warningForeground",
      "danger",
      "dangerSoft",
      "dangerForeground",
      "scheduled",
      "scheduledSoft",
      "scheduledForeground",
    ],
  },
];

function Swatches({ palette }: { palette: ColorPalette }) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="mb-3 text-asap-xs font-semibold tracking-asap-eyebrow text-muted uppercase">
            {group.title}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {group.roles.map((role) => (
              <div
                key={role}
                className="overflow-hidden rounded-md border border-border bg-surface"
              >
                <div
                  className="h-16 border-b border-border-soft"
                  style={{ background: palette[role] }}
                />
                <div className="px-3 py-2">
                  <div className="text-asap-sm font-semibold text-ink">{role}</div>
                  <div className="text-asap-xs text-muted tabular-nums">{palette[role]}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Tokens/Colors",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  render: () => (
    <div className="max-w-content">
      <img src="./logo.png" alt="ASAP Security" className="mb-4 h-7 w-auto" />
      <h1 className="text-asap-2xl font-semibold tracking-asap-tight text-ink">asap</h1>
      <p className="mt-1 mb-6 text-asap-sm text-muted">
        Light theme, on by default. Brand red, ink, and status colors are the public-site hexes.
        Surfaces are the warm paper from the ProjectView mockups.
      </p>
      <Swatches palette={asap.colors} />
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div data-asap-theme="asap-dark" className="asap-root max-w-content rounded-xl p-6">
      <h1 className="text-asap-2xl font-semibold tracking-asap-tight">asap-dark</h1>
      <p className="mt-1 mb-6 text-asap-sm text-muted">
        Opt-in with data-asap-theme="asap-dark". Primary is lifted so it stays readable on dark
        paper. The light theme keeps #a60e13.
      </p>
      <Swatches palette={asapDark.colors} />
    </div>
  ),
};

const harbor = defineTheme({
  name: "harbor",
  colors: {
    primary: "#0b3d91",
    primaryHover: "#082f73",
    primarySoft: "#e7eef8",
    primaryInk: "#082456",
  },
});

export const PaletteOverride: Story = {
  render: () => (
    <div className="max-w-content">
      <style>{themeToCss(harbor)}</style>
      <h1 className="text-asap-2xl font-semibold tracking-asap-tight text-ink">harbor</h1>
      <p className="mt-1 mb-6 text-asap-sm text-muted">
        defineTheme copies asap, then replaces the primary ramp. Everything else stays. Inject
        themeToCss() and set data-asap-theme="harbor".
      </p>
      <div data-asap-theme="harbor">
        <Swatches palette={harbor.colors} />
      </div>
    </div>
  ),
};
