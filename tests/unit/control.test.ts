import { describe, expect, test } from "bun:test";
import {
  fieldChrome,
  fieldControlVariants,
  fieldSizes,
  textareaVariants,
} from "../../src/components/ui/control";

const tokens = (classes: string) => classes.split(" ");

describe("fieldSizes", () => {
  test("is exactly md, lg, touch in order", () => {
    expect(fieldSizes).toEqual(["md", "lg", "touch"]);
  });
});

describe("fieldChrome", () => {
  test("starts with the shared full-width bordered chrome", () => {
    expect(fieldChrome.startsWith("w-full border border-border ")).toBe(true);
  });
});

describe("fieldControlVariants", () => {
  test("defaults to the lg size", () => {
    expect(fieldControlVariants()).toBe(fieldControlVariants({ size: "lg" }));
    expect(tokens(fieldControlVariants())).toContain("h-control-lg");
  });

  test("lg is chrome plus the exact lg size classes", () => {
    expect(fieldControlVariants({ size: "lg" })).toBe(
      `${fieldChrome} h-control-lg rounded-md px-3.5 text-asap-md`,
    );
  });

  test("touch is chrome plus the exact touch size classes", () => {
    const classes = fieldControlVariants({ size: "touch" });
    expect(tokens(classes)).toContain("min-h-touch");
    expect(classes).toBe(`${fieldChrome} min-h-touch rounded-lg px-5 text-asap-lg`);
  });
});

describe("textareaVariants", () => {
  test("touch uses min-h-36, not min-h-touch", () => {
    const classes = textareaVariants({ size: "touch" });
    expect(tokens(classes)).toContain("min-h-36");
    expect(tokens(classes)).not.toContain("min-h-touch");
    expect(classes).toContain(fieldChrome);
  });

  test("touch is chrome plus the exact touch size classes", () => {
    expect(textareaVariants({ size: "touch" })).toBe(
      `${fieldChrome} block resize-y min-h-36 rounded-lg px-5 py-3 text-asap-lg`,
    );
  });
});
