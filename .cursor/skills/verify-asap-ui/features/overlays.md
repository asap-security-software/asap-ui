# Overlays: Dialog and Sheet

Consumers open a `Dialog` or `Sheet` (a Radix dialog, `side="right"` by default) from a trigger button. Both render `data-slot="dialog-content"` / `data-slot="sheet-content"` with `role="dialog"`, a title, a description and a `Close` button (`aria-label="Close"`).

## Driving it with verify.ts

`V drive overlays` runs a fresh `bun` subprocess (Radix fixes its layout-effect hook at import time). It is a **happy-dom client drive**: the consumer's `react-dom/client` + `act`, DOM from the consumer's `@happy-dom/global-registrator`, components from the packed install, never `src/`. For `dialog`, then `sheet`, it renders a trigger, two buttons inside the content and one button outside it, and walks these steps. Every step asserts `document.activeElement` is the exact expected element (compared by identity), and compares the full observable state with `===`: trigger `aria-expanded` and `data-state`, overlay `data-state`, count, `role`, accessible name (the `aria-labelledby` title text) and description (`aria-describedby` text).

1. initial: closed, focus on `BODY`.
2. focus the trigger (`Open dialog`).
3. click it: open, name `Review dialog heading`, description `The dialog body copy`, focus on the first action.
4. every Tab stop: Tab to the second action, Tab to `Close`, Tab wraps to the first action, then Shift+Tab wraps to `Close`, to the second action, to the first. Focus must stay inside the content at each stop.
5. Escape: closed, no overlay left in the DOM, focus back on the trigger.

All texts are per-overlay (`sheet` uses `Open sheet`, `Review sheet heading`, ...), so no step can pass on text shown earlier. Tab is synthesized: the driver dispatches a `keydown` Tab and, only if nothing called `preventDefault` (Radix does at the edges), moves focus to the next tabbable in document order, wrapping. happy-dom has no native Tab, so this proves the focus trap's wrap and the focus return, not browser Tab behaviour. Evidence: `overlays-client.json` (every step's state for both overlays).

`self-check` re-runs the journey against throwaway consumers whose `dist/index.js` is mutated and requires a non-zero failure with a distinctive message, for both `Dialog` and `Sheet` (twelve rejects): a missing overlay (`overlay not rendered after click`), Escape that does not close (`did not close on Escape`), a stale open overlay left after close (`still open after close`), focus not returned to the trigger (`focus is "BODY", expected "Open dialog"`), focus escaping the trap (`focus escaped the trap`), and wrong content (the `Close` button renamed).

## Gotchas

- Focus return relies on Radix's `setTimeout`, so the driver waits 30 ms after each action.
- Modal pointer blocking, scroll lock, `DialogClose` / the `Close` button click, `modal={false}`, `side` variants and animations are not exercised.
