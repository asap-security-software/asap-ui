import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { ease } from "../../src/tokens/motion";
import { brand, brandSiteNeutrals, colorRoles } from "../../src/tokens/palette";
import { radius } from "../../src/tokens/radius";
import { semanticSpacing, spacing } from "../../src/tokens/spacing";
import { renderStylesheet } from "../../src/tokens/stylesheet";
import { asap, asapDark, colorVar, defineTheme, themeToCss } from "../../src/tokens/theme";
import { fontFamily, fontFeature } from "../../src/tokens/typography";

const styles = readFileSync(new URL("../../src/styles.css", import.meta.url), "utf8");
const [lightCss, darkCss] = styles.split('[data-asap-theme="asap-dark"]');

describe("asap theme", () => {
  test("uses the brand hexes on the light theme", () => {
    expect(asap.name).toBe("asap");
    expect(asap.colorScheme).toBe("light");
    expect(asap.colors.primary).toBe(brand.red);
    expect(asap.colors.primary).toBe("#a60e13");
    expect(asap.colors.ink).toBe("#212121");
    expect(asap.colors.success).toBe("#3dc372");
    expect(asap.colors.warning).toBe("#ff9e45");
    expect(asap.colors.danger).toBe("#e44e56");
  });

  test("uses the warm paper surfaces from the mockup", () => {
    expect(asap.colors.background).toBe("#f7f4f0");
    expect(asap.colors.surface).toBe("#fffcf9");
    expect(asap.colors.surfaceMuted).toBe("#f3efe9");
    expect(asap.colors.border).toBe("#ebe6e1");
    expect(asap.colors.primarySoft).toBe("#f6ebea");
  });

  test("keeps the public-site neutrals available but off the default theme", () => {
    expect(brandSiteNeutrals.surface).toBe("#f8f8f8");
    expect(asap.colors.background).not.toBe(brandSiteNeutrals.surface);
  });

  test("ships an opt-in dark palette with the same roles", () => {
    expect(asapDark.name).toBe("asap-dark");
    expect(asapDark.colorScheme).toBe("dark");
    expect(asapDark.colors.background).not.toBe(asap.colors.background);
    for (const role of colorRoles) {
      expect(asapDark.colors[role].length).toBeGreaterThan(0);
    }
  });
});

describe("defineTheme", () => {
  test("overrides a palette and keeps the rest of asap", () => {
    const harbor = defineTheme({
      name: "harbor",
      colors: { primary: "#0b3d91" },
    });
    expect(harbor.colors.primary).toBe("#0b3d91");
    expect(harbor.colors.ink).toBe(asap.colors.ink);
    expect(harbor.colors.background).toBe(asap.colors.background);
    expect(harbor.colorScheme).toBe("light");
  });

  test("can extend the dark theme", () => {
    const night = defineTheme({
      name: "night",
      extends: asapDark,
      colors: { primary: "#ffb4b6" },
    });
    expect(night.colorScheme).toBe("dark");
    expect(night.colors.primary).toBe("#ffb4b6");
    expect(night.colors.background).toBe(asapDark.colors.background);
  });

  test("rejects names that are unsafe in a CSS selector", () => {
    expect(() => defineTheme({ name: "Harbor" })).toThrow(/Theme name/);
    expect(() => defineTheme({ name: "" })).toThrow(/Theme name/);
    expect(() => defineTheme({ name: "harbor light" })).toThrow(/Theme name/);
  });

  test("emits a selector and the overridden color", () => {
    const harbor = defineTheme({ name: "harbor", colors: { primary: "#0b3d91" } });
    const css = themeToCss(harbor);
    expect(css).toContain('[data-asap-theme="harbor"]');
    expect(css).toContain("color-scheme: light");
    expect(css).toContain(`${colorVar("primary")}: #0b3d91`);
    expect(css).toContain(`${colorVar("ink")}: #212121`);
  });
});

describe("scale", () => {
  test("spacing is a 4px grid with mockup semantic sizes", () => {
    expect(spacing[1]).toBe("4px");
    expect(spacing[2]).toBe("8px");
    expect(semanticSpacing.control).toBe("36px");
    expect(semanticSpacing.touch).toBe("52px");
    expect(semanticSpacing.contentMax).toBe("820px");
  });

  test("interactive radius is 9px and mobile actions are 10px", () => {
    expect(radius.md).toBe("9px");
    expect(radius.lg).toBe("10px");
    expect(radius.xl).toBe("12px");
  });

  test("type stack includes Inter, Geist, and tabular figures", () => {
    expect(fontFamily.sans).toContain("Inter");
    expect(fontFamily.sans).toContain("Geist");
    expect(fontFeature.tabular).toContain("tnum");
  });

  test("motion uses the mockup ease", () => {
    expect(ease.standard).toBe("cubic-bezier(0.2, 0.7, 0.2, 1)");
  });
});

describe("styles.css", () => {
  test("light and dark blocks match the typed themes", () => {
    expect(lightCss).toBeDefined();
    expect(darkCss).toBeDefined();
    for (const role of colorRoles) {
      expect(lightCss).toContain(`${colorVar(role)}: ${asap.colors[role]}`);
      expect(darkCss).toContain(`${colorVar(role)}: ${asapDark.colors[role]}`);
    }
  });

  test("maps tokens into the Tailwind v4 theme and exposes the root class", () => {
    const generated = renderStylesheet();
    for (const source of [styles, generated]) {
      expect(source).toContain("@theme");
      expect(source).toContain("--color-primary: var(--asap-color-primary)");
      expect(source).toContain("--radius-md: var(--asap-radius-md)");
      expect(source).toContain(".asap-root");
      expect(source).toContain("prefers-reduced-motion");
    }
  });
});
