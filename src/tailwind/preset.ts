import type { Config } from "tailwindcss";
import { colorRoles } from "../tokens/palette";
import { radius } from "../tokens/radius";
import { semanticSpacing } from "../tokens/spacing";
import { kebab } from "../tokens/theme";
import { fontSize, letterSpacing, lineHeight } from "../tokens/typography";

/**
 * Tailwind v4 JS preset.
 *
 * Prefer the CSS entry. Importing `styles.css` from a Tailwind v4 file
 * already registers colors, radius, type, and motion via `@theme`.
 *
 * JS config (when an app still uses `@config`):
 *
 * ```ts
 * import asapPreset from "@asap-security-software/ui/tailwind-preset";
 * export default { presets: [asapPreset] } satisfies Config;
 * ```
 *
 * Colors point at `--asap-color-*`, so a palette override still works.
 */
const colors = Object.fromEntries(
  colorRoles.map((role) => [kebab(role), `var(--asap-color-${kebab(role)})`]),
);

const fontSizeTheme = Object.fromEntries(
  Object.keys(fontSize).map((key) => [
    `asap-${key}`,
    [`var(--asap-text-${key})`, { lineHeight: "var(--asap-leading-normal)" }],
  ]),
);

const preset = {
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["var(--asap-font-sans)"],
        mono: ["var(--asap-font-mono)"],
      },
      fontSize: fontSizeTheme,
      letterSpacing: Object.fromEntries(
        Object.keys(letterSpacing).map((key) => [`asap-${key}`, `var(--asap-tracking-${key})`]),
      ),
      lineHeight: Object.fromEntries(
        Object.keys(lineHeight).map((key) => [`asap-${key}`, `var(--asap-leading-${key})`]),
      ),
      borderRadius: Object.fromEntries(
        Object.keys(radius).map((key) => [key, `var(--asap-radius-${key})`]),
      ),
      spacing: Object.fromEntries(
        Object.keys(semanticSpacing)
          .filter((key) => key !== "contentMax")
          .map((key) => [kebab(key), `var(--asap-space-${kebab(key)})`]),
      ),
      maxWidth: {
        content: "var(--asap-space-content-max)",
      },
      transitionDuration: {
        fast: "var(--asap-duration-fast)",
        normal: "var(--asap-duration-normal)",
        slow: "var(--asap-duration-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--asap-ease-standard)",
      },
      boxShadow: {
        overlay: "var(--asap-shadow-overlay)",
        hairline: "var(--asap-shadow-hairline)",
      },
    },
  },
} satisfies Config;

export default preset;
export { preset };
