import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const files = [
  "src/components/ui/button.tsx",
  "src/components/ui/badge.tsx",
  "src/components/ui/select.tsx",
  "src/styles.css",
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
      const source = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
      for (const pattern of banned) {
        expect(source, `${file} matches ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  test("status badge renders a dot slot", () => {
    const source = readFileSync(
      new URL("../../src/components/ui/badge.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain('data-slot="badge-dot"');
  });

  test("touch size meets the 52px technician target", () => {
    const source = readFileSync(
      new URL("../../src/components/ui/button.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain("min-h-touch");
  });
});
