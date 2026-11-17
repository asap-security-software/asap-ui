# Feature map: @asap-security-software/ui

Features a consumer touches, from the public exports (`.`, `./tokens`, `./tailwind-preset`, `./styles.css`) and the README. Drive each with `V drive <name>` after `V launch` (see `../SKILL.md`).

| Feature                                             | File                   | Drive name          |
| --------------------------------------------------- | ---------------------- | ------------------- |
| Published exports and build shape                   | `published-exports.md` | `published-exports` |
| Consumer styles via `@source`                       | `consumer-styles.md`   | `consumer-styles`   |
| Primitives: Button, Badge, StatusPill, StatusSelect | `render-primitives.md` | `render-primitives` |
| Tokens and theming                                  | `tokens-theme.md`      | `tokens-theme`      |
| Form controls: Input, Checkbox, Switch (touch)      | `form-controls.md`     | `form-controls`     |
| Overlays: Dialog and Sheet open, Escape, focus      | `overlays.md`          | `overlays`          |
| Menus: DropdownMenu and Select keyboard choice      | `menus.md`             | `menus`             |
| Popovers: Popover and Tooltip open state            | `popovers.md`          | `popovers`          |
| Tabs and Table: arrow-key tabs and header sort      | `tabs-table.md`        | `tabs-table`        |

`render-primitives` also client-renders `StatusSelect` (happy-dom) to prove its selected value; static markup cannot show that label.

Not covered: Storybook, Playwright visual tests, and interactive Radix behavior other than Dialog, Sheet, DropdownMenu, Select, Popover, Tooltip and Tabs (ArrowRight, disabled skip), and Table header sort (Enter).
