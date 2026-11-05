/** 4px grid. Tailwind's default spacing scale matches these steps. */
export const spacing = {
  0: "0px",
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

/** Sizes taken from the c-fluid mockup (controls, touch targets, page column). */
export const semanticSpacing = {
  controlSm: "30px",
  control: "36px",
  controlLg: "44px",
  touch: "52px",
  touchMin: "48px",
  page: "28px",
  contentMax: "820px",
} as const;

export type SpacingToken = keyof typeof spacing;
export type SemanticSpacingToken = keyof typeof semanticSpacing;
