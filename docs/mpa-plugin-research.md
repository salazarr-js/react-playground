# MPA Plugin Research

Evaluation of existing plugins, the Vite 8 / Rolldown constraints, and the design decisions for building our own. This is the single source of truth for **what we decided and why**. For the goal see [`plugin-brief.md`](./plugin-brief.md); for the build steps see [`plan.md`](./plan.md).

> Plugin evaluations below are based on reading each project's **actual source** (via `gh`) and the current Vite / Rolldown docs, not just their READMEs.

---

## Context

A React + TypeScript learning playground. Each folder under `src/examples/` is an isolated example. We want to run and view each one fast, with no per-folder config.

Chosen architecture: **a single Vite project + MPA (multi-page app), driven by a small custom plugin** that auto-discovers the examples.

## Current project state

- `vite@^8.1.0`, `react@^19.2.7`, `@vitejs/plugin-react@^6`; build = `tsc --noEmit && vite build`.
- **Vite 8 uses Rolldown** (not Rollup) as the bundler.
- Today the MPA is wired **by hand**: `appType: 'mpa'` + `rolldownOptions.input` listing a physical `index.html` per example. The plugin (`vite-plugin-mpa.ts`) and `template.html` do not exist yet. The plugin will replace this manual, per-folder-HTML setup.

---

## Plugins evaluated

### 1. IndexXuan/vite-plugin-mpa

[repo](https://github.com/IndexXuan/vite-plugin-mpa) · 240★ · npm `1.2.0` (2023-06-06) · written for **Vite 2**, no `peerDependencies` declared. Source: `src/index.ts`, `src/lib/utils.ts`, `src/lib/options.ts`.

- **Discovery**: one `fast-glob` call `src/pages/**/main.{js,ts,jsx,tsx}`. Page name from `file.split('/').slice(2, -1)` → assumes `scanDir` is exactly 2 segments deep (`src/pages`, `src/examples` work; deeper roots break naming).
- **Input**: maps each entry script to its sibling HTML (`main.tsx` → `index.html`) and **overwrites** `rollupOptions.input` wholesale.
- **Dev server**: `connect-history-api-fallback` with 5 rules per page, including `^/<page>/` which enables **per-page SPA sub-routes**. Sorts pages by length to avoid prefix collisions.
- **HTML**: ⚠️ **requires a physical `index.html` per folder** that hand-writes the `<script src>`. No template, no injection, no virtual HTML. "Add a folder" means 2 files minimum.
- **Post-build**: `shelljs` hack moving `dist/src/pages/*` → `dist/*` ("Experimental"; breaks when `base !== '/'`, issue #41).
- **Bugs**: 🔴 `TypeError: mpa is not a function` on Vite 5+ (ESM/CJS interop, issues #42/#30, unresolved); zero mention of Vite 6/7/8 or Rolldown; frozen ~3 years.

**Verdict**: glob discovery + input wiring is the right idea (~150 readable lines), but it's dead, has the modern-Vite import bug, and **demands a physical HTML per folder**. Useful as a reference for the glob logic, not as a dependency.

### 2. moonlitusun/vite-plugin-mpa

[repo](https://github.com/moonlitusun/vite-plugin-mpa) — npm package is actually **`@sunday-sky/vite-plugin-mpa`** (v1.0.1) · 86★ · last code change ~May 2025. ~150 lines across 4 files. Source: `src/index.ts`, `src/load-html-content.ts`, `src/types.ts`.

- **Discovery**: ❌ none. Pages are 100% manual via `pages: Record<string, { title, entry, template }>`.
- **Virtual HTML**: ✅ but fragile. Reads the template with `readFileSync`, caches it in a `Map`, injects the script via `replace('</body>', ...)` and the title via `replace('<head>', '<head><title>...')`. ⚠️ It **inserts a new `<title>`** rather than replacing → double `<title>` if the template has one. 🔴 The caches **are never invalidated** → editing the template/title in dev needs a server restart.
- **dev/build branch via `process.env.NODE_ENV === 'development'`** (not `config({ command })`): 🔴 if you run `vite` without `NODE_ENV=development`, it takes the build branch and the dev middleware never registers. Fragile and non-idiomatic.
- **URLs**: `/<name>.html` only, no clean URLs. Dev 404 lists the pages.
- 🔴 stray `console.log` left in the build branch.
- **Versions**: peer `vite ^4 || ^5 || ^6` → **no Vite 7/8 declared**.

**Verdict**: virtual-HTML + shared template is the right model, but it's a manual-config plugin with several foot-guns (uninvalidated cache, `NODE_ENV` gate, double `<title>`, no Vite 7/8). Good reference for script/title injection; not usable as-is.

### 3. emosheeep/vite-plugin-virtual-mpa

[repo](https://github.com/emosheeep/vite-plugin-virtual-mpa) · 153★ · last release Aug 2024. The most complete and best-maintained. Source: `src/plugin.ts`, `src/utils.ts`, `src/api-types.ts`.

- **Discovery**: `scanOptions` is purpose-built and almost exactly what we want:
  ```ts
  createMpaPlugin({
    template: 'index.html',
    scanOptions: { scanDirs: 'src/examples', entryFile: 'main.tsx', filename: n => `${n}.html` },
  })
  ```
  `scanPages` does `readdirSync` over `scanDirs`, takes each **subfolder** as a page (folder name = page name), injects `entryFile` if present. ~6 lines of config.
- **Virtual HTML with EJS**: input = virtual ids `\0virtual-page:<file>`; `resolveId` resolves to an absolute path; `load` runs `ejs.render(template, { ...env, ...page.data })` and injects `<script type="module" src="...">` before `</body>`. Dev middleware serves it through `transformIndexHtml`.
- **Auto rewrites**: generates rules from the page map (longest-first) → clean URLs in dev and preview. `appType: 'mpa'`.
- **Versions**: peer `vite >= 2.0.0` (installs through Vite 7/8 without warning); already handles the `server.ws → server.hot` rename. No Rolldown/Vite 8 mention, but likely works.
- **Limits for us**: **EJS is dead weight** (we need no templating or per-page data); scan is **one level only**; new folders need a restart (unless you wire `watchOptions.reloadPages`).

**Verdict**: for the literal goal it's a clean fit (not overkill — EJS/minify/watch are all opt-in). The only real reason not to use it: depending on an unmaintained package when what we need is ~70 lines we already understand. It's the plugin to **adapt the pattern from**, not the idea to discard.

### Comparison

| Feature | IndexXuan | @sunday-sky (moonlitusun) | emosheeep |
|---|---|---|---|
| Auto-discovery | glob `main.*` | ❌ none | ✅ `scanOptions` (subfolders) |
| HTML per page | 🔴 physical required | virtual | virtual (EJS) |
| Shared template | ❌ | ✅ | ✅ (.html / .ejs) |
| Script/title injection | ❌ (hand-written) | ✅ (replace; double `<title>` bug) | ✅ (EJS + replace) |
| Clean URLs in dev | ✅ | ❌ `/<name>.html` only | ✅ |
| Per-page SPA sub-routes | ✅ | ❌ | partial |
| Main page / list in dev | ❌ | ✅ (in 404) | ❌ |
| Vite peer dep | ❌ none (Vite 2) | ^4‖^5‖^6 (no 7/8) | >=2.0.0 |
| Vite 8 / Rolldown | ❌ no | ❌ not declared | ⚠️ not declared, likely |
| Maintenance | 🔴 dead (2023) | 🟡 hobby (2025) | 🟡 stable (2024) |
| Foot-guns | `mpa is not a fn`, `base≠/` | `NODE_ENV` gate, stale cache | extra EJS, 1-level scan |

No single plugin gives the three things together — discovery **and** virtual HTML **and** zero-per-folder-config **and** Vite 8 support — so we build our own.

---

## Vite 8 / Rolldown findings

Verified against current Vite docs and issues. These constrain the plugin design.

1. **Config key is `build.rolldownOptions.input`**, not `rollupOptions`. `rollupOptions` still works via a deprecated auto-conversion layer; use `rolldownOptions`.
2. **`appType`**: `'spa'` (SPA fallback to root `index.html`), `'mpa'` (serves on-disk HTML, **no fallback** → 404 on unknown), `'custom'` (Vite serves no HTML; you do). Physical auto-discovered HTML → `appType: 'mpa'`. 100% virtual HTML served by our middleware → `appType: 'custom'`.
3. 🔴 **Virtual HTML + inline scripts don't build.** Vite reads HTML entries from disk and the html-proxy reads inline `<script type="module">` by position from disk (issue #5061) — so inline scripts in virtual HTML fail with "No matching html proxy module found". **But an external `<script type="module" src="...">` works fine** in build. So `resolveId` + `load` virtual HTML is viable as long as the injected entry is an external `src` script (which is what @sunday-sky and emosheeep do).
4. **Working virtual-HTML pattern (both modes)**: `config` sets `appType` + input; `resolveId` claims the virtual ids; `load` returns the template with placeholders replaced (external script); `configureServer` middleware generates the same HTML in dev and runs it through `server.transformIndexHtml(url, html, originalUrl)` (gives HMR + React Fast Refresh).
5. **`transformIndexHtml` uses `order: 'pre' | 'post'`** (not `enforce`). Dev: per request with `ctx.server`. Build: with `ctx.bundle`/`ctx.chunk`. Context types now reference `rolldown`.
6. **`configureServer` middleware runs before Vite's internals by default**; return a function to run after them. With `appType: 'mpa'` our middleware runs first, handles example URLs, and `next()`s for `/`, assets, and unknown routes.
7. Other Vite 8 notes (not blocking): `manualChunks` → `codeSplitting.groups`; Rolldown dropped some hooks we don't use; new optional hook filters (`filter: { id }`).

---

## Decisions

1. **Build our own plugin** (~60–70 lines), no extra deps (`readdirSync`, not glob). No existing plugin covers discovery + virtual HTML + zero-per-folder-config + Vite 8.
2. **Name `vite-plugin-mpa`** — generic/portable; "examples" is only how we invoke it here. Default `dir: 'src/pages'`; this project passes `dir: 'src/examples'`. Options: `{ entry, dir?, template?, flatten? }`. `entry` is **required** (no default) — it's framework-specific (`main.tsx` for React, `main.ts` for Vue), so a default would silently assume React; the rest are optional. `flatten` (default `false`) drops the dir prefix from URLs and build output (`/examples/asd.html` → `/asd.html`). No `title` option.
3. **Option B — physical main page + `appType: 'mpa'`.** The root `index.html` is a real React app that Vite serves natively; only the **examples** are virtual HTML. *Chosen over* "everything virtual / `appType: 'custom'`" because it shrinks the plugin to its real value (example discovery), leans on Vite for the most important page, lets the main page diverge freely (its own `<head>`), removes the only build risk (virtualizing the root), and uses a first-class Vite mode. *Trade-off accepted*: two HTML mechanisms (physical main page, virtual examples) — but the main page **is** conceptually distinct from an example, so that split is honest.
4. **One shared `template.html` for examples**, with `__TITLE__` and `__ENTRY__` replaced via exact `string.replace` (no EJS — we need no templating or per-page data). `__ENTRY__` must be an **external `<script type="module" src="...">`** (finding #3).
5. **`virtual:mpa-pages` module** exposing `{ name, path }[]` of discovered examples. The main page imports it and renders the index in React — full control, still zero-config. Decouples the main page from the URL scheme.
6. **Keep `__TITLE__`** (auto default title; the example's `App.tsx` can still override it via `document.title`). The title is `<main page title> | <name>` — the plugin reads the main page `index.html`'s `<title>` in `configResolved` and prefixes it onto the folder name (e.g. `React Playground | 01-use-state`), so the site name is single-sourced from the main page; falls back to bare `<name>` if the main page has no title. ⚠️ **Replace** the placeholder — never insert a new `<title>` (avoids @sunday-sky's double-tag).
7. **URLs `/<prefix>/<name>`** where `prefix` = `basename(dir)` (`src/examples` → `/examples/...`), or `/<name>` when `flatten` is on. **Extensionless is canonical**; `.html` and trailing slash are aliases. Same URL in dev and build (no asymmetry). Build output: `dist/<prefix>/<name>.html` (or `dist/<name>.html` flattened). Extensionless resolves in dev (our middleware) and preview (sirv's default `.html` resolution); production hosts usually do clean URLs, and `.html` always works.
8. **Unknown route → root app** (dev middleware rewrites `req.url = '/'` and `next()`s). The main page, which lists everything, doubles as the not-found page. (Dev behavior; production hosting decides.)
9. **Branch dev/build via Vite hooks** (`config` / `configResolved` / `configureServer`), never via `process.env.NODE_ENV` (@sunday-sky's foot-gun).
10. **Foot-guns to avoid** (all observed in the evaluated plugins): no physical HTML per folder; no inline entry scripts; no inserting a second `<title>`; no uninvalidated dev template cache; no stray `console.log`; use `rolldownOptions` not `rollupOptions`.
11. **Hot-reload in dev** (`configureServer` + `server.watcher`):
    - *Page set*: `add`/`unlink`/`addDir`/`unlinkDir` → re-discover; if the set changed, rebuild `names`/`fileToName`, invalidate `virtual:mpa-pages`, `full-reload`. New examples show up without a restart. We use the watcher, **not `handleHotUpdate`** (which only fires for files already in the module graph, so it misses brand-new folders).
    - *Template / main page title*: `change` on `template.html` or `index.html` → re-read the cached `template`/`sitePrefix`, `full-reload`. This closes the "uninvalidated dev cache" foot-gun (#10) for our own caches.
12. **Cross-platform ids via `normalizePath`** (from `vite`): all path/id comparisons (the `fileToName` keys, `resolveId`'s lookup, the watcher's `dir` check) are normalized to POSIX, matching how Vite represents ids internally — so resolution works the same on Windows.
13. **Hook filters** (`resolveId`/`load` use the object form `{ filter: { id }, handler }`, Vite 6.3+/Rolldown): narrows which ids reach our handlers to cut JS↔Rust overhead. The in-handler guards stay for correctness; the filter is purely an optimization. The `load` filter matches `virtual:mpa-pages$` by **suffix** because the resolved id is `\0`-prefixed (and a literal `\0` in the regex would trip `no-control-regex`).

### Out of scope (v1)

Recursive/nested discovery; EJS, minify, per-page SPA sub-routes; a `title` option or "prettified" titles; rendering each example's `README.md` on the main page.

---

## References

- [Rolldown docs](https://rolldown.rs/llms-full.txt) — Rolldown API, plugin hooks, input/output options.
- [Vite docs](https://vite.dev/llms-full.txt) — plugin hooks, `configureServer`, `resolveId`/`load` virtual modules, `appType`.
- Vite issues [#5061](https://github.com/vitejs/vite/issues/5061) (html-proxy reads inline scripts from disk) and [#20308](https://github.com/vitejs/vite/issues/20308) (`transformIndexHtml` on non-entry HTML during build).
