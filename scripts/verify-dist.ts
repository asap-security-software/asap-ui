import { readFileSync } from "node:fs";

const required = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/tokens/index.js",
  "dist/tokens/index.d.ts",
  "dist/tailwind/preset.js",
  "dist/tailwind/preset.d.ts",
  "dist/styles.css",
];

const missing = required.filter((file) => {
  try {
    readFileSync(file);
    return false;
  } catch {
    return true;
  }
});

if (missing.length > 0) {
  console.error(`Missing build output:\n${missing.join("\n")}`);
  process.exit(1);
}

const entry = readFileSync("dist/index.js", "utf8").trimStart();
if (!entry.startsWith('"use client"') && !entry.startsWith("'use client'")) {
  console.error("dist/index.js must start with the use client directive for Next.js.");
  process.exit(1);
}

const tokens = readFileSync("dist/tokens/index.js", "utf8").trimStart();
if (tokens.startsWith('"use client"') || tokens.startsWith("'use client'")) {
  console.error("dist/tokens/index.js must stay free of the use client directive.");
  process.exit(1);
}

const css = readFileSync("dist/styles.css", "utf8");
for (const needle of ["#a60e13", "#212121", "#3dc372", "#ff9e45", "#e44e56", "@theme"]) {
  if (!css.includes(needle)) {
    console.error(`dist/styles.css is missing ${needle}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  name: string;
  private?: boolean;
  publishConfig?: { registry?: string; access?: string };
  exports?: Record<string, unknown>;
};

if (pkg.name !== "@asap-security-software/ui") {
  console.error("package name must be @asap-security-software/ui");
  process.exit(1);
}
if (pkg.private === true) {
  console.error(
    'package.json private: true would block GitHub Packages. Use publishConfig.access "restricted".',
  );
  process.exit(1);
}
if (pkg.publishConfig?.registry !== "https://npm.pkg.github.com") {
  console.error("publishConfig.registry must be https://npm.pkg.github.com");
  process.exit(1);
}
if (pkg.publishConfig?.access !== "restricted") {
  console.error('publishConfig.access must be "restricted"');
  process.exit(1);
}
for (const key of [".", "./tokens", "./tailwind-preset", "./styles.css"]) {
  if (!pkg.exports?.[key]) {
    console.error(`exports map is missing ${key}`);
    process.exit(1);
  }
}

console.log("dist exports, client boundary, and publishConfig look right.");
