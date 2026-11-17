import { describe, expect, test } from "bun:test";
import { buttonVariants } from "../../src/components/ui/button";

type Options = NonNullable<Parameters<typeof buttonVariants>[0]>;

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold tracking-asap-snug transition-colors duration-fast ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const primary = "bg-primary text-primary-foreground hover:bg-primary-hover";
const md = "h-control px-3.5 text-asap-sm";

const intents: [NonNullable<Options["variant"]>, string][] = [
  ["primary", primary],
  ["secondary", "bg-ink-secondary text-primary-foreground hover:bg-ink"],
  ["outline", "border border-border bg-surface text-ink hover:bg-surface-muted"],
  ["ghost", "bg-transparent text-ink hover:bg-surface-muted"],
];

const sizes: [NonNullable<Options["size"]>, string][] = [
  ["sm", "h-8 px-3 text-asap-xs"],
  ["md", md],
  ["lg", "h-control-lg px-4 text-asap-md"],
  ["touch", "min-h-touch px-5 text-asap-lg rounded-lg"],
];

describe("buttonVariants", () => {
  test("defaults to the primary variant and md size", () => {
    expect(buttonVariants()).toBe(buttonVariants({ variant: "primary", size: "md" }));
  });

  for (const [variant, expected] of intents) {
    test(`${variant} intent returns exactly base + intent + default md size`, () => {
      expect(buttonVariants({ variant })).toBe(`${base} ${expected} ${md}`);
    });
  }

  for (const [size, expected] of sizes) {
    test(`${size} size returns exactly base + default primary intent + size`, () => {
      expect(buttonVariants({ size })).toBe(`${base} ${primary} ${expected}`);
    });
  }
});
