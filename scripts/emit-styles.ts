import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { renderStylesheet } from "../src/tokens/stylesheet";

writeFileSync(new URL("../src/styles.css", import.meta.url), renderStylesheet());

const formatted = spawnSync(
  new URL("../node_modules/.bin/biome", import.meta.url).pathname,
  ["format", "--write", "src/styles.css"],
  { stdio: "inherit" },
);

if (formatted.status !== 0) {
  process.exit(formatted.status ?? 1);
}
