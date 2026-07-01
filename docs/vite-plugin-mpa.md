# vite-plugin-mpa

Technical reference for the custom MPA plugin: what it does, why we built our own, the decisions behind it, and the Vite 8 constraints that shaped it.

> For the project layout and how to add an example, see the [README](../README.md). This doc is the plugin internals.

## What it does

A ~250-line custom Vite plugin (no extra deps). Each folder under a **collection dir** (`src/examples/`, `src/projects/`) that contains an `entry` file (`main.tsx`) is **auto-discovered** and served as its own page, plus a **main page** at `/` listing them all, grouped by collection. No per-folder HTML, no config to touch.

Adding `src/<collection>/NN-name/main.tsx` makes it appear at `/<collection>/NN-name` and on `/` — that's the whole contract.

## Why build our own

Goal: **zero friction** — write an example, immediately run it, no per-folder boilerplate or config. No single existing plugin gives all four of: auto-discovery **and** virtual HTML **and** zero-per-folder-config **and** Vite 8 / Rolldown support. So we built one, borrowing the good patterns from each.

### Plugins evaluated (inspiration)

We read each project's source before deciding.

| Plugin | Discovery | HTML | Verdict |
|---|---|---|---|
| **IndexXuan/vite-plugin-mpa** | glob `main.*` | 🔴 physical `index.html` per folder | Right idea but dead (Vite 2, breaks on Vite 5+); demands an HTML file per folder. |
| **@sunday-sky (moonlitusun)** | none (manual `pages` map) | virtual (string-replace) | Good virtual-HTML model, but no discovery + foot-guns (uninvalidated dev cache, `NODE_ENV` gate, double `<title>`). |
| **emosheeep/vite-plugin-virtual-mpa** | `scanDirs` (1 level) | virtual (EJS) | Cleanest fit & best-maintained — but EJS dead weight, and multi-dir is **flat** (see below). |

Borrowed: `readdirSync` discovery (IndexXuan), shared-template + script/title injection (@sunday-sky), `resolveId`+`load` virtual-HTML with clean URLs (emosheeep).

### Why "collections" (none of them model this)

Only emosheeep accepts multiple source dirs, but its multi-dir is **flat**: all subfolders merge into one page list keyed by folder name → names must be globally unique, no grouping or URL prefix.

Our `dirs: string[]` treats each dir as a **collection**: its basename becomes a URL prefix (`/examples/*`, `/projects/*`) **and** a grouping key. So names can repeat across collections, the index groups by collection, build-input keys are namespaced (`examples/01`, `projects/01`), and prev/next nav stays within one collection.

## Usage

```ts
// vite.config.ts
mpaPlugin({ dirs: ['src/examples', 'src/projects'], entry: 'main.tsx' }),
react(), // after mpa() so its preamble runs inside transformIndexHtml
```

### Options

| Option | Required | Default | Purpose |
|---|---|---|---|
| `entry` | **yes** | — | Per-folder entry file. Framework-specific (`main.tsx`/`main.ts`) — no safe default. |
| `dirs` | no | `['src/pages']` | Collection dirs to scan; each subfolder with `entry` is a page. Basename = collection name + URL prefix. |
| `template` | no | `'template.html'` | Shared HTML shell for generated pages. |

`template.html` has two placeholders, replaced verbatim:
- `__TITLE__` → `"<main page title> | <name>"` (title read from the root `index.html`).
- `__ENTRY__` → external `<script type="module" src="...">` (**must** be external — see constraints).

`virtual:mpa-pages` exposes the discovered pages, grouped by collection, so the main page renders its own index in React:

```ts
import { collections } from 'virtual:mpa-pages'
// { name: string; pages: { name: string; path: string }[] }[]
```

## Key decisions

1. **Physical main page + `appType: 'mpa'`.** Root `index.html` is a real React app Vite serves natively; only examples are virtual HTML. Shrinks the plugin to its real value (discovery), lets the main page diverge freely, removes the build risk of virtualizing the root.
2. **One shared `template.html`** with `string.replace` (no EJS — we need no templating).
3. **Title = `<main page title> | <name>`**, single-sourced from the root `index.html` `<title>`; always **replace** the placeholder, never add a second `<title>`.
4. **`virtual:mpa-pages` exported nested** (`collections → pages`), mirroring the internal model, so consumers don't regroup a flat list.
5. **URLs `/<collection>/<name>`**, extensionless canonical; `.html` / trailing slash are aliases; same URL dev & build → `dist/<collection>/<name>.html`.
6. **Unknown route → main page** (dev middleware rewrites `req.url = '/'`); the index doubles as the not-found page.
7. **Branch dev/build via Vite hooks** (`config`/`configResolved`/`configureServer`), never `process.env.NODE_ENV`.

## Vite 8 / Rolldown constraints that shaped it

- Build input key is **`build.rolldownOptions.input`** (not `rollupOptions`).
- `appType: 'mpa'` serves on-disk HTML with **no SPA fallback** → our middleware handles example URLs and `next()`s the rest.
- 🔴 **Virtual HTML + inline scripts don't build** (Vite reads inline `<script type=module>` from disk by position). An **external `<script src>`** works — hence `__ENTRY__` is always external.
- Pattern: `config` sets `appType` + input; `resolveId` claims ids; `load` returns rendered template; dev middleware renders the same HTML through `server.transformIndexHtml()` (HMR / Fast Refresh).

## Notable extras

- **Hot-reload of the page set** — a `server.watcher` on `add`/`unlink`/`addDir`/`unlinkDir` re-discovers and `full-reload`s when the set changes; new folders appear without a dev restart. (Watcher, not `handleHotUpdate`, which only fires for files already in the module graph.)
- **Hot-reload of template / main-page title** on `change`.
- **`normalizePath` everywhere** so path/id comparisons match on Windows.
- **Hook `filter`s** on `resolveId`/`load` to cut JS↔Rust overhead.
- **Vite's `send()`** for dev HTML (proper Content-Type + ETag/304).

## Out of scope (v1)

Recursive discovery within a collection (1 level deep only); EJS/minify/per-page SPA sub-routes; a `title` option; rendering each example's `README.md` on the index.
