import { describe, expect, test } from "bun:test";
import { cn } from "../../src/lib/utils";

describe("cn", () => {
  test("joins truthy class names", () => {
    expect(cn("px-2", false && "hidden", "text-ink")).toBe("px-2 text-ink");
  });

  test("lets the later tailwind class win", () => {
    expect(cn("px-2 px-4", "py-1")).toBe("px-4 py-1");
  });

  test("drops empty input", () => {
    expect(cn("rounded-md", undefined, null, "")).toBe("rounded-md");
  });
});
