import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

type Namespace = Record<string, unknown>;

// Internal helpers used only by Input, Select and Textarea; tests/unit/control.test.ts
// imports them directly. Not public API, so src/index.ts must NOT export them.
// Keyed by ui module file name: a name is only skipped for the module it is listed under.
const allowlist: Record<string, Record<string, string>> = {
  "control.ts": {
    fieldChrome: "internal helper for Input, Select and Textarea",
    fieldControlVariants: "internal helper for Input, Select and Textarea",
    textareaVariants: "internal helper for Input, Select and Textarea",
  },
};
const allowlisted = Object.keys(allowlist["control.ts"] ?? {}).sort();

// Runtime exports only: types are erased at runtime, which is intended.
function missingFromIndex(file: string, moduleExports: Namespace, index: Namespace): string[] {
  return Object.keys(moduleExports)
    .filter((name) => !(name in index) && allowlist[file]?.[name] === undefined)
    .sort();
}

const uiDir = join(import.meta.dir, "../../src/components/ui");
const files = readdirSync(uiDir)
  .filter((file) => /\.tsx?$/.test(file) && !/\.stories\./.test(file))
  .sort();

const index: Namespace = await import("../../src/index");
const modules = new Map<string, Namespace>();
for (const file of files) {
  modules.set(file, await import(join(uiDir, file)));
}

describe("src/index.ts re-exports src/components/ui/*", () => {
  test("discovers at least one ui module and each has a runtime export", () => {
    expect(files.length).toBeGreaterThan(0);
    const empty = [...modules].filter(([, ns]) => Object.keys(ns).length === 0).map(([f]) => f);
    expect(empty).toEqual([]);
  });

  test("the allowlist is exactly fieldChrome, fieldControlVariants, textareaVariants", () => {
    expect(Object.keys(allowlist)).toEqual(["control.ts"]);
    expect(allowlisted).toEqual(["fieldChrome", "fieldControlVariants", "textareaVariants"]);
  });

  test("each allowlisted name is a runtime export of control.ts and is not exported from index", () => {
    const control = modules.get("control.ts") ?? {};
    for (const name of allowlisted) {
      expect(Object.keys(control)).toContain(name);
      expect(Object.keys(index)).not.toContain(name);
    }
  });

  for (const file of files) {
    test(`every runtime export of src/components/ui/${file} is re-exported from src/index.ts, except the allowlist`, () => {
      const ns = modules.get(file) ?? {};
      expect({ file, missing: missingFromIndex(file, ns, index) }).toEqual({ file, missing: [] });
    });

    test(`every re-exported name of src/components/ui/${file} is the same binding in src/index.ts`, () => {
      const ns = modules.get(file) ?? {};
      const different = Object.keys(ns).filter((name) => name in index && index[name] !== ns[name]);
      expect({ file, different }).toEqual({ file, different: [] });
    });
  }

  test("missingFromIndex reports a missing export and ignores allowlisted helpers", () => {
    const moduleExports = { Tabs: 1, TabsList: 2, fieldChrome: 3 };
    expect(missingFromIndex("control.ts", moduleExports, { Tabs: 1 })).toEqual(["TabsList"]);
  });

  test("missingFromIndex does not report an allowlisted helper missing from the index", () => {
    expect(missingFromIndex("control.ts", { fieldChrome: 1, textareaVariants: 2 }, {})).toEqual([]);
  });

  test("missingFromIndex reports a control.ts allowlisted name exported by another module", () => {
    expect(missingFromIndex("skeleton.tsx", { fieldChrome: 1, textareaVariants: 2 }, {})).toEqual([
      "fieldChrome",
      "textareaVariants",
    ]);
  });
});
