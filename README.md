# React Playground

Personal environment for experimenting with React and TypeScript. Each example lives in its own isolated folder under a **collection** (`src/examples/` for atomic concept demos, `src/projects/` for apps that integrate several concepts) and is served as an independent page on the dev server.

## Stack

- React 19 + TypeScript 6
- Vite 8
- oxlint

## Structure

```
react-playground/
  src/
    examples/             ← collection: atomic concept demos (cheatsheet)
      01-use-state/
        main.tsx          ← entry point (only requirement for discovery)
        App.tsx           ← the demo
        README.md         ← theory + links to the official React docs
        hooks/            ← any local subfolders the example needs
    projects/             ← collection: apps integrating several concepts
      01-tic-tac-toe/
        main.tsx
        App.tsx
    components/           ← shared UI (e.g. ExampleFooter, imported via `@/components`)
  template.html           ← shared HTML for all generated pages
  vite-plugin-mpa.ts
  vite.config.ts
```

## Adding an example

Create a folder under a collection (`src/examples/` or `src/projects/`) named `NN-kebab-name` (the zero-padded prefix drives sort order). Per folder:

- **`main.tsx`** — entry that mounts `<App />` (the only requirement for discovery).
- **`App.tsx`** — the demo.
- **`README.md`** — the theory behind the example, with links to the official React docs page(s) it covers plus any other useful resources.
- Any local subfolders the example needs (`hooks/`, `components/`, …).

It shows up automatically — the dev server hot-reloads the page set, no restart and no config files to touch. The example appears at `/examples/NN-kebab-name` and in the index at `/` under its collection.

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
| `localhost:5173/` | Landing — lists all pages grouped by collection |
| `localhost:5173/examples/01-use-state` | Runs that example |
| `localhost:5173/projects/01-tic-tac-toe` | Runs that project |

Every generated page also gets a footer with prev/next navigation within its collection.

## vite-plugin-mpa

Custom Vite plugin that auto-discovers examples across collections and serves them as an MPA with no per-folder config required. Technical docs (design, decisions, inspiration) at [docs/vite-plugin-mpa.md](./docs/vite-plugin-mpa.md).

## Docs

- [React docs coverage](./docs/react-docs-coverage.md) — tracker mapping each example to the React docs pages it covers.
- [vite-plugin-mpa](./docs/vite-plugin-mpa.md) — how the MPA plugin is built and why.
- [Free test APIs](./docs/free-test-apis.md) — quick reference for free mock APIs (JSONPlaceholder, DummyJSON).
- [UI research](./docs/ui-research.md) — styling options research (class-based Tailwind layers).

## Learning resources

Curated React learning path — tools, courses, and references. Brought over from [salazarr-js/react-path](https://github.com/salazarr-js/react-path) (the "learning path / timeline" that inspired this playground's `projects/`).

### Tools / Services

- [Wouter](https://github.com/molefrog/wouter)
- [React Hook Form](https://www.react-hook-form.com/)
- [React Toastify](https://github.com/fkhadra/react-toastify)
- [Nivo](https://nivo.rocks/)
- [react-i18next](https://react.i18next.com/)
- [Tabler Icons](https://tabler.io/icons)
- [DnDKit](https://dndkit.com/)
- [Sonner](https://sonner.emilkowal.ski/)
- [Motion](https://motion.dev/)
- [nuqs](https://nuqs.dev/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/)
- [Conform](https://conform.guide/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Better Auth](https://www.better-auth.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tanstack Query](https://tanstack.com/query/latest)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

### Courses

- https://fullstackopen.com/es/
- https://ui.dev/subscribe
- https://www.epicreact.dev/
- https://www.joyofreact.com/
- https://github.com/midudev/aprendiendo-react

#### MiduDev

- https://github.com/midudev/aprendiendo-react?tab=readme-ov-file
- https://cursoreact.dev/
  - https://github.com/midudev/cursoreact.dev
- [CURSO REACT.JS - Aprende desde cero](https://youtu.be/7iobxzd_2wY?list=PLUofhDIg_38q4D0xNWp7FEHOTcZhjWJ29)
- [Curso REACT JS ⚛️ - Aprende desde CERO 📈 Componentes, State, JSX (Tutorial Desde Cero en Español)](https://youtu.be/T_j60n1zgu0?list=PLV8x_i1fqBw0B008sQn79YxCjkHJU84pC)

#### Gentleman Programming

- [REACT curso de 0 a EXPERTO 2025](https://youtu.be/GMnWXlJnbNo?list=PL42UNLc8e48QkcuPqCR8CzB4ZnSQqtNnc)

### Certificates

- https://certificates.dev/react
- https://www.coursera.org/professional-certificates/meta-front-end-developer

### Useful YouTube channels / videos

- [ui.dev](https://www.youtube.com/@uidotdev)
  - [The Story of React Query](https://youtu.be/OrliU0e09io)
  - [The Story of Next.js](https://youtu.be/BILxV_vrZO0)

### Posts / Guides

- https://css-tricks.com/a-thorough-analysis-of-css-in-js/

### Other

- https://www.reactjs.wiki/
