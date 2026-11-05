/** Durations and the c-fluid ease. No spring, no long fades. */
export const duration = {
  instant: "0ms",
  fast: "160ms",
  normal: "200ms",
  slow: "240ms",
  drawer: "260ms",
} as const;

export const ease = {
  standard: "cubic-bezier(0.2, 0.7, 0.2, 1)",
  press: "cubic-bezier(0.3, 0, 0.2, 1)",
} as const;

/**
 * Elevation is a hairline, not a shadow.
 * `overlay` is the only soft shadow, reserved for floating menus
 * (the mockup listbox uses this exact value).
 */
export const shadow = {
  none: "none",
  hairline: "0 0 0 1px var(--asap-color-border)",
  overlay: "0 4px 16px rgba(31, 28, 26, 0.08)",
} as const;

export const motion = {
  duration,
  ease,
  shadow,
} as const;
