# vite-plugin-mpa — Summary

One-stop reference for the custom MPA plugin: what it is, why we built it, the
decisions behind it, and what we actually shipped.

---

## What it does

A small custom Vite plugin for this React + TypeScript playground. Each folder
under `src/examples/` is a self-contained example. The plugin **auto-discovers**
those folders and serves each as its own page, plus a **main page** at `/` that
lists them all.

Adding an example = creating a folder with a `main.tsx` — nothing else:

```
src/examples/
  03-use-ref/
    main.tsx     ← the only requirement
    App.tsx
    hooks/
```

It then shows up on its own URL (`/examples/03-use-ref`) and in the index at `/`.
No config to touch, no HTML file per folder.

**Done-when:** adding `src/examples/NN-name/main.tsx` makes it appear at
`/examples/NN-name` and on `/`, with no config edits and no per-folder HTML. ✅

## Why

A learning playground. The goal is **zero friction**: write an example and
immediately run and see it, with no per-folder boilerplate and no config edits.
Each example stays isolated (its own entry, its own page) so they never interfere.

Existing MPA plugins each solve only part of this, so we built a ~220-line one
(no extra deps) tailored to exactly this need.

---

## Plugins evaluated — why build our own

We read each project's actual source (not just the README) before deciding.

| Plugin | Discovery | HTML | Verdict |
|---|---|---|---|
| **IndexXuan/vite-plugin-mpa** | ✅ glob `main.*` | 🔴 physical `index.html` per folder (hand-written `<script>`) | Right idea, but **dead** (Vite 2, frozen ~3y), `mpa is not a function` on Vite 5+, and demands an HTML file per folder. |
| **@sunday-sky (moonlitusun)** | ❌ none (manual `pages` map) | virtual (string-replace) | Good virtual-HTML model, but no discovery + foot-guns: uninvalidated dev cache, `NODE_ENV` gate, double `<title>`, no Vite 7/8. |
| **emosheeep/vite-plugin-virtual-mpa** | ✅ `scanOptions` (subfolders) | virtual (EJS) | The cleanest fit and best-maintained — but EJS is dead weight, scan is 1-level, and it's an unmaintained dep for what is ~70 lines we already understand. |

**No single plugin gives all four together** — auto-discovery **and** virtual HTML
**and** zero-per-folder-config **and** Vite 8 / Rolldown support. So we built our
own, borrowing the good patterns: glob/`readdirSync` discovery (IndexXuan),
shared-template + script/title injection (@sunday-sky), and the
`resolveId`+`load` virtual-HTML approach with clean URLs (emosheeep).

---

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mpaPlugin from './vite-plugin-mpa'

export default defineConfig({
  plugins: [
    mpaPlugin({ dir: 'src/examples', entry: 'main.tsx' }),
    react(), // after mpa() so its preamble runs inside transformIndexHtml
  ],
})
```

### Options

| Option | Required | Default | Purpose |
|---|---|---|---|
| `entry` | **yes** | — | Per-folder entry file. Framework-specific (`main.tsx` React / `main.ts` Vue), so no default would be safe. |
| `dir` | no | `'src/pages'` | Folder to scan; each subfolder with `entry` becomes a page. |
| `template` | no | `'template.html'` | Shared HTML shell for the generated pages. |
| `flatten` | no | `false` | Drop the dir prefix from URLs/output: `/examples/x.html` → `/x.html`. |

The `template.html` shell uses two placeholders, replaced verbatim:

```html
<title>__TITLE__</title>
...
<div id="root"></div>
__ENTRY__
```

- `__TITLE__` → `"<main page title> | <name>"` (e.g. `React Playground | 01-use-state`).
- `__ENTRY__` → external `<script type="module" src="...">` (must be external — see constraint #3).

The `virtual:mpa-pages` module exposes the discovered pages so the main page can
render its own index in React:

```ts
// virtual:mpa-pages → { name: string; path: string }[]
import { pages } from 'virtual:mpa-pages'
```

---

## Architecture decisions

1. **Build our own** (~220 lines, `readdirSync` not glob, no deps). No existing
   plugin covers discovery + virtual HTML + zero-per-folder-config + Vite 8.
2. **Physical main page + `appType: 'mpa'`.** The root `index.html` is a real
   React app Vite serves natively; only the **examples** are virtual HTML. Chosen
   over "everything virtual / `appType: 'custom'`" because it shrinks the plugin
   to its real value (discovery), leans on Vite for the most important page, lets
   the main page diverge freely (own `<head>`), and removes the build risk of
   virtualizing the root. Honest two-mechanism split (the main page *is* distinct
   from an example).
3. **One shared `template.html`**, `string.replace` for `__TITLE__`/`__ENTRY__`
   (no EJS — we need no templating or per-page data).
4. **Title = `<main page title> | <name>`.** The plugin reads the main
   `index.html`'s `<title>` and prefixes it onto the folder name — site name is
   single-sourced from the main page; falls back to bare `<name>`. Always
   **replace** the placeholder, never insert a second `<title>`.
5. **`virtual:mpa-pages`** decouples the index UI from the URL scheme; full React
   control, still zero-config.
6. **URLs `/<prefix>/<name>`** (`prefix = basename(dir)`), or `/<name>` when
   `flatten`. Extensionless is canonical; `.html` and trailing slash are aliases.
   Same URL in dev and build. Output: `dist/<prefix>/<name>.html`.
7. **Unknown route → main page** (dev middleware rewrites `req.url = '/'`). The
   main page, which lists everything, doubles as the not-found page.
8. **Branch dev/build via Vite hooks** (`config`/`configResolved`/`configureServer`),
   never `process.env.NODE_ENV`.
9. **`entry` is required.** It varies by framework; defaulting it would silently
   assume React.

### Vite 8 / Rolldown constraints that shaped it

- Config key is **`build.rolldownOptions.input`** (not `rollupOptions`).
- `appType: 'mpa'` serves on-disk HTML with **no SPA fallback** → our middleware
  handles example URLs and `next()`s the rest.
- 🔴 **Virtual HTML + inline scripts don't build** (Vite reads inline
  `<script type=module>` from disk by position). An **external `<script src>`**
  works — which is why `__ENTRY__` is always external.
- Working virtual-HTML pattern: `config` sets `appType` + input; `resolveId`
  claims the ids; `load` returns the rendered template; dev middleware renders
  the same HTML through `server.transformIndexHtml()` (gives HMR / Fast Refresh).

---

## What we shipped

The plugin uses these hooks:

- **`config`** — `discover()` subfolders with `entry`; register MPA inputs
  (`{ index: 'index.html' }` + one virtual `<prefix>/<name>.html` per page); set
  `appType: 'mpa'`.
- **`configResolved`** — cache root, read template + main-page `<title>` prefix,
  build the abs-path → name map.
- **`resolveId` / `load`** (object form with `filter: { id }`) — claim the
  `virtual:mpa-pages` module and each page's `.html`; `load` returns the pages
  list or the rendered HTML.
- **`configureServer`** — dev hot-reload + serving (below).

Beyond the base plan, we added:

- **Hot-reload of the page set.** A `server.watcher` on `add`/`unlink`/`addDir`/
  `unlinkDir` re-discovers; if the set changed, it rebuilds the map, invalidates
  `virtual:mpa-pages`, and `full-reload`s. New folders show up **without a dev
  restart**. (We use the watcher, not `handleHotUpdate`, which only fires for
  files already in the module graph.)
- **Hot-reload of template / main-page title.** A `change` watcher on
  `template.html` / `index.html` re-reads the cached template + title and
  reloads — no stale dev cache.
- **`normalizePath` everywhere** — all path/id comparisons are POSIX-normalized
  so the file→name map and the watcher match the same way on Windows.
- **Hook filters** (`resolveId`/`load`) — narrow which ids reach the handlers to
  cut JS↔Rust overhead; in-handler guards stay for correctness.
- **Vite's `send()`** — serve the dev HTML with proper `Content-Type` + ETag/304/
  cache headers (instead of hand-rolled `res.end`).

### Foot-guns we deliberately avoided

(All observed in the plugins we evaluated.) No physical HTML per folder; no
inline entry scripts; no second `<title>`; no uninvalidated dev cache; no stray
`console.log`; `rolldownOptions` not `rollupOptions`; no `NODE_ENV` gate.

### Out of scope (v1)

Recursive/nested discovery; EJS, minify, per-page SPA sub-routes; a `title`
option or "prettified" titles; rendering each example's `README.md` on the index.

---

## Verification

- **Dev**: `/` lists examples; `/examples/<name>` mounts with Fast Refresh; `.html`
  and trailing-slash aliases work; unknown route → main page; adding/removing a
  folder hot-reloads; editing `template.html` / the title hot-reloads — all
  without a restart.
- **Build** (`tsc --noEmit && vite build`): emits `dist/index.html` +
  `dist/examples/<name>.html`, each with a hashed external `<script>` and a single
  `<title>`. `tsc`, `oxlint` pass.
