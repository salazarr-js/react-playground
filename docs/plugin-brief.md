# vite-plugin-mpa — Brief

## What

A small custom Vite plugin for this React + TypeScript playground. Each folder under `src/examples/` is a self-contained example. The plugin auto-discovers those folders and serves each as its own page, plus a main page at `/` that lists them all.

Adding an example means creating a folder with a `main.tsx` — nothing else:

```
src/examples/
  03-use-ref/
    main.tsx     ← the only requirement
    App.tsx
    hooks/
```

It then shows up on its own: in the main page at `/` and at its own URL. No config to touch, no HTML file per folder.

## Why

This is a learning playground. The goal is zero friction: write an example and immediately run and see it in the browser, with no per-folder boilerplate and no config edits. Keeping each example isolated (its own entry, its own page) means they never interfere with each other.

Existing MPA plugins each solve only part of this — one auto-discovers but needs an HTML file per folder, another generates HTML but has no discovery, a third does both but is heavy and unmaintained. So we build a tiny one tailored to exactly this need.

## Where the rest lives

- **Decisions and rationale** (plugin evaluation, architecture choice, Vite 8 specifics) → [`mpa-plugin-research.md`](./mpa-plugin-research.md)
- **How we build it** (file changes, plugin code, steps, verification) → [`plan.md`](./plan.md)
