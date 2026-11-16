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

`V drive render-primitives` renders the TaskAction tree with the consumer's `react-dom/server` `renderToStaticMarkup`. It extracts the "Mark done" `<button>` element (excluding the `role="combobox"` StatusSelect trigger, which also has `type="button"` and `w-full`) and asserts `type="button"`, `min-h-touch`, `w-full` on that element only. It also asserts the StatusPill text and `data-slot`, Badge "New", and the `select-trigger` handle. Evidence: `render-primitives.html`. `self-check` re-renders from a /tmp copy whose Button defaults to `submit` and requires the missing `type="button"` failure.

## Gotchas

- Static markup of `StatusSelect` is only the closed trigger: the `select-value` label is client-only under `renderToStaticMarkup` (empty span), so "In progress" proves StatusPill, not StatusSelect. Its value text and `allowed` filtering are not verified here.
- Classes are checked as strings; whether they have CSS is the `consumer-styles` feature.
- No interaction (clicks, menus) is exercised.
