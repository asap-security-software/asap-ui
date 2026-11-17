#!/usr/bin/env bun
// Verification helper for @asap-security-software/ui. Dependency-free (node + bun builtins only).
// Usage: bun .cursor/skills/verify-asap-ui/scripts/verify.ts <cmd>   (run from the repo root)
//   launch | doctor | drive <feature> | cleanup | prove [feature] | self-check
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const self = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(self), "../../../..");
const runsDir = path.join(root, ".cursor/skills/verify-asap-ui/runs");
const currentFile = path.join(runsDir, "CURRENT");
const PKG = "@asap-security-software/ui";
const EXPORTS = [PKG, `${PKG}/tokens`, `${PKG}/tailwind-preset`, `${PKG}/styles.css`];
const BRAND = ["#a60e13", "#212121", "#3dc372", "#ff9e45", "#e44e56"];
const FEATURES = ["published-exports", "consumer-styles", "render-primitives", "tokens-theme"];

type Current = { id: string; runDir: string; consumer: string; smoke: string; smokeSha256: string };

function sh(cmd: string[], cwd = root): { code: number; out: string } {
  const r = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  return { code: r.exitCode, out: `${r.stdout.toString()}${r.stderr.toString()}` };
}

function must(cmd: string[], cwd = root, logTo?: string): string {
  const r = sh(cmd, cwd);
  if (logTo) writeFileSync(logTo, r.out);
  if (r.code !== 0) throw new Error(`${cmd.join(" ")} exited ${r.code}\n${r.out}`);
  return r.out;
}

function readCurrent(): Current | null {
  if (!existsSync(currentFile)) return null;
  const v: unknown = JSON.parse(readFileSync(currentFile, "utf8"));
  if (typeof v !== "object" || v === null) throw new Error("CURRENT is not an object");
  const g = (k: string): string => {
    const x: unknown = Reflect.get(v, k);
    if (typeof x !== "string" || x === "") throw new Error(`CURRENT is missing ${k}`);
    return x;
  };
  return {
    id: g("id"),
    runDir: g("runDir"),
    consumer: g("consumer"),
    smoke: g("smoke"),
    smokeSha256: g("smokeSha256"),
  };
}

function needCurrent(): Current {
  const c = readCurrent();
  if (!c) throw new Error("no runs/CURRENT: run `launch` first");
  if (!existsSync(c.consumer)) throw new Error(`consumer ${c.consumer} is gone: run cleanup`);
  return c;
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

/** Throws on empty markup or any missing needle. Used by drive, check-markup and self-check. */
function assertMarkup(markup: string, needles: string[]): void {
  if (markup.trim() === "") throw new Error("render output is empty");
  const missing = needles.filter((n) => !markup.includes(n));
  if (missing.length > 0) throw new Error(`markup is missing: ${missing.join(" | ")}`);
}

/** Load a module the way the consumer would: resolved from the consumer dir, never src/. */
async function load(consumer: string, spec: string) {
  return await import(Bun.resolveSync(spec, consumer));
}

async function renderTaskAction(consumer: string): Promise<string> {
  const { createElement: h } = await load(consumer, "react");
  const { renderToStaticMarkup } = await load(consumer, "react-dom/server");
  const ui = await load(consumer, PKG);
  const options = [
    { value: "progress", label: "In progress", tone: "progress" },
    { value: "done", label: "Done", tone: "done" },
  ];
  return renderToStaticMarkup(
    h(
      "div",
      null,
      h(ui.StatusPill, { status: "progress" }, "In progress"),
      h(ui.StatusSelect, {
        value: "progress",
        options,
        allowed: ["done"],
        onValueChange: () => {},
      }),
      h(ui.Button, { size: "touch", className: "w-full" }, "Mark done"),
      h(ui.Badge, null, "New"),
    ),
  );
}

/** Client render (happy-dom + react-dom/client + act) of a StatusSelect alone; returns the visible
 * text of its combobox trigger. renderToStaticMarkup cannot show it: the select-value label is
 * client-only. Everything is resolved from the consumer; the DOM is registered only for the call. */
async function renderSelectTrigger(
  consumer: string,
  value: string,
  evidenceFile = "",
): Promise<string> {
  // Fresh process: Radix picks its layout-effect hook at import time from globalThis.document, so
  // modules already loaded for the server render in this process would never fill the label.
  const r = Bun.spawnSync(["bun", self, "client-select", consumer, value, evidenceFile], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  if (r.exitCode !== 0) throw new Error(`client render failed: ${r.stderr.toString().trim()}`);
  const line = r.stdout
    .toString()
    .split("\n")
    .find((l) => l.startsWith(SELECT_TEXT));
  if (line === undefined) throw new Error("client render printed no trigger text");
  return line.slice(SELECT_TEXT.length);
}

const SELECT_TEXT = "SELECT-TEXT:";

async function clientSelectText(
  consumer: string,
  value: string,
  evidenceFile: string,
): Promise<string> {
  const { GlobalRegistrator } = await load(consumer, "@happy-dom/global-registrator");
  GlobalRegistrator.register({ url: "http://localhost:3000/" });
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
  try {
    const { createElement: h, act } = await load(consumer, "react");
    const { createRoot } = await load(consumer, "react-dom/client");
    const ui = await load(consumer, PKG);
    const options = [
      { value: "progress", label: "In progress", tone: "progress" },
      { value: "done", label: "Done", tone: "done" },
    ];
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => {
      root.render(
        h(ui.StatusSelect, { value, options, allowed: ["done"], onValueChange: () => {} }),
      );
    });
    const trigger = host.querySelector('[data-slot="select-trigger"][role="combobox"]');
    if (!trigger) throw new Error("StatusSelect combobox trigger not rendered in client render");
    if (evidenceFile) writeFileSync(evidenceFile, trigger.outerHTML);
    const text = (trigger.textContent ?? "").replace(/\s+/g, " ").trim();
    await act(async () => root.unmount());
    return text;
  } finally {
    Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
    await GlobalRegistrator.unregister();
  }
}

/** The trigger's whole visible text must equal the selected label: no prefix, no page-wide match
 * (StatusPill also shows "In progress"). */
function assertSelectValue(text: string, expected: string): void {
  if (text !== expected)
    throw new Error(`StatusSelect selected value is "${text}", expected "${expected}"`);
}

/** Offline: react, react-dom, tailwindcss, radix etc. come from this repo's node_modules. */
function linkDeps(consumer: string): void {
  for (const name of readdirSync(path.join(root, "node_modules"))) {
    if (name.startsWith(".") || name === "@asap-security-software") continue;
    symlinkSync(
      path.join(root, "node_modules", name),
      path.join(consumer, "node_modules", name),
      "dir",
    );
  }
}

/** Primitive checks. The Button is matched on its own element: the StatusSelect combobox trigger
 * is also a `<button type="button" class="w-full ...">`, so whole-markup needles prove nothing. */
function assertPrimitives(markup: string): void {
  const btn = markup.match(/<button(?![^>]*role="combobox")[^>]*>Mark done<\/button>/)?.[0];
  if (!btn) throw new Error("Mark done Button not rendered");
  assertMarkup(btn, ['type="button"', "min-h-touch", "w-full"]);
  assertMarkup(markup, [
    'data-slot="status-pill"',
    "In progress",
    "New",
    'data-slot="badge"',
    'data-slot="select-trigger"',
  ]);
}

/** Collect every `types` string at any depth under `node` (condition objects), with its location. */
function collectTypes(node: unknown, where: string, out: Map<string, string>): void {
  if (typeof node !== "object" || node === null) return; // string entries (./styles.css) skipped
  for (const [k, v] of Object.entries(node)) {
    if (k === "types" && typeof v === "string") {
      if (!out.has(v)) out.set(v, `${where}.types`);
    } else collectTypes(v, `${where}["${k}"]`, out);
  }
}

/** Every types file named by the package's own package.json must exist in pkgDir: `types` at any
 * depth under `exports`, plus the top-level `types` and `typings` fields. Same path is checked once. */
function assertPackedTypes(pkgDir: string): string[] {
  const manifest: unknown = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8"));
  if (typeof manifest !== "object" || manifest === null)
    throw new Error("installed package.json is not an object");
  const exportsMap: unknown = Reflect.get(manifest, "exports");
  if (typeof exportsMap !== "object" || exportsMap === null)
    throw new Error("installed package.json has no exports map");
  const found = new Map<string, string>();
  collectTypes(exportsMap, "exports", found);
  for (const field of ["types", "typings"]) {
    const v: unknown = Reflect.get(manifest, field);
    if (typeof v === "string" && !found.has(v)) found.set(v, field);
  }
  if (found.size === 0) throw new Error("installed package.json lists no types files");
  for (const [file, where] of found)
    if (!existsSync(path.join(pkgDir, file)))
      throw new Error(`installed package lacks types ${file} (${where})`);
  return [...found.keys()];
}

async function launch(): Promise<Current> {
  const existing = readCurrent();
  if (existing) {
    if (existsSync(existing.consumer)) {
      throw new Error(`active run ${existing.id} at ${existing.consumer}: run cleanup first`);
    }
    rmSync(currentFile); // stale: its scratch dir is already gone
  }
  const id = String(Date.now());
  const runDir = path.join(runsDir, id);
  const evidence = path.join(runDir, "evidence");
  mkdirSync(evidence, { recursive: true });
  const consumer = mkdtempSync(path.join(tmpdir(), `asap-ui-verify-${id}-`));
  try {
    must(["bun", "run", "build"], root, path.join(evidence, "build.log")); // runs verify-dist.ts
    const packOut = must(["bun", "pm", "pack", "--destination", consumer], root);
    writeFileSync(path.join(evidence, "pack.log"), packOut);
    const tgz = readdirSync(consumer).find((f) => f.endsWith(".tgz"));
    if (!tgz) throw new Error("bun pm pack produced no .tgz");
    const extract = path.join(consumer, "extract");
    mkdirSync(extract);
    must(["tar", "-xzf", path.join(consumer, tgz), "-C", extract], root);
    const scope = path.join(consumer, "node_modules", "@asap-security-software");
    mkdirSync(scope, { recursive: true });
    renameSync(path.join(extract, "package"), path.join(scope, "ui"));
    linkDeps(consumer);
    writeFileSync(
      path.join(consumer, "package.json"),
      JSON.stringify({ name: "asap-ui-throwaway-consumer", private: true, type: "module" }),
    );
    writeFileSync(path.join(evidence, "install.log"), `extracted ${tgz} into ${scope}/ui\n`);
    for (const spec of EXPORTS) Bun.resolveSync(spec, consumer);
    const markup = await renderTaskAction(consumer);
    assertMarkup(markup, ["In progress", "Mark done"]);
    const smoke = path.join(evidence, "smoke.html");
    writeFileSync(smoke, markup);
    const cur: Current = { id, runDir, consumer, smoke, smokeSha256: sha(markup) };
    writeFileSync(currentFile, JSON.stringify(cur, null, 2));
    console.log(`READY run=${id} consumer=${consumer} evidence=${evidence}`);
    return cur;
  } catch (e) {
    rmSync(consumer, { recursive: true, force: true }); // evidence in runDir is kept
    throw e;
  }
}

function doctor(): Current {
  const c = needCurrent();
  for (const spec of EXPORTS) {
    const p = Bun.resolveSync(spec, c.consumer);
    if (!p.startsWith(c.consumer)) throw new Error(`${spec} resolved outside consumer: ${p}`);
  }
  const html = readFileSync(c.smoke, "utf8");
  if (html.trim() === "" || sha(html) !== c.smokeSha256) throw new Error("smoke render changed");
  must(["bun", "scripts/verify-dist.ts"]);
  console.log(`DOCTOR OK run=${c.id}`);
  return c;
}

async function drive(feature: string): Promise<void> {
  const c = needCurrent();
  const ev = (name: string, body: string) =>
    writeFileSync(path.join(c.runDir, "evidence", name), body);
  if (feature === "published-exports") {
    ev("verify-dist.log", must(["bun", "scripts/verify-dist.ts"]));
    const resolved = EXPORTS.map((s) => [s, Bun.resolveSync(s, c.consumer)]);
    ev("exports.json", JSON.stringify(resolved, null, 2));
    // verify-dist.ts checks the repo's dist/; the types must also be in the installed tarball.
    assertPackedTypes(path.join(c.consumer, "node_modules", PKG));
    const entry = readFileSync(resolved[0][1], "utf8").trimStart();
    if (!/^["']use client["']/.test(entry)) throw new Error("installed entry lacks use client");
    const tokens = readFileSync(resolved[1][1], "utf8").trimStart();
    if (/^["']use client["']/.test(tokens)) throw new Error("installed tokens has use client");
  } else if (feature === "consumer-styles") {
    ev("verify-consumer.log", must(["bun", "scripts/verify-consumer.ts"]));
    const css = readFileSync(Bun.resolveSync(`${PKG}/styles.css`, c.consumer), "utf8");
    if (!css.includes('@source "./index.js"'))
      throw new Error("installed styles.css lacks @source");
    ev(
      "styles-source.txt",
      css
        .split("\n")
        .filter((l) => l.includes("@source"))
        .join("\n"),
    );
  } else if (feature === "render-primitives") {
    const markup = await renderTaskAction(c.consumer);
    ev("render-primitives.html", markup);
    assertPrimitives(markup);
    const trigger = path.join(c.runDir, "evidence", "status-select-client.html");
    assertSelectValue(await renderSelectTrigger(c.consumer, "progress", trigger), "In progress");
  } else if (feature === "tokens-theme") {
    const t = await load(c.consumer, `${PKG}/tokens`);
    const harbor = t.defineTheme({
      name: "harbor",
      colors: { primary: "#0b3d91", primaryHover: "#082f73" },
    });
    const base = t.themeToCss(t.asap);
    const css = t.themeToCss(harbor);
    ev("theme-asap.css", base);
    ev("theme-harbor.css", css);
    assertMarkup(base, BRAND);
    assertMarkup(css, ['[data-asap-theme="harbor"]', "#0b3d91", "#082f73"]);
  } else {
    throw new Error(`unknown feature ${feature}; one of ${FEATURES.join(", ")}`);
  }
  console.log(`DRIVE OK ${feature} -> ${path.join(c.runDir, "evidence")}`);
}

function cleanup(): void {
  const c = readCurrent();
  if (!c) {
    console.log("nothing to clean");
    return;
  }
  const base = path.basename(c.consumer);
  if (path.dirname(c.consumer) !== tmpdir() || !base.startsWith(`asap-ui-verify-${c.id}-`)) {
    throw new Error(`refusing to delete ${c.consumer}: not a consumer this skill created`);
  }
  rmSync(c.consumer, { recursive: true, force: true });
  rmSync(currentFile);
  console.log(`CLEANED run=${c.id}; evidence kept at ${path.join(c.runDir, "evidence")}`);
}

async function prove(feature = "render-primitives"): Promise<void> {
  if (readCurrent()) throw new Error("an active run exists; prove only cleans runs it started");
  const c = await launch();
  try {
    doctor();
    await drive(feature);
  } finally {
    cleanup();
  }
  const kept = readdirSync(path.join(c.runDir, "evidence"));
  if (!kept.includes("smoke.html") || existsSync(c.consumer))
    throw new Error("cleanup check failed");
  console.log(`PROVE OK feature=${feature} evidence=${kept.join(",")}`);
}

/** Prove the skill can fail: each broken input must be rejected with a non-zero exit. */
async function selfCheck(): Promise<void> {
  if (!existsSync(path.join(root, "dist/index.js"))) throw new Error("build first: bun run build");
  const tmp = mkdtempSync(path.join(tmpdir(), "asap-ui-selfcheck-"));
  const failures: string[] = [];
  const copy = (name: string) => {
    const d = path.join(tmp, name);
    mkdirSync(d);
    cpSync(path.join(root, "dist"), path.join(d, "dist"), { recursive: true });
    cpSync(path.join(root, "scripts"), path.join(d, "scripts"), { recursive: true });
    cpSync(path.join(root, "package.json"), path.join(d, "package.json"));
    symlinkSync(path.join(root, "node_modules"), path.join(d, "node_modules"), "dir");
    return d;
  };
  const expectFail = (label: string, r: { code: number; out: string }, want: string) => {
    const ok = r.code !== 0 && r.out.includes(want);
    console.log(`${ok ? "ok  " : "BAD "} ${label}: exit ${r.code}, expects "${want}"`);
    if (!ok) failures.push(label);
  };
  const dist = (d: string) => sh(["bun", "scripts/verify-dist.ts"], d);
  const edit = (d: string, f: string, fn: (s: string) => string) => {
    const p = path.join(d, f);
    writeFileSync(p, fn(readFileSync(p, "utf8")));
  };
  try {
    const base = dist(copy("baseline"));
    console.log(`${base.code === 0 ? "ok  " : "BAD "} unmutated copy passes: exit ${base.code}`);
    if (base.code !== 0) failures.push("baseline");
    let d = copy("no-use-client");
    edit(d, "dist/index.js", (s) => s.replace(/^\s*["']use client["'];?/, ""));
    expectFail("build missing use client", dist(d), "use client");
    d = copy("empty-css");
    writeFileSync(path.join(d, "dist/styles.css"), "");
    expectFail("mutation: empty styles.css", dist(d), "dist/styles.css is missing");
    d = copy("no-entry");
    rmSync(path.join(d, "dist/index.js"));
    expectFail("missing dist/index.js", dist(d), "Missing build output");
    d = copy("no-red");
    edit(d, "dist/styles.css", (s) => s.replaceAll("#a60e13", "#000000"));
    expectFail("mutation: brand red removed", dist(d), "#a60e13");
    const empty = path.join(tmp, "empty.html");
    writeFileSync(empty, "");
    expectFail(
      "empty render",
      sh(["bun", self, "check-markup", empty, "Mark done"]),
      "render output is empty",
    );
    // Throwaway consumer under tmp whose Button defaults to submit; src/ and dist/ stay untouched.
    const renderCopy = async (
      name: string,
      mutate: boolean,
      render: (consumer: string) => Promise<string> = renderTaskAction,
    ) => {
      const consumer = path.join(tmp, name);
      const pkg = path.join(consumer, "node_modules", PKG);
      mkdirSync(pkg, { recursive: true });
      cpSync(path.join(root, "dist"), path.join(pkg, "dist"), { recursive: true });
      cpSync(path.join(root, "package.json"), path.join(pkg, "package.json"));
      linkDeps(consumer);
      if (mutate) {
        const before = readFileSync(path.join(pkg, "dist/index.js"), "utf8");
        const after = before.replace(/\?\?\s*"button"/, '?? "submit"');
        if (after === before) throw new Error("Button default not found in dist/index.js");
        writeFileSync(path.join(pkg, "dist/index.js"), after);
      }
      return await render(consumer);
    };
    assertPrimitives(await renderCopy("button-ok", false));
    let msg = "";
    try {
      assertPrimitives(await renderCopy("button-submit", true));
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    }
    const ok = msg.includes('type="button"');
    console.log(`${ok ? "ok  " : "BAD "} mutation: Button defaults to submit: "${msg}"`);
    if (!ok) failures.push("button submit mutation");
    // Client-render StatusSelect value: same assertSelectValue as the journey (control, wrong, missing).
    assertSelectValue(
      await renderCopy("select-ok", false, (c) => renderSelectTrigger(c, "progress")),
      "In progress",
    );
    const selectCases: Array<[string, string | null, string]> = [
      ["wrong selected value", "done", '"Done"'],
      ["missing selected value (placeholder shown)", "", '"Choose a status"'],
      ["empty trigger text", null, '""'], // null: no render, assert on empty text directly
    ];
    for (const [label, value, want] of selectCases) {
      let smsg = "";
      try {
        const text =
          value === null
            ? ""
            : await renderCopy(`select-${value || "empty"}`, false, (c) =>
                renderSelectTrigger(c, value),
              );
        assertSelectValue(text, "In progress");
      } catch (e) {
        smsg = e instanceof Error ? e.message : String(e);
      }
      const sok = smsg.includes(`selected value is ${want}`);
      console.log(`${sok ? "ok  " : "BAD "} StatusSelect ${label}: "${smsg}"`);
      if (!sok) failures.push(label);
    }
    // Packed package whose exports map lists a types file that is absent.
    const typesPkg = path.join(tmp, "types-pkg");
    mkdirSync(typesPkg);
    cpSync(path.join(root, "dist"), path.join(typesPkg, "dist"), { recursive: true });
    cpSync(path.join(root, "package.json"), path.join(typesPkg, "package.json"));
    const listed = assertPackedTypes(typesPkg)[0];
    rmSync(path.join(typesPkg, listed));
    let tmsg = "";
    try {
      assertPackedTypes(typesPkg);
    } catch (e) {
      tmsg = e instanceof Error ? e.message : String(e);
    }
    const tok = tmsg.includes(`lacks types ${listed}`);
    console.log(`${tok ? "ok  " : "BAD "} missing exports types file: "${tmsg}"`);
    if (!tok) failures.push("missing exports types");
    // Variant packages: rewrite a manifest copy, make the file exist, prove it passes, delete it.
    const manifestText = readFileSync(path.join(root, "package.json"), "utf8");
    const variants: Array<[string, string, (m: Record<string, unknown>, f: string) => void]> = [
      [
        "nested-condition",
        "exports.import.types",
        (m, f) => {
          m.exports = { ".": { import: { types: f, default: "./dist/index.js" } } };
          delete m.types;
          delete m.typings;
        },
      ],
      [
        "top-level",
        "top-level types",
        (m, f) => {
          m.types = f;
        },
      ],
    ];
    for (const [name, label, mutate] of variants) {
      const vdir = path.join(tmp, `${name}-pkg`);
      mkdirSync(vdir);
      cpSync(path.join(root, "dist"), path.join(vdir, "dist"), { recursive: true });
      const extra = `./dist/${name}-extra.d.ts`;
      writeFileSync(path.join(vdir, extra), "export {};\n");
      const parsed: unknown = JSON.parse(manifestText);
      if (typeof parsed !== "object" || parsed === null) throw new Error("bad package.json");
      const m: Record<string, unknown> = { ...parsed };
      mutate(m, extra);
      writeFileSync(path.join(vdir, "package.json"), JSON.stringify(m));
      assertPackedTypes(vdir); // control: must pass while the file exists
      rmSync(path.join(vdir, extra));
      let vmsg = "";
      try {
        assertPackedTypes(vdir);
      } catch (e) {
        vmsg = e instanceof Error ? e.message : String(e);
      }
      const vok = vmsg.includes(`lacks types ${extra}`);
      console.log(`${vok ? "ok  " : "BAD "} missing ${label} file: "${vmsg}"`);
      if (!vok) failures.push(`missing ${label}`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  const real = dist(root);
  console.log(
    `${real.code === 0 ? "ok  " : "BAD "} real worktree dist still passes: exit ${real.code}`,
  );
  if (real.code !== 0) failures.push("real worktree");
  if (failures.length > 0) throw new Error(`self-check failed: ${failures.join(", ")}`);
  console.log("SELF-CHECK OK: every broken input was rejected");
}

try {
  const [cmd, arg, ...rest] = process.argv.slice(2);
  if (cmd === "launch") await launch();
  else if (cmd === "doctor") doctor();
  else if (cmd === "drive" && arg) await drive(arg);
  else if (cmd === "cleanup") cleanup();
  else if (cmd === "prove") await prove(arg);
  else if (cmd === "self-check") await selfCheck();
  else if (cmd === "client-select" && arg)
    console.log(SELECT_TEXT + (await clientSelectText(arg, rest[0] ?? "", rest[1] ?? "")));
  else if (cmd === "check-markup" && arg) assertMarkup(readFileSync(arg, "utf8"), rest);
  else
    throw new Error(
      "usage: launch | doctor | drive <feature> | cleanup | prove [feature] | self-check",
    );
} catch (e) {
  console.error(`FAIL: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
