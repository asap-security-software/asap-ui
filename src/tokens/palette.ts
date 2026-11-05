/**
 * Brand anchors from BRAND.md (public site CSS).
 * Surfaces in the `asap` theme use the warmer c-fluid mockup neutrals.
 */
export const brand = {
  red: "#a60e13",
  ink: "#212121",
  success: "#3dc372",
  warning: "#ff9e45",
  danger: "#e44e56",
} as const;

/**
 * Cooler neutrals from serviceasap.com. Kept for reference.
 * The default theme does not use these; it uses the warm paper palette.
 */
export const brandSiteNeutrals = {
  darkGray: "#2d2e33",
  midGray: "#6c6d74",
  lightGray: "#b4b5ba",
  hairline: "#e5e5e7",
  surface: "#f8f8f8",
} as const;

export const colorRoles = [
  "primary",
  "primaryHover",
  "primaryForeground",
  "primarySoft",
  "primaryInk",
  "ink",
  "inkSecondary",
  "muted",
  "mutedSoft",
  "background",
  "surface",
  "surfaceMuted",
  "border",
  "borderSoft",
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
  "overlay",
] as const;

export type ColorRole = (typeof colorRoles)[number];
export type ColorPalette = Record<ColorRole, string>;

/** Light theme. Required default. Hexes for brand roles match BRAND.md. */
export const asapColors: ColorPalette = {
  primary: brand.red,
  primaryHover: "#8c0c10",
  primaryForeground: "#ffffff",
  primarySoft: "#f6ebea",
  primaryInk: "#6d090c",
  ink: brand.ink,
  inkSecondary: "#2e2a27",
  muted: "#6f6862",
  mutedSoft: "#9a928b",
  background: "#f7f4f0",
  surface: "#fffcf9",
  surfaceMuted: "#f3efe9",
  border: "#ebe6e1",
  borderSoft: "#f0ebe6",
  success: brand.success,
  successSoft: "#e5f7ed",
  successForeground: "#146b3a",
  warning: brand.warning,
  warningSoft: "#fff3e6",
  warningForeground: "#8a4e12",
  danger: brand.danger,
  dangerSoft: "#fdecee",
  dangerForeground: "#9d1c28",
  scheduled: "#6f6862",
  scheduledSoft: "#efeae4",
  scheduledForeground: "#4d4843",
  overlay: "rgba(31, 28, 26, 0.28)",
};

/**
 * Opt-in dark palette. Primary is a lifted red so it stays readable on
 * warm-dark paper; the light theme keeps brand red #a60e13.
 */
export const asapDarkColors: ColorPalette = {
  primary: "#ff6b6e",
  primaryHover: "#ff8588",
  primaryForeground: "#1a1714",
  primarySoft: "#3a2222",
  primaryInk: "#ffd0d1",
  ink: "#f6f1eb",
  inkSecondary: "#e4ddd4",
  muted: "#b7aea4",
  mutedSoft: "#8c837a",
  background: "#161311",
  surface: "#221e1b",
  surfaceMuted: "#2c2723",
  border: "#3d362f",
  borderSoft: "#2f2a26",
  success: brand.success,
  successSoft: "#163226",
  successForeground: "#8ee4b0",
  warning: brand.warning,
  warningSoft: "#3a2a18",
  warningForeground: "#ffd0a6",
  danger: "#ff6b72",
  dangerSoft: "#3a1c1e",
  dangerForeground: "#ffc2c5",
  scheduled: "#b7aea4",
  scheduledSoft: "#2c2723",
  scheduledForeground: "#e4ddd4",
  overlay: "rgba(0, 0, 0, 0.55)",
};
