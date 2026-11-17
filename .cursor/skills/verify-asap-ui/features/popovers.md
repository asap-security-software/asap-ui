# Popovers: Popover and Tooltip

Consumers open a `Popover` (`role="dialog"` content) by clicking its trigger and close it with Escape. A `Tooltip` shows its note when its trigger gets keyboard focus and hides on Escape.

## Driving it with verify.ts

`V drive popovers` runs a fresh `bun` subprocess (Radix fixes its layout-effect hook at import time). It is a **happy-dom client drive**: the consumer's `react-dom/client` + `act`, DOM from the consumer's `@happy-dom/global-registrator`, components from the packed install, never `src/`. It renders a Popover (trigger `Open schedule`, content `Saturday session note` plus a `Confirm slot` button) and a Tooltip (trigger `Due date`, note `Reminder sent November 8`) with `delayDuration={0}`. Every step asserts `document.activeElement` is the exact expected element (compared by identity) and compares the full observable state with `===`: Popover trigger `aria-expanded` and `data-state`, content count, `role` and child texts, Tooltip content count, `data-state`, `role="tooltip"` text and whether the trigger's `aria-describedby` points at it.

1. initial: everything closed, focus on `BODY`.
2. Tab goes to the Popover trigger.
3. Click opens: `aria-expanded="true"`, `data-state="open"`, one `dialog` with `Saturday session note|Confirm slot`, focus on `Confirm slot`.
4. Tab inside the open popover: focus stays on `Confirm slot` (Radix loops focus inside).
5. Escape: closed, no content left in the DOM, focus back on the trigger.
6. Tab goes to the Tooltip trigger: tooltip shown (`data-state="instant-open"`, text `Reminder sent November 8`, described by the trigger), focus on `Due date`.
7. Escape: tooltip gone, focus still on the `Due date` trigger.

Every label is unique, so no step passes on text an earlier step showed. Keys are synthesized: the driver dispatches a `keydown` on the focused element and, for Tab only if nothing called `preventDefault`, moves focus to the next button. The popover is opened with `click()`. happy-dom has no native Tab, Escape or focus handling, so this proves the packed components' handlers, cancellation and focus return, not native browser behaviour. Evidence: `popovers-client.json` (every step's state).

`self-check` re-runs the journey against throwaway consumers whose `dist/index.js` is mutated and requires a non-zero failure with a distinctive message (nine rejects): Popover never opens, not closed by Escape, stale open copy left after Escape, focus not returned to the trigger, focus returned to the wrong element, wrong content; Tooltip never shows, still visible after Escape, wrong content.

## Gotchas

- Focus moves rely on Radix `setTimeout`s, so the driver waits 30 ms after each key.
- Hover, pointer-leave, outside-click close, `delayDuration` timing, side/align positioning and Tooltip content when the Popover is open are not exercised.
