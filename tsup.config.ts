import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  treeshake: true,
  splitting: false,
  minify: false,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "@radix-ui/react-select",
    "@radix-ui/react-slot",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
  ],
  async onSuccess() {
    mkdirSync("dist", { recursive: true });
    copyFileSync("src/styles.css", "dist/styles.css");
    // esbuild drops "use client" when it bundles more than one module.
    const file = "dist/index.js";
    const source = readFileSync(file, "utf8");
    if (!source.startsWith('"use client"') && !source.startsWith("'use client'")) {
      writeFileSync(file, `"use client";\n${source}`);
    }
  },
});
