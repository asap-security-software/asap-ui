---

name: verify-asap-ui
description: Verify @asap-security-software/ui, a published React/Tailwind v4 component library consumed via four public exports (".", "./tokens", "./tailwind-preset", "./styles.css"). Builds the package, installs the packed tarball into a throwaway consumer, renders components and checks markup/CSS. Use before changing exports, styles, tokens, or consumer-facing components.
---

# verify-asap-ui

No server exists. The surface is the packed package as a consumer sees it. Do NOT use Storybook (`bun run dev`, port 6006) or Playwright. Run everything from the repo root; helper: `bun .cursor/skills/verify-asap-ui/scripts/verify.ts <cmd>` (call it `V` below).

## Launch

`V launch` — runs `bun run build` (which already runs `scripts/verify-dist.ts` → `scripts/verify-consumer.ts`), `bun pm pack` into a throwaway dir `$TMPDIR/asap-ui-verify-<id>-XXXX`, extracts the tarball to `node_modules/@asap-security-software/ui` there, and symlinks react, react-dom, tailwindcss, radix etc. from this repo's `node_modules` (no network, nothing from GitHub Packages). It then resolves all four exports from the consumer and smoke-renders the README TaskAction example.

Ready = last line `READY run=<id> consumer=<dir> evidence=<dir>`, and `runs/CURRENT` (JSON: id, runDir, consumer, smoke, smokeSha256) exists. A bare `bun run build` exit 0 is not ready. Launch refuses when CURRENT points at an existing consumer (`run cleanup first`); it replaces CURRENT only if that scratch dir is already gone. A failed launch removes its own consumer dir and keeps its logs.

## Doctor

`V doctor` — read-only. Checks CURRENT, consumer present, the four exports resolve inside the consumer, the smoke file is non-empty and matches the recorded sha256, and `bun scripts/verify-dist.ts` passes. Never looks up processes. Non-zero exit = do not drive; fix or `V cleanup` then `V launch`.

## Drive

`V drive <feature>` where feature is one of `published-exports`, `consumer-styles`, `render-primitives`, `tokens-theme` (see `features/README.md`). Modules are resolved from the consumer dir (`@asap-security-software/ui`, `/tokens`, ...), never from `src/`. It renders with `react-dom/server` `renderToStaticMarkup` and asserts visible text and attributes (stable handles: exported component names, text, `data-slot`, `type`). CSS compilation is delegated to `scripts/verify-consumer.ts`; do not reimplement it.

## Evidence

Everything goes to `.cursor/skills/verify-asap-ui/runs/<id>/evidence/` (gitignored, never commit): `build.log`, `pack.log`, `install.log`, `smoke.html`, plus per feature `verify-dist.log`/`exports.json`, `verify-consumer.log`/`styles-source.txt`, `render-primitives.html`, `theme-asap.css`/`theme-harbor.css`. Read the files, not only the exit code: markup for rendered output, CSS for tokens, logs for build side effects.

## Cleanup

`V cleanup` — deletes only the consumer dir recorded in CURRENT (and only if it is `$TMPDIR/asap-ui-verify-<id>-*`) and CURRENT itself. `runs/<id>/evidence/` is kept. Run it after every failed or finished run so no temp dirs are stranded.

## Helpers

- `V prove [feature]` — launch, doctor, drive (default `render-primitives`), cleanup, then confirms evidence survived. Refuses if CURRENT already exists; only cleans a run it started.
- `V self-check` — proves the skill can fail. In a `$TMPDIR` copy (repo untouched) it rejects: missing `use client`, emptied `dist/styles.css`, missing `dist/index.js`, brand red stripped from styles, an empty render, a Button defaulting to submit, and a missing types file named by `exports[*].types`, by a nested condition (`exports["."].import.types`), or by top-level `types`/`typings`; then re-checks the real tree. Needs a prior `bun run build`; leaves no CURRENT, consumer or temp dir.
- `V check-markup <file> [needle...]` — internal: exits non-zero if the file is empty or lacks a needle.

Script is executable (`chmod +x`), dependency-free, no Playwright/Chrome.
