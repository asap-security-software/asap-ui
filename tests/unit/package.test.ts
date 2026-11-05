import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as {
  name: string;
  private?: boolean;
  peerDependencies: Record<string, string>;
  publishConfig: { registry: string; access: string };
  exports: Record<string, unknown>;
};

describe("package", () => {
  test("is the scoped GitHub Packages name and is publishable", () => {
    expect(pkg.name).toBe("@asap-security-software/ui");
    expect(pkg.private).not.toBe(true);
    expect(pkg.publishConfig.registry).toBe("https://npm.pkg.github.com");
    expect(pkg.publishConfig.access).toBe("restricted");
  });

  test("peers React 19 and exports the four public entry points", () => {
    expect(pkg.peerDependencies.react).toContain("19");
    expect(pkg.peerDependencies["react-dom"]).toContain("19");
    expect(pkg.peerDependencies.tailwindcss).toContain("4");
    expect(Object.keys(pkg.exports).sort()).toEqual(
      [".", "./styles.css", "./tailwind-preset", "./tokens"].sort(),
    );
  });
});
