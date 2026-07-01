# CLAUDE.md

## What this is

A personal React 19 + TypeScript playground. Each demo lives in its own folder under a **collection** and is served as an independent page by a custom Vite MPA plugin. There is no router and no shared app shell — every page is a standalone `main.tsx` entry that mounts its own React root.

## Commands (pnpm only)

```bash
pnpm dev        # dev server at localhost:5173 (HMR; auto-discovers pages)
pnpm build      # tsc --noEmit + vite build
pnpm typecheck  # tsc --noEmit only
pnpm lint       # oxlint
pnpm preview    # preview the production build
```

There is no test runner configured. `oxlint` (not ESLint) is the linter; config is `.oxlintrc.json` with `react/rules-of-hooks` as error.

## Architecture

### Collections and pages

See [`README.md`](README.md) for the project layout and the per-folder convention for adding an example (folder naming, the required `main.tsx`/`App.tsx`/`README.md`). In short: `vite.config.ts` registers `vite-plugin-mpa.ts` with two **collection** dirs (`src/examples`, `src/projects`); each subfolder with a `main.tsx` becomes a page at `/<collection>/<folder>`, auto-discovered and hot-reloaded — no per-folder config.

**Each new example must include a `README.md`** (theory + official React docs links) — this is part of the convention, not optional.

### The MPA plugin (`vite-plugin-mpa.ts`)

The load-bearing piece behind discovery, routing, and the build. It synthesizes each page's HTML from the shared `template.html` (no per-folder HTML) and exposes `virtual:mpa-pages` — `collections: { name, pages: { name, path }[] }[]` — consumed by `src/App.tsx` (landing index) and `ExampleFooter` (prev/next nav).

**Read [`docs/vite-plugin-mpa.md`](docs/vite-plugin-mpa.md) before touching the build, routing, or the plugin** — full design, decisions, options, and Vite 8 / Rolldown constraints.

### Shared code

- `@/*` aliases `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`). Use `@/components` etc.
- `src/components/` is a barrel (`index.ts`). **Default exports must be re-exported explicitly** (`export { default as X } from './X'`) — `export *` does not forward defaults.
- `ExampleFooter` (prev/next + back-to-index nav) is added per-page by importing it into a page's `main.tsx`, not globally.

## Authoritative React docs (use these, not memory)

This is a learning playground — examples must match **current React 19** behavior, not pre-cutoff habits. Before answering React API questions or scaffolding a new concept demo, consult the official docs:

- Index of every doc: `https://react.dev/llms.txt`
- **Every react.dev page has a clean-markdown twin**: append `.md` to the URL.
  - `https://react.dev/reference/react/useEffect.md`
  - `https://react.dev/reference/react/useCallback.md`
  - `https://react.dev/learn/you-might-not-need-an-effect.md`

**Coverage tracker — keep it updated (required workflow):** [`docs/react-docs-coverage.md`](docs/react-docs-coverage.md) maps every React docs page to the example folder that covers it. After creating or modifying ANY example, do this before considering the task done:

1. Read the example's code (`App.tsx`, hooks, etc.) and identify which React concepts/APIs it actually demonstrates.
2. Cross-reference against the official docs pages (use the `.md` twins to confirm scope).
3. Update `docs/react-docs-coverage.md`: set the status (✅ full / 🟡 partial) and fill in the example folder for every row it covers. Add a one-line entry under "Notes from what we already learned" if the example surfaced a non-obvious lesson.

Be honest about 🟡 vs ✅ — only mark ✅ when the example genuinely covers that page's core ideas.

Fetch the relevant `.md` and mirror its patterns. Notable current guidance that contradicts older habits: raw `fetch` in an Effect should guard against race conditions (React's `ignore`-flag pattern, or an `AbortController` whose `AbortError` is ignored on cleanup); React Compiler auto-memoizes, so `useCallback`/`useMemo` are optimizations, not defaults.

## TypeScript notes

`tsconfig.json` is strict in ways that bite: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` (no enums / no TS-only runtime constructs), `verbatimModuleSyntax` (use `import type` for type-only imports), and `allowImportingTsExtensions`. `build` runs `tsc --noEmit` first, so unused vars fail the build, not just the editor.
