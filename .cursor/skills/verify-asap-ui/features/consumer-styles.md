# Consumer styles

A consumer CSS entry that only does `@import "tailwindcss"; @import "@asap-security-software/ui/styles.css";` gets the theme and the utilities used by the components, because the published stylesheet contains `@source "./index.js"`.

## Sub-features

- Component utilities emitted from `dist/index.js` (`.bg-primary`, `.min-h-touch`, `.bg-success-soft`, `.shadow-overlay`, `.text-asap-sm`, `animate-drawer-right`).
- Isolation: with the `@source` line stripped, those utilities must disappear.

## How to get to it (user POV)

Put the two `@import` lines in the app CSS entry; do not add a `node_modules` `@source` path.

## Driving it with verify.ts

`V drive consumer-styles` runs `bun scripts/verify-consumer.ts` (Tailwind compile via `@tailwindcss/node` with `source(none)`; reused, not reimplemented) and confirms the installed `styles.css` still contains `@source "./index.js"`. Evidence: `verify-consumer.log`, `styles-source.txt`.

## Gotchas

- The compile in `verify-consumer.ts` targets the repo's `dist/styles.css`; the installed copy is only checked for the `@source` line.
- If `dist/` is missing or stale the check fails; run `V launch` (it rebuilds).
