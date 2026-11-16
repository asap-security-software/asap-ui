# Tokens and theming

Server or build code imports `@asap-security-software/ui/tokens` (no React) to read the design tokens and build a theme with `defineTheme`, then emits CSS with `themeToCss`.

## Sub-features

- `themeToCss(asap)` contains the brand colors `#a60e13`, `#212121`, `#3dc372`, `#ff9e45`, `#e44e56`.
- `defineTheme({ name: "harbor", colors: { primary, primaryHover } })` appears in `themeToCss` under `[data-asap-theme="harbor"]` with the overrides.

## How to get to it (user POV)

`import { asap, defineTheme, themeToCss } from "@asap-security-software/ui/tokens"`, inject `themeToCss(harbor)` once, set `data-asap-theme="harbor"` on a wrapper.

## Driving it with verify.ts

`V drive tokens-theme` loads the installed `/tokens` entry from the consumer dir, builds the README harbor theme (`#0b3d91`, `#082f73`) and asserts both outputs. Evidence: `theme-asap.css`, `theme-harbor.css`.

## Gotchas

- Only the primary/primaryHover overrides are exercised; theme-name validation (lowercase, digits, hyphens) and `asapDark` are not.
- Asserts the brand colors via `asap`; the compiled `dist/styles.css` colors are covered by `published-exports` (verify-dist).
