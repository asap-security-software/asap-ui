# Published exports

A consumer installs the package and can import from four entry points. The main entry is a client module (`"use client"`), the tokens entry is not, and the package is publishable to GitHub Packages as restricted.

## Sub-features

- `@asap-security-software/ui` resolves to `dist/index.js` and starts with `use client`.
- `@asap-security-software/ui/tokens` resolves and has no `use client`.
- `@asap-security-software/ui/tailwind-preset` and `/styles.css` resolve.
- `publishConfig` registry `https://npm.pkg.github.com`, access `restricted`, not `private`.

## How to get to it (user POV)

`bun add @asap-security-software/ui` (with the GitHub Packages `.npmrc`), then `import { Button } from "@asap-security-software/ui"` and `import { defineTheme } from "@asap-security-software/ui/tokens"`.

## Driving it with verify.ts

`V drive published-exports` calls `bun scripts/verify-dist.ts` (dist files, client boundary, publishConfig, exports map), resolves all four specifiers from the installed consumer, and checks the installed entry/tokens directive. Evidence: `verify-dist.log`, `exports.json`.

## Gotchas

- Needs a prior `V launch` (the tarball is the surface); without CURRENT the drive fails with "run `launch` first".
- The consumer is an extracted tarball with symlinked deps, not a registry install: it proves the packed contents, not registry delivery.
- `verify-dist.ts` reads `dist/` relative to the cwd, so run from the repo root.
