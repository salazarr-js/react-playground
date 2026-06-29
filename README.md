# React Playground

Personal environment for experimenting with React and TypeScript. Each example lives in its own isolated folder under `src/examples/` and is served as an independent page on the dev server.

## Stack

- React 19 + TypeScript 6
- Vite 8
- oxlint

## Structure

```
react-playground/
  src/
    examples/
      01-use-state/
        main.tsx        ← entry point (only requirement)
        App.tsx
        components/
      02-use-effect/
        main.tsx
        App.tsx
  template.html         ← shared HTML for all examples
  vite-plugin-examples.ts
  vite.config.ts
```

## Adding an example

Create a folder under `src/examples/` with the format `NN-kebab-name` and a `main.tsx` inside:

```
src/examples/
  03-use-ref/
    main.tsx
    App.tsx
```

Restart the dev server — the example shows up automatically. No config files to touch.

## Commands

```bash
pnpm dev       # dev server at localhost:5173
pnpm build     # typecheck + production build
pnpm typecheck # TypeScript only
pnpm lint      # oxlint
pnpm preview   # preview the build
```

## Dev server

| URL | Description |
|-----|-------------|
| `localhost:5173/` | Landing — lists all examples |
| `localhost:5173/01-use-state` | Runs that example |
| `localhost:5173/02-use-effect` | Runs that example |

## vite-plugin-examples

Custom Vite plugin that auto-discovers examples and serves them as an MPA with no per-folder config required. Docs at [`docs/plugin-brief.md`](docs/plugin-brief.md).
