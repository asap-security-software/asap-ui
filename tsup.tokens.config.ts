import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "tokens/index": "src/tokens/index.ts",
    "tailwind/preset": "src/tailwind/preset.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  treeshake: true,
  splitting: false,
  minify: false,
  external: ["tailwindcss"],
});
