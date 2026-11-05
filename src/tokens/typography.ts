/**
 * Inter is what the mockups load. Geist is an accepted alternate:
 * the stack falls through if a product loads Geist and not Inter.
 * Consumers load the font; this package does not ship font files.
 */
export const fontFamily = {
  sans: '"Inter Variable", "Inter", "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/** Desktop body is 14px. Mobile titles step up to 22–24px. */
export const fontSize = {
  "2xs": "11px",
  xs: "12px",
  sm: "13px",
  base: "14px",
  md: "15px",
  lg: "16px",
  xl: "17px",
  "2xl": "22px",
  "3xl": "24px",
} as const;

export const lineHeight = {
  tight: "1.25",
  snug: "1.35",
  normal: "1.45",
} as const;

export const letterSpacing = {
  tight: "-0.02em",
  snug: "-0.011em",
  normal: "0em",
  wide: "0.05em",
  eyebrow: "0.07em",
} as const;

/** Dates and counts use tabular figures, matching the mockup due-date column. */
export const fontFeature = {
  tabular: '"tnum" 1',
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  fontFeature,
} as const;
