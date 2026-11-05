import { duration, ease, shadow } from "./motion";
import { colorRoles } from "./palette";
import { radius } from "./radius";
import { semanticSpacing, spacing } from "./spacing";
import { asap, asapDark, colorVar, kebab, themeToCss } from "./theme";
import {
  fontFamily,
  fontFeature,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from "./typography";

function spaceVar(key: string): string {
  return `--asap-space-${key.replace(".", "-")}`;
}

function declarations(entries: readonly (readonly [string, string])[]): string {
  return entries.map(([name, value]) => `  ${name}: ${value};`).join("\n");
}

function sharedTokens(): string {
  const space = Object.entries(spacing).map(([key, value]) => [spaceVar(key), value] as const);
  const semantic = Object.entries(semanticSpacing).map(
    ([key, value]) => [spaceVar(kebab(key)), value] as const,
  );
  const radii = Object.entries(radius).map(
    ([key, value]) => [`--asap-radius-${key}`, value] as const,
  );
  const sizes = Object.entries(fontSize).map(
    ([key, value]) => [`--asap-text-${key}`, value] as const,
  );
  const weights = Object.entries(fontWeight).map(
    ([key, value]) => [`--asap-font-weight-${key}`, value] as const,
  );
  const leading = Object.entries(lineHeight).map(
    ([key, value]) => [`--asap-leading-${key}`, value] as const,
  );
  const tracking = Object.entries(letterSpacing).map(
    ([key, value]) => [`--asap-tracking-${key}`, value] as const,
  );
  const durations = Object.entries(duration).map(
    ([key, value]) => [`--asap-duration-${key}`, value] as const,
  );
  const easings = Object.entries(ease).map(
    ([key, value]) => [`--asap-ease-${key}`, value] as const,
  );
  const shadows = Object.entries(shadow).map(
    ([key, value]) => [`--asap-shadow-${key}`, value] as const,
  );

  return declarations([
    ["--asap-font-sans", fontFamily.sans],
    ["--asap-font-mono", fontFamily.mono],
    ["--asap-font-feature-tabular", fontFeature.tabular],
    ...weights,
    ...sizes,
    ...leading,
    ...tracking,
    ...space,
    ...semantic,
    ...radii,
    ...durations,
    ...easings,
    ...shadows,
  ]);
}

function themeMappings(): string {
  const colors = colorRoles.map((role) => `  --color-${kebab(role)}: var(${colorVar(role)});`);
  const text = Object.keys(fontSize).flatMap((key) => [
    `  --text-asap-${key}: var(--asap-text-${key});`,
    `  --text-asap-${key}--line-height: var(--asap-leading-normal);`,
  ]);
  const tracking = Object.keys(letterSpacing).map(
    (key) => `  --tracking-asap-${key}: var(--asap-tracking-${key});`,
  );
  const leading = Object.keys(lineHeight).map(
    (key) => `  --leading-asap-${key}: var(--asap-leading-${key});`,
  );
  const radii = Object.keys(radius).map((key) => `  --radius-${key}: var(--asap-radius-${key});`);
  const semanticSpace = Object.keys(semanticSpacing)
    .filter((key) => key !== "contentMax")
    .map((key) => `  --spacing-${kebab(key)}: var(${spaceVar(kebab(key))});`);

  return [
    "@theme inline {",
    ...colors,
    "  --font-sans: var(--asap-font-sans);",
    "  --font-mono: var(--asap-font-mono);",
    ...text,
    ...tracking,
    ...leading,
    ...radii,
    ...semanticSpace,
    "  --container-content: var(--asap-space-content-max);",
    "  --ease-standard: var(--asap-ease-standard);",
    "  --default-transition-duration: var(--asap-duration-fast);",
    "  --default-transition-timing-function: var(--asap-ease-standard);",
    "  --shadow-overlay: var(--asap-shadow-overlay);",
    "  --shadow-hairline: var(--asap-shadow-hairline);",
    "}",
    "",
    "@utility duration-fast {",
    "  transition-duration: var(--asap-duration-fast);",
    "}",
    "@utility duration-normal {",
    "  transition-duration: var(--asap-duration-normal);",
    "}",
    "@utility duration-slow {",
    "  transition-duration: var(--asap-duration-slow);",
    "}",
  ].join("\n");
}

/**
 * Full stylesheet: light tokens on :root, opt-in dark theme, Tailwind v4 `@theme`.
 * Browsers ignore `@theme`; Tailwind (v4) reads it when this file is imported
 * from an app CSS entry that also imports `tailwindcss`.
 */
export function renderStylesheet(): string {
  const light = themeToCss(asap, ':root,\n[data-asap-theme="asap"]').replace(
    "{\n  color-scheme: light;\n",
    `{\n  color-scheme: light;\n${sharedTokens()}\n`,
  );
  const dark = themeToCss(asapDark);

  return `/*
 * @asap-security-software/ui — ASAP tokens and the Tailwind CSS v4 theme.
 * Generated from src/tokens. Edit the TypeScript source, then run \`bun run emit:css\`.
 *
 * App CSS entry (Tailwind must process this file):
 *
 *   @import "tailwindcss";
 *   @import "@asap-security-software/ui/styles.css";
 *   @source "../node_modules/@asap-security-software/ui/dist";
 *
 * :root is the light "asap" theme. Dark mode is opt-in:
 *   <html data-asap-theme="asap-dark">
 *
 * A product theme overrides the palette (defineTheme / themeToCss) and sets
 * data-asap-theme to that name. Spacing, type, radius, and motion are shared.
 */

${light}
${dark}
${themeMappings()}

.asap-root {
  font-family: var(--asap-font-sans);
  color: var(--asap-color-ink);
  background-color: var(--asap-color-background);
  font-feature-settings: var(--asap-font-feature-tabular);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  :root,
  [data-asap-theme] {
    --asap-duration-instant: 0ms;
    --asap-duration-fast: 0ms;
    --asap-duration-normal: 0ms;
    --asap-duration-slow: 0ms;
    --asap-duration-drawer: 0ms;
  }
}
`;
}
