import { describe, expect, test } from "bun:test";
import { buttonVariants } from "../../src/components/ui/button";

type Options = NonNullable<Parameters<typeof buttonVariants>[0]>;

const tokens = (classes: string) => classes.split(/\s+/);

const intents: [NonNullable<Options["variant"]>, string][] = [
  ["primary", "bg-primary text-primary-foreground hover:bg-primary-hover"],
  ["secondary", "bg-ink-secondary text-primary-foreground hover:bg-ink"],
  ["outline", "border border-border bg-surface text-ink hover:bg-surface-muted"],
  ["ghost", "bg-transparent text-ink hover:bg-surface-muted"],
];

const sizes: [NonNullable<Options["size"]>, string][] = [
  ["sm", "h-8 px-3 text-asap-xs"],
  ["md", "h-control px-3.5 text-asap-sm"],
  ["lg", "h-control-lg px-4 text-asap-md"],
  ["touch", "min-h-touch px-5 text-asap-lg rounded-lg"],
];

describe("buttonVariants", () => {
  test("defaults to the primary variant and md size", () => {
    expect(buttonVariants()).toBe(buttonVariants({ variant: "primary", size: "md" }));
  });

  for (const [variant, expected] of intents) {
    test(`${variant} intent includes its tokens`, () => {
      expect(tokens(buttonVariants({ variant }))).toEqual(expect.arrayContaining(tokens(expected)));
    });
  }

  for (const [size, expected] of sizes) {
    test(`${size} size includes its tokens`, () => {
      expect(tokens(buttonVariants({ size }))).toEqual(expect.arrayContaining(tokens(expected)));
    });
  }
});
