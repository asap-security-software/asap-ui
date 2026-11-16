# Render primitives

Consumers render `Button`, `Badge`, `StatusPill` and `StatusSelect` from the main entry, e.g. the README TaskAction: a progress pill, a status select, and a full-width 52px "Mark done" button.

## Sub-features

- `StatusPill status="progress"`: `data-slot="status-pill"` with the visible text and a dot.
- `Button size="touch" className="w-full"`: `type="button"` by default, `min-h-touch`, `w-full`.
- `Badge`: `data-slot="badge"` with text.
- `StatusSelect`: a `data-slot="select-trigger"` combobox with `aria-label="Status"`.

## How to get to it (user POV)

`import { Badge, Button, StatusPill, StatusSelect } from "@asap-security-software/ui"` in a component under `TooltipProvider`.

## Driving it with verify.ts

`V drive render-primitives` renders the TaskAction tree with the consumer's `react-dom/server` `renderToStaticMarkup` and asserts the texts "In progress", "Mark done", "New", `type="button"`, `min-h-touch`, `w-full`, and the `data-slot` handles. Evidence: `render-primitives.html`.

## Gotchas

- Static markup of `StatusSelect` is only the closed trigger: Radix Select renders no selected label or options on the server, so its value text and `allowed` filtering are not verified here.
- Classes are checked as strings; whether they have CSS is the `consumer-styles` feature.
- No interaction (clicks, menus) is exercised.
