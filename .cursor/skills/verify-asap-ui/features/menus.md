# Menus: DropdownMenu and Select

Consumers open a `DropdownMenu` (`role="menu"`, `role="menuitem"` items) or a `Select` (`role="listbox"`, `role="option"` items, trigger `role="combobox"`) from a trigger and choose an item with the keyboard.

## Driving it with verify.ts

`V drive menus` runs a fresh `bun` subprocess (Radix fixes its layout-effect hook at import time). It is a **happy-dom client drive**: the consumer's `react-dom/client` + `act`, DOM from the consumer's `@happy-dom/global-registrator`, components from the packed install, never `src/`. For `dropdown`, then `select`, it renders one trigger and three items and walks these steps. Every step asserts `document.activeElement` is the exact expected element (compared by identity) and compares the full observable state with `===`: trigger `aria-expanded`, `data-state` and text, content count and `role`, the item names in order, which items carry `data-highlighted`, which carry `data-state="checked"`, and the chosen result.

1. initial: closed, focus on `BODY`.
2. Tab goes to the trigger (`Open actions` / `Pick a priority`).
3. Enter opens: content shown, focus and highlight on the first item (`Rename draft` / `Low urgency`).
4. Tab inside the open content: focus stays on the first item (Radix cancels Tab).
5. ArrowDown: focus and highlight on the second item (`Archive draft` / `High urgency`), nothing chosen yet.
6. Enter chooses it: closed, result `archive` / `high`, the Select trigger text becomes `High urgency`, focus back on the trigger.
7. Reopen (Enter on the menu: first item highlighted, not the one chosen before; ArrowDown on the Select: the chosen option is focused, highlighted and `checked`).
8. Escape: closed, result and trigger text unchanged, focus on the trigger.

Menu and Select use different labels and values, so neither can pass on the other's text; item names of one widget necessarily recur when it reopens. Keys are synthesized: the driver dispatches a `keydown` on the focused element and, for Tab only if nothing called `preventDefault`, moves focus to the next button. happy-dom has no native Tab, Space, Arrow or Enter, so this proves the packed components' key handlers, cancellation and focus return, not native browser key behaviour. Evidence: `menus-client.json` (every step's state for both widgets).

`self-check` re-runs the journey against throwaway consumers whose `dist/index.js` is mutated and requires a non-zero failure with a distinctive message (eleven rejects). DropdownMenu: never opens, item action does not run, still open after selection, still open after Escape, focus not returned to the trigger, reopens on the previously chosen item. Select: never opens, value does not change, wrong item chosen, still open after Escape, focus not returned to the trigger.

## Gotchas

- Focus moves rely on Radix `setTimeout`s, so the driver waits 30 ms after each key.
- Space, typeahead, Home/End, checkbox and radio menu items, submenus, pointer opening, `position="item-aligned"` and popover/tooltip open state are not exercised.
