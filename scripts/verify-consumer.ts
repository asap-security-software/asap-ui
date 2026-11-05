import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const stylesPath = path.join(packageRoot, "dist", "styles.css");

/**
 * Compile a consumer CSS entry that only imports the published stylesheet.
 * `source(none)` turns off Tailwind's automatic scan of this repo, so the
 * only way component utilities appear is `@source "./index.js"` inside
 * dist/styles.css (resolved next to that file, not next to the app CSS).
 */
export async function verifyConsumerStyles(): Promise<void> {
  const withSource = await compileConsumer(stylesPath, { requireCandidates: true });
  assertIncludes(withSource, [
    ".bg-primary",
    ".min-h-touch",
    ".bg-success-soft",
    ".shadow-overlay",
    ".text-asap-sm",
  ]);

  const stripped = stripPackageSource(readFileSync(stylesPath, "utf8"));
  const dir = mkdtempSync(path.join(tmpdir(), "asap-ui-consumer-"));
  const strippedPath = path.join(dir, "styles.css");
  try {
    writeFileSync(strippedPath, stripped);
    const withoutSource = await compileConsumer(strippedPath);
    if (withoutSource.includes(".min-h-touch") || withoutSource.includes(".bg-success-soft")) {
      throw new Error(
        "Consumer fixture still emitted component utilities without @source. The check is not isolated.",
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function compileConsumer(
  stylesFile: string,
  options?: { requireCandidates?: boolean },
): Promise<string> {
  // Base is the package so `tailwindcss` resolves. `source(none)` stops Tailwind
  // from auto-scanning this repo; candidates come only from @source in the CSS.
  const input = `@import "tailwindcss" source(none);\n@import ${JSON.stringify(stylesFile)};\n`;
  const compiled = await compile(input, {
    base: packageRoot,
    onDependency() {
      /* fixture has no watch set */
    },
  });
  const scanner = new Scanner({ sources: compiled.sources });
  const candidates = scanner.scan();
  if (options?.requireCandidates && candidates.length === 0) {
    throw new Error(
      `Tailwind scanned no candidates from ${stylesFile}. sources=${JSON.stringify(compiled.sources)}`,
    );
  }
  return compiled.build(candidates);
}

function stripPackageSource(css: string): string {
  const stripped = css.replace(/@source\s+["']\.\/index\.js["']\s*;/g, "");
  if (stripped === css) {
    throw new Error('dist/styles.css is missing @source "./index.js".');
  }
  return stripped;
}

function assertIncludes(css: string, needles: string[]): void {
  const missing = needles.filter((needle) => !css.includes(needle));
  if (missing.length > 0) {
    throw new Error(
      `Consumer CSS is missing utilities that live in dist/index.js: ${missing.join(", ")}`,
    );
  }
}

if (import.meta.main) {
  await verifyConsumerStyles();
  console.log("consumer fixture generated component utilities from dist/index.js");
}
