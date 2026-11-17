# Form controls

Consumers render `Input`, `Checkbox` and `Switch` from the main entry, usually at `size="touch"` on field devices.

## Sub-features

- `Input size="touch"`: `data-slot="input"`, class `min-h-touch` (from `fieldControlVariants`).
- `Checkbox size="touch"`: `data-slot="checkbox"`, `role="checkbox"`, class `size-touch`.
- `Switch size="touch"`: `data-slot="switch"`, `role="switch"`, class `size-touch`.

## Driving it with verify.ts

`V drive form-controls` runs a fresh `bun` subprocess (Radix fixes its layout-effect hook at import time, same as StatusSelect). It client-renders the three controls with labels (consumer's `react-dom/client` + `act`, DOM from the consumer's `@happy-dom/global-registrator`) and first requires each control element (found by `data-slot`, exactly one) to carry its touch class. Then it drives them like a user, focusing the control first:

1. type `kestrel-7041` into the Input (one input event per key),
2. type `magnolia-2285` (replaces the first; neither token contains the other),
3. click the Checkbox, 4. synthesized Space on the Checkbox, 5. click the Switch, 6. synthesized Space on the Switch.

After every step it asserts with `===` the Input value and type, `role`, `aria-checked`, `data-state` and the accessible name (`label[for]` text) of all three controls, and that `document.activeElement` is the control just driven. Space is synthesized: the driver dispatches keydown+keyup, then calls `click()` only if neither event was cancelled. This proves the click path, focus, and that cancellation is honored; it does not prove native Space-to-click in a real browser. Evidence: `form-controls-client.json` (every step's state and the controls' outerHTML).

`self-check` re-runs the same journey against throwaway consumers whose `dist/index.js` is mutated, and requires a non-zero failure with a distinctive message for: a missing control, a removed touch class (Input, Checkbox, Switch), a wrong Input value, a leftover first value when the second is required, a Checkbox or Switch that never toggles, a Checkbox with the wrong role, focus lost after a Switch click, a Checkbox whose Space keydown calls `preventDefault`, and a Switch whose Space keydown calls `preventDefault` (twelve rejects in all).

## Gotchas

- Class checks are strings on the control element; whether the class has CSS is `consumer-styles`.
- Keyboard focus rings, `disabled`, indeterminate and form submission are not exercised.
