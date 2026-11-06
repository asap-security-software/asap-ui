# @asap-security-software/ui

Shared React component library for ASAP Security. ProjectView (Next.js on Bun) is the first consumer. Later apps reuse the same components and swap the palette.

0.1.0 (tokens, Button, Badge, Select) is published to GitHub Packages from the `v0.1.0` tag. 0.2.0 adds the core components ProjectView needs. It is not published until a `v0.2.0` tag is pushed.

## Install

The package is private to the `asap-security-software` GitHub account and is published to GitHub Packages. It is not on the public npm registry.

In the app, add `.npmrc`:

```
@asap-security-software:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` is a GitHub personal access token (or `GITHUB_TOKEN` in Actions) with `read:packages`. Do not commit the token.

```sh
bun add @asap-security-software/ui
```

Peer dependencies: `react` and `react-dom` 19, and `tailwindcss` 4.

## Use

In the app CSS entry, so Tailwind processes the theme. Component classes are picked up by `@source "./index.js"` inside the published stylesheet (it sits next to `dist/index.js`). You do not add a `node_modules` path of your own.

```css
@import "tailwindcss";
@import "@asap-security-software/ui/styles.css";
```

Add your own `@source` only for class strings that live outside this package.

```tsx
import { Button, StatusPill, StatusSelect } from "@asap-security-software/ui";

export function TaskAction() {
  return (
    <>
      <StatusPill status="progress">In progress</StatusPill>
      <StatusSelect
        value="progress"
        options={[
          { value: "progress", label: "In progress", tone: "progress" },
          { value: "done", label: "Done", tone: "done" },
        ]}
        allowed={["done"]}
        onValueChange={() => {}}
      />
      <Button size="touch" className="w-full">
        Mark done
      </Button>
    </>
  );
}
```

`StatusSelect` only lists the current status and the `allowed` moves. Wrap the app once in `TooltipProvider`, and mount `Toaster` where toasts should show. `toastWithUndo(message, onUndo)` is the toast with an Undo action.

Form controls default to 44px (`lg`). Pass `size="touch"` for the 52px technician target on Input, Textarea, Select, StatusSelect, Button, Checkbox, Switch, Tabs, DropdownMenu, and Table.

Put `className="asap-root"` on the app shell if you want the Inter/Geist stack, ink color, paper background, and tabular figures. Load Inter (or Geist) yourself. This package does not ship font files.

Server code that only needs tokens should import `@asap-security-software/ui/tokens`. The main entry is a client module because the primitives use Radix.

### Exports

| Import                                       | What it is                                          |
| -------------------------------------------- | --------------------------------------------------- |
| `@asap-security-software/ui`                 | Components, `cn`, and the token objects             |
| `@asap-security-software/ui/tokens`          | Tokens and `defineTheme` / `themeToCss`, no React   |
| `@asap-security-software/ui/tailwind-preset` | Tailwind JS preset, if the app still uses `@config` |
| `@asap-security-software/ui/styles.css`      | CSS variables and the Tailwind v4 `@theme` block    |

Prefer `styles.css`. The JS preset is the same token map for a `presets: []` config.

## Theming

`asap` is the default light theme, applied on `:root`. Brand roles use the public-site colors: red `#a60e13`, ink `#212121`, success `#3dc372`, warning `#ff9e45`, danger `#e44e56`. Surfaces are the warm paper from the ProjectView mockups (`#f7f4f0`, `#fffcf9`), not the cooler site grays.

Dark mode is opt-in. The token shape is the same; the primary red is lifted so it stays readable on dark paper.

```html
<html data-asap-theme="asap-dark">
```

A future app overrides the palette without forking components. `defineTheme` copies `asap`, then applies `colors`. Spacing, radius, type, and motion stay shared.

```ts
import { defineTheme, themeToCss } from "@asap-security-software/ui/tokens";

export const harbor = defineTheme({
  name: "harbor",
  colors: {
    primary: "#0b3d91",
    primaryHover: "#082f73",
    primarySoft: "#e7eef8",
    primaryInk: "#082456",
  },
});

// Inject themeToCss(harbor) once (a <style> tag or a generated CSS file).
```

```html
<div data-asap-theme="harbor">...</div>
```

Pass `extends: asapDark` to start from the dark palette. Set `colorScheme` when the result should not inherit it. Theme names are lowercase letters, digits, and hyphens, because they land in a CSS attribute selector.

The same override can be written by hand:

```css
[data-asap-theme="harbor"] {
  color-scheme: light;
  --asap-color-primary: #0b3d91;
  --asap-color-primary-hover: #082f73;
  --asap-color-primary-soft: #e7eef8;
  --asap-color-primary-ink: #082456;
}
```

## Design

Soft and plain. Interactive radius is 9px (10px on the large mobile actions). No gradients, glass, or heavy shadows. Floating menus use a hairline and one soft overlay shadow. Status is a tinted pill with a dot. Metadata sits next to the title. Technician actions use the `touch` size: 52px tall, full width, plain words ("Start", "Mark done").

## Commands

```sh
bun run dev            # Storybook on port 6006
bun run test           # bun:test for behavior, tokens, and cn()
bun run typecheck
bun run lint           # Biome
bun run format
bun run build          # ESM, types, dist/styles.css
bun run build-storybook
bun run test:visual    # Playwright scaffold; not part of CI
```

`bun run emit:css` rewrites `src/styles.css` from the TypeScript tokens. Edit the tokens, then emit. Do not hand-edit the CSS file.

## Storybook

`bun run dev` serves the catalog on port 6006. That process is only on your machine.

The hosted Storybook is public at https://asap-security-software.github.io/asap-ui/. `.github/workflows/storybook-pages.yml` publishes it on every push to `main`. The site is the production Storybook build only. It does not include secrets or environment values.

## Release

Pushing a `v*.*.*` tag runs `.github/workflows/release.yml`, which publishes to `https://npm.pkg.github.com` with `GITHUB_TOKEN`. Pull requests do not publish.

`v0.1.0` published `@asap-security-software/ui@0.1.0`. Do not tag 0.2.0 from this branch.
