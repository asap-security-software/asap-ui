# Tabs and Table: keyboard and sort

Consumers move between `Tabs` triggers with the arrow keys (a disabled trigger is skipped) and sort a `Table` by pressing a sortable header button. `TableHead` is a controlled sort API: `sortable`, `sort`, `onSort`, plus the exported `nextSortDirection` (first click ascending, a later click on ascending goes descending).

## Driving it with verify.ts

`V drive tabs-table` runs a fresh `bun` subprocess (Radix fixes its layout-effect hook at import time). It is a **happy-dom client drive**: the consumer's `react-dom/client` + `act`, DOM from the consumer's `@happy-dom/global-registrator`, components from the packed install, never `src/`. It renders Tabs `Overview`, `Archive` (disabled), `Billing`, `Members`; the Members panel holds a Table (`Customer` and `Plan` sortable headers) driven by a small stateful consumer that keeps the sort state, calls the packed `nextSortDirection` in `onSort`, re-renders and really reorders the rows. Every step asserts `document.activeElement` is the exact expected element (by identity) and compares the full observable state with `===`: selected and disabled tab labels, shown panel count and note, each header's `aria-sort`, row id order, row cell text, and that every row is the same DOM node as when first seen (rows are moved, not rebuilt).

1. initial: `Overview` selected, `Archive` disabled, one panel `Quarterly plan summary`, focus on `BODY`.
2. Tab goes into the tab list: focus on `Overview`.
3. ArrowRight skips the disabled `Archive`: `Billing` selected, panel `Invoices settle every Friday`, focus on `Billing`.
4. ArrowRight: `Members` selected, panel `Seven seats assigned`, both headers `none`, rows `orion|cobalt|delta` (`Orion Freight,Zinc|Cobalt Dairy,Opal|Delta Mills,Birch`), focus on `Members`.
5. Tab goes to the `Customer` header button.
6. Enter: `Customer` is `ascending`, rows `cobalt|delta|orion`, focus on `Customer`.
7. Enter: `Customer` is `descending`, rows `orion|delta|cobalt`.
8. Tab goes to the `Plan` header button (`Customer` stays `descending`).
9. Enter: `Plan` is `ascending`, `Customer` back to `none`, rows `delta|cobalt|orion`, focus on `Plan`.

Labels, panel notes and cells are all different, and each sort step has its own row order, so no step passes on state an earlier one showed. Keys are synthesized: the driver dispatches a `keydown` on the focused element; for Tab, if nothing called `preventDefault`, it moves focus to the next enabled button or tab list (Radix hands the list's focus to the selected tab); for Enter on a button it calls `click()` the same way. happy-dom has no native Tab, Arrow, Enter or focus handling, so this proves the packed components' handlers, selection, sort wiring and focus, not native browser behaviour. Evidence: `tabs-table-client.json` (every step's state).

`self-check` re-runs the journey against throwaway consumers whose `dist/index.js` is mutated and requires a non-zero failure with a distinctive message (nine rejects): a tab that does not move on ArrowRight, a selected disabled trigger, the previous panel still shown, focus on the wrong element after ArrowRight, wrong panel content, `aria-sort` unchanged after Enter, focus on the wrong element after Enter, rows that do not reorder, an unsorted column reported as sorted.

## Gotchas

- Focus moves rely on Radix `setTimeout`s, so the driver waits 30 ms after each key.
- Radix keeps inactive panels in the DOM with `hidden`, so the journey counts only visible panels.
- ArrowLeft, Home/End, vertical orientation, manual activation, footer/caption and `size="touch"` styling are not exercised.
