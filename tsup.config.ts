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
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-tooltip",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "sonner",
    "tailwind-merge",
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
