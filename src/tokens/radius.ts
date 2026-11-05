/**
 * Interactive controls sit at 9–10px (c-fluid `--radius: 9px`, mobile actions 10px).
 * Cards and toasts use 12px. Pills are fully round.
 */
export const radius = {
  xs: "5px",
  sm: "7px",
  md: "9px",
  lg: "10px",
  xl: "12px",
  full: "999px",
} as const;

export type RadiusToken = keyof typeof radius;
