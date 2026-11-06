import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";

const uiDir = new URL("../../src/components/ui/", import.meta.url);
const files = [
  ...readdirSync(uiDir)
    .filter(
      (name) => (name.endsWith(".tsx") || name.endsWith(".ts")) && !name.endsWith(".stories.tsx"),
    )
    .map((name) => new URL(name, uiDir)),
  new URL("../../src/styles.css", import.meta.url),
];

const banned = [
  /bg-gradient/,
  /from-/,
  /to-/,
  /backdrop-blur/,
  /shadow-sm/,
  /shadow-md/,
  /shadow-lg/,
  /shadow-xl/,
  /shadow-2xl/,
  /glass/,
];

describe("design constraints", () => {
  test("primitives avoid gradients, glass, and heavy shadows", () => {
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const pattern of banned) {
        expect(source, `${file.pathname} matches ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  test("status badge renders a dot slot", () => {
    const source = readFileSync(new URL("badge.tsx", uiDir), "utf8");
    expect(source).toContain('data-slot="badge-dot"');
  });

  test("touch size meets the 52px technician target", () => {
    const button = readFileSync(new URL("button.tsx", uiDir), "utf8");
    const fields = readFileSync(new URL("control.ts", uiDir), "utf8");
    expect(button).toContain("min-h-touch");
    expect(fields).toContain("min-h-touch");
  });
});
