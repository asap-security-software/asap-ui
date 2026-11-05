import {
  asapColors,
  asapDarkColors,
  type ColorPalette,
  type ColorRole,
  colorRoles,
} from "./palette";

const THEME_NAME = /^[a-z0-9][a-z0-9-]*$/;

export interface ThemeDefinition {
  /** Value for `data-asap-theme`. Lowercase letters, digits, and hyphens. */
  name: string;
  colorScheme: "light" | "dark";
  colors: ColorPalette;
}

export const asap: ThemeDefinition = {
  name: "asap",
  colorScheme: "light",
  colors: asapColors,
};

export const asapDark: ThemeDefinition = {
  name: "asap-dark",
  colorScheme: "dark",
  colors: asapDarkColors,
};

export interface DefineThemeInput {
  name: string;
  /** Palette to copy before applying `colors`. Defaults to the light `asap` theme. */
  extends?: ThemeDefinition;
  colorScheme?: "light" | "dark";
  /** Partial palette override. Omitted roles keep the base theme's values. */
  colors?: Partial<ColorPalette>;
}

/**
 * Define a product theme as a palette override.
 *
 * ```ts
 * const harbor = defineTheme({
 *   name: "harbor",
 *   colors: { primary: "#0b3d91", primaryHover: "#082f73" },
 * });
 * ```
 *
 * Inject `themeToCss(harbor)` and set `data-asap-theme="harbor"`.
 * Spacing, radius, type, and motion stay on the shared scale.
 */
export function defineTheme(input: DefineThemeInput): ThemeDefinition {
  if (!THEME_NAME.test(input.name)) {
    throw new Error(
      `Theme name "${input.name}" must start with a letter or digit and contain only lowercase letters, digits, and hyphens.`,
    );
  }

  const base = input.extends ?? asap;
  const colors: ColorPalette = { ...base.colors };
  if (input.colors) {
    for (const role of colorRoles) {
      const value = input.colors[role];
      if (value !== undefined) {
        colors[role] = value;
      }
    }
  }

  return {
    name: input.name,
    colorScheme: input.colorScheme ?? base.colorScheme,
    colors,
  };
}

export function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function colorVar(role: ColorRole): string {
  return `--asap-color-${kebab(role)}`;
}

/** CSS custom properties for one theme. Default selector is `[data-asap-theme="<name>"]`. */
export function themeToCss(theme: ThemeDefinition, selector?: string): string {
  const target = selector ?? `[data-asap-theme="${theme.name}"]`;
  const lines = colorRoles.map((role) => `  ${colorVar(role)}: ${theme.colors[role]};`);
  return `${target} {\n  color-scheme: ${theme.colorScheme};\n${lines.join("\n")}\n}\n`;
}
