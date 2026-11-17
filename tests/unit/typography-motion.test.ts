import { describe, expect, test } from "bun:test";
import { duration, ease, shadow } from "../../src/tokens/motion";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "../../src/tokens/typography";

describe("type scale", () => {
  test("pins the full font size scale", () => {
    expect(fontSize).toEqual({
      "2xs": "11px",
      xs: "12px",
      sm: "13px",
      base: "14px",
      md: "15px",
      lg: "16px",
      xl: "17px",
      "2xl": "22px",
      "3xl": "24px",
    });
  });

  test("keeps desktop body at 14px and the mobile title at 24px", () => {
    expect(fontSize.base).toBe("14px");
    expect(fontSize["3xl"]).toBe("24px");
  });

  test("pins the font weights", () => {
    expect(fontWeight).toEqual({
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    });
  });

  test("pins line heights", () => {
    expect(lineHeight).toEqual({
      tight: "1.25",
      snug: "1.35",
      normal: "1.45",
    });
  });

  test("pins letter spacing", () => {
    expect(letterSpacing).toEqual({
      tight: "-0.02em",
      snug: "-0.011em",
      normal: "0em",
      wide: "0.05em",
      eyebrow: "0.07em",
    });
  });
});

describe("motion", () => {
  test("pins the duration scale", () => {
    expect(duration).toEqual({
      instant: "0ms",
      fast: "160ms",
      normal: "200ms",
      slow: "240ms",
      drawer: "260ms",
    });
  });

  test("pins the easing curves", () => {
    expect(ease).toEqual({
      standard: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      press: "cubic-bezier(0.3, 0, 0.2, 1)",
    });
  });
});

describe("elevation", () => {
  test("pins the hairline and overlay shadows", () => {
    expect(shadow).toEqual({
      none: "none",
      hairline: "0 0 0 1px var(--asap-color-border)",
      overlay: "0 4px 16px rgba(31, 28, 26, 0.08)",
    });
  });
});
