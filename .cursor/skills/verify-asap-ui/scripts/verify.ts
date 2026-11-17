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
const FEATURES = [
  "published-exports",
  "consumer-styles",
  "render-primitives",
  "tokens-theme",
  "form-controls",
];

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

const FORM_OK = "FORM-OK";
const TOKEN_A = "kestrel-7041"; // unique per step: neither is a prefix or substring of the other
const TOKEN_B = "magnolia-2285";
type Snap = Record<string, string>;

/** Every expected key must `===` the observed one: no prefix, no includes. */
function assertFormState(step: string, actual: Snap, expected: Snap): void {
  for (const [k, want] of Object.entries(expected))
    if (actual[k] !== want)
      throw new Error(`form step "${step}": ${k} is "${actual[k]}", expected "${want}"`);
}

/** Fresh bun subprocess (same Radix import-time reason as the StatusSelect render). Throws on any
 * failed assertion with the child's FAIL message. */
function renderForm(consumer: string, evidenceFile = ""): string {
  const r = Bun.spawnSync(["bun", self, "client-form", consumer, evidenceFile], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  if (r.exitCode !== 0) throw new Error(`form journey failed: ${r.stderr.toString().trim()}`);
  const out = r.stdout.toString().trim();
  if (out !== FORM_OK) throw new Error("form journey did not finish");
  return out;
}

/** Client journey for Input, Checkbox, Switch at size="touch", driven like a user (focus, type,
 * click, Space). All modules and the DOM come from the consumer; asserts after every step. */
async function clientForm(consumer: string, evidenceFile: string): Promise<void> {
  const { GlobalRegistrator } = await load(consumer, "@happy-dom/global-registrator");
  GlobalRegistrator.register({ url: "http://localhost:3000/" });
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
  try {
    const { createElement: h, act } = await load(consumer, "react");
    const { createRoot } = await load(consumer, "react-dom/client");
    const ui = await load(consumer, PKG);
    const host = document.createElement("div");
    document.body.appendChild(host);
    const app = createRoot(host);
    // Controlled Input: onChange stores the typed text and re-renders the same tree.
    const draw = (text: string) =>
      h(
        "div",
        null,
        h("label", { htmlFor: "f-name" }, "Full name"),
        h(ui.Input, {
          id: "f-name",
          size: "touch",
          value: text,
          onChange: (e: { target: { value: string } }) => app.render(draw(e.target.value)),
        }),
        h("label", { htmlFor: "f-terms" }, "Accept terms"),
        h(ui.Checkbox, { id: "f-terms", size: "touch" }),
        h("label", { htmlFor: "f-alerts" }, "Email alerts"),
        h(ui.Switch, { id: "f-alerts", size: "touch" }),
      );
    await act(async () => app.render(draw("")));
    // The control element itself (not page-wide text) must carry the documented touch class.
    const pick = (slot: string, touch: string): HTMLElement => {
      const found = host.querySelectorAll(`[data-slot="${slot}"]`);
      const el = found[0];
      if (found.length !== 1 || !(el instanceof HTMLElement))
        throw new Error(`${slot} control not rendered: found ${found.length}, expected 1`);
      if (!el.classList.contains(touch))
        throw new Error(`${slot} lacks ${touch} at size="touch": class="${el.className}"`);
      return el;
    };
    const input = pick("input", "min-h-touch");
    const checkbox = pick("checkbox", "size-touch");
    const sw = pick("switch", "size-touch");
    if (!(input instanceof HTMLInputElement)) throw new Error("input control is not an <input>");
    const nameOf = (el: HTMLElement) =>
      el.getAttribute("aria-label") ??
      host.querySelector(`label[for="${el.id}"]`)?.textContent ??
      "";
    const toggles: Array<[string, HTMLElement]> = [
      ["checkbox", checkbox],
      ["switch", sw],
    ];
    const snap = (): Snap => {
      const s: Snap = { "input.value": input.value, "input.type": input.type };
      s["input.name"] = nameOf(input);
      for (const [k, el] of toggles)
        for (const a of ["role", "aria-checked", "data-state"])
          s[`${k}.${a}`] = el.getAttribute(a) ?? "";
      for (const [k, el] of toggles) s[`${k}.name`] = nameOf(el);
      return s;
    };
    const flip = (k: string, on: boolean): Snap => ({
      [`${k}.aria-checked`]: String(on),
      [`${k}.data-state`]: on ? "checked" : "unchecked",
    });
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (!setValue) throw new Error("no native input value setter");
    const typeText = async (text: string) => {
      // Select-all then type: the first key replaces the old value, each key fires an input event.
      for (let i = 1; i <= text.length; i++)
        await act(async () => {
          setValue.call(input, text.slice(0, i));
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    };
    const click = (el: HTMLElement) => async () => {
      await act(async () => el.click());
    };
    const space = (el: HTMLElement) => async () => {
      await act(async () => {
        const key = (type: string) =>
          el.dispatchEvent(
            new KeyboardEvent(type, { key: " ", code: "Space", bubbles: true, cancelable: true }),
          );
        // Synthesized: happy-dom lacks the Space-to-click default, so click only if neither event was cancelled.
        if (key("keydown") && key("keyup")) el.click();
      });
    };
    let want: Snap = {
      "input.value": "",
      "input.type": "text",
      "input.name": "Full name",
      "checkbox.role": "checkbox",
      "checkbox.name": "Accept terms",
      "switch.role": "switch",
      "switch.name": "Email alerts",
      ...flip("checkbox", false),
      ...flip("switch", false),
    };
    assertFormState("initial", snap(), want);
    const steps: Array<[string, HTMLElement, () => Promise<void>, Snap]> = [
      ["type first value", input, () => typeText(TOKEN_A), { "input.value": TOKEN_A }],
      ["type second value", input, () => typeText(TOKEN_B), { "input.value": TOKEN_B }],
      ["click checkbox", checkbox, click(checkbox), flip("checkbox", true)],
      ["synthesized Space on checkbox", checkbox, space(checkbox), flip("checkbox", false)],
      ["click switch", sw, click(sw), flip("switch", true)],
      ["synthesized Space on switch", sw, space(sw), flip("switch", false)],
    ];
    const log: Array<[string, Snap]> = [["initial", snap()]];
    for (const [label, el, action, patch] of steps) {
      el.focus(); // a user clicks or tabs onto the control first
      await action();
      want = { ...want, ...patch };
      assertFormState(label, snap(), want);
      const active = document.activeElement;
      if (active !== el)
        throw new Error(
          `form step "${label}": focus is on "${active?.getAttribute("data-slot") ?? active?.tagName}", expected "${el.dataset.slot}"`,
        );
      log.push([label, snap()]);
    }
    if (evidenceFile)
      writeFileSync(
        evidenceFile,
        JSON.stringify(
          { steps: log, html: [input, checkbox, sw].map((e) => e.outerHTML) },
          null,
          2,
        ),
      );
    await act(async () => app.unmount());
    console.log(FORM_OK);
  } finally {
    Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
    await GlobalRegistrator.unregister();
  }
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
  } else if (feature === "form-controls") {
    renderForm(c.consumer, path.join(c.runDir, "evidence", "form-controls-client.json"));
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
      mutate: ((src: string) => string) | null,
      render: (consumer: string) => Promise<string> = renderTaskAction,
      what = "Button default",
    ) => {
      const consumer = path.join(tmp, name);
      const pkg = path.join(consumer, "node_modules", PKG);
      mkdirSync(pkg, { recursive: true });
      cpSync(path.join(root, "dist"), path.join(pkg, "dist"), { recursive: true });
      cpSync(path.join(root, "package.json"), path.join(pkg, "package.json"));
      linkDeps(consumer);
      if (mutate) {
        const before = readFileSync(path.join(pkg, "dist/index.js"), "utf8");
        const after = mutate(before);
        if (after === before) throw new Error(`${what} not found in dist/index.js`);
        writeFileSync(path.join(pkg, "dist/index.js"), after);
      }
      return await render(consumer);
    };
    assertPrimitives(await renderCopy("button-ok", null));
    let msg = "";
    try {
      assertPrimitives(
        await renderCopy("button-submit", (s) => s.replace(/\?\?\s*"button"/, '?? "submit"')),
      );
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    }
    const ok = msg.includes('type="button"');
    console.log(`${ok ? "ok  " : "BAD "} mutation: Button defaults to submit: "${msg}"`);
    if (!ok) failures.push("button submit mutation");
    // Client-render StatusSelect value: same assertSelectValue as the journey (control, wrong, missing).
    assertSelectValue(
      await renderCopy("select-ok", null, (c) => renderSelectTrigger(c, "progress")),
      "In progress",
    );
    // SelectValue swapped for an empty span: the real client render has an empty trigger.
    const emptySelectValue = (s: string) =>
      s.replace(
        /function SelectValue\(props\) \{\s*return [^;]*;\s*\}/,
        'function SelectValue() { return jsx("span", { "data-slot": "select-value" }); }',
      );
    const selectCases: Array<[string, string, string, ((s: string) => string) | null]> = [
      ["wrong selected value", "done", '"Done"', null],
      ["missing selected value (placeholder shown)", "", '"Choose a status"', null],
      ["empty trigger text", "progress", '""', emptySelectValue],
    ];
    for (const [label, value, want, mutate] of selectCases) {
      let smsg = "";
      try {
        const text = await renderCopy(
          `select-${label.split(" ")[0]}`,
          mutate,
          (c) => renderSelectTrigger(c, value),
          "SelectValue",
        );
        assertSelectValue(text, "In progress");
      } catch (e) {
        smsg = e instanceof Error ? e.message : String(e);
      }
      const sok = smsg.includes(`selected value is ${want}`);
      console.log(`${sok ? "ok  " : "BAD "} StatusSelect ${label}: "${smsg}"`);
      if (!sok) failures.push(label);
    }
    // form-controls: the same client journey (clientForm assertions) against mutated consumers.
    const formRender = async (c: string) => renderForm(c);
    await renderCopy("form-ok", null, formRender); // control: unmutated journey passes
    const props = (slot: string, extra: string) => (s: string) =>
      s.replace(
        new RegExp(`("data-slot": "${slot}"[\\s\\S]*?)\\.\\.\\.props`),
        `$1...props, ${extra}`,
      );
    const leftover = `value: ((v) => { const p = globalThis.__p ?? ""; if (!v.startsWith(p)) globalThis.__k = p; globalThis.__p = v; return (globalThis.__k ?? "") + v; })(String(props.value ?? ""))`;
    const formCases: Array<[string, string, (s: string) => string]> = [
      [
        "missing control",
        "checkbox control not rendered",
        (s) => s.replace('"data-slot": "checkbox"', '"data-slot": "checkbox-gone"'),
      ],
      [
        "Input touch class removed",
        "input lacks min-h-touch",
        (s) => s.replace('touch: "min-h-touch rounded-lg', 'touch: "rounded-lg'),
      ],
      [
        "Checkbox touch class removed",
        "checkbox lacks size-touch",
        (s) => s.replace('"size-touch" : "size-5"', '"size-5" : "size-5"'),
      ],
      [
        "Switch touch class removed",
        "switch lacks size-touch",
        (s) => s.replace('"size-touch" : "h-6 w-11"', '"h-6 w-11" : "h-6 w-11"'),
      ],
      [
        "wrong Input value",
        'input.value is "stale"',
        props("input", 'value: props.value === "" ? "" : "stale"'),
      ],
      [
        "leftover value from previous step",
        `input.value is "${TOKEN_A}${TOKEN_B}", expected "${TOKEN_B}"`,
        props("input", leftover),
      ],
      [
        "Checkbox never toggles",
        'checkbox.aria-checked is "false", expected "true"',
        props("checkbox", "checked: false"),
      ],
      [
        "Switch never toggles",
        'switch.aria-checked is "false", expected "true"',
        props("switch", "checked: false"),
      ],
      [
        "wrong control (Checkbox is a switch)",
        'checkbox.role is "switch", expected "checkbox"',
        props("checkbox", 'role: "switch"'),
      ],
      [
        "lost focus after Switch click",
        'focus is on "BODY", expected "switch"',
        props("switch", "onClick: (e) => e.currentTarget.blur()"),
      ],
      [
        "Space keydown preventDefault",
        'form step "synthesized Space on checkbox": checkbox.aria-checked is "true", expected "false"',
        props("checkbox", "onKeyDown: (e) => { if (e.key === ' ') e.preventDefault(); }"),
      ],
      [
        "Switch Space keydown preventDefault",
        'form step "synthesized Space on switch": switch.aria-checked is "true", expected "false"',
        props("switch", "onKeyDown: (e) => { if (e.key === ' ') e.preventDefault(); }"),
      ],
    ];
    for (const [label, want, mutate] of formCases) {
      let fmsg = "";
      try {
        await renderCopy(`form-${label.split(" ")[0]}-${label.length}`, mutate, formRender, label);
      } catch (e) {
        fmsg = e instanceof Error ? e.message : String(e);
      }
      const fok = fmsg.includes(want);
      console.log(`${fok ? "ok  " : "BAD "} form-controls ${label}: "${fmsg}"`);
      if (!fok) failures.push(`form-controls ${label}`);
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
  else if (cmd === "client-form" && arg) await clientForm(arg, rest[0] ?? "");
  else if (cmd === "check-markup" && arg) assertMarkup(readFileSync(arg, "utf8"), rest);
  else
    throw new Error(
      "usage: launch | doctor | drive <feature> | cleanup | prove [feature] | self-check",
    );
} catch (e) {
  console.error(`FAIL: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
