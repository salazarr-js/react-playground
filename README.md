# React Playground

A personal playground for experimenting with **React 19 + TypeScript**. Every demo lives in its own isolated folder and is served as a standalone page — no router, no shared app shell. Two collections: `src/examples/` for atomic concept demos, `src/projects/` for small apps that combine several concepts.

## Examples

Start here. Each example is a self-contained page with a `README.md` covering the theory and links to the official React docs.

### Concept demos — `src/examples/`

| # | Example | What it covers |
|---|---------|----------------|
| 01 | [**Components**](./src/examples/01-components/README.md) | JSX, props, composition |
| 02 | [**useState**](./src/examples/02-use-state/README.md) | Local state, re-renders |
| 03 | [**useEffect**](./src/examples/03-use-effect/README.md) | Side effects, cleanup, race conditions |
| 04 | [**Custom Hook** (`useFetch`)](./src/examples/04-custom-hook/README.md) | Extracting reusable stateful logic |

### Projects — `src/projects/`

Apps that integrate several concepts. _(None yet — coming soon.)_

## Quick start

```bash
pnpm install
pnpm dev        # dev server at localhost:5173 — auto-discovers pages, HMR
```

| URL | Description |
|-----|-------------|
| `localhost:5173/` | Landing — every page grouped by collection |
| `localhost:5173/examples/01-components` | Runs that example |

Other commands:

```bash
pnpm build      # typecheck + production build
pnpm typecheck  # TypeScript only
pnpm lint       # oxlint
pnpm preview    # preview the build
```

## Adding an example

Create a folder under a collection named `NN-kebab-name` (the zero-padded prefix drives sort order). Per folder:

- **`main.tsx`** — entry that mounts `<App />` (the only requirement for discovery).
- **`App.tsx`** — the demo.
- **`README.md`** — the theory, with links to the official React docs page(s) it covers.
- Any local subfolders the example needs (`hooks/`, `components/`, …).

It shows up automatically — the dev server hot-reloads the page set, no restart and no config to touch. The page appears at `/<collection>/NN-kebab-name` and in the landing index.

## How it works

```
react-playground/
  src/
    examples/          ← collection: atomic concept demos
      01-components/
        main.tsx       ← entry point (only requirement for discovery)
        App.tsx        ← the demo
        README.md      ← theory + official React docs links
    projects/          ← collection: apps integrating several concepts
    components/         ← shared UI (e.g. ExampleFooter, imported via @/components)
  template.html        ← shared HTML for all generated pages
  vite-plugin-mpa.ts   ← auto-discovery, routing, build
  vite.config.ts
```

A custom Vite plugin (`vite-plugin-mpa.ts`) discovers every folder with a `main.tsx`, serves it as an MPA page, and generates the HTML from the shared `template.html` — no per-folder config. Every page also gets a footer with prev/next navigation within its collection.

### Stack

React 19 · TypeScript 6 · Vite 8 · oxlint

## Reference docs

- [React docs coverage](./docs/react-docs-coverage.md) — tracker mapping each example to the React docs pages it covers.
- [vite-plugin-mpa](./docs/vite-plugin-mpa.md) — how the MPA plugin is built and why.
- [Free test APIs](./docs/free-test-apis.md) — quick reference for free mock APIs (JSONPlaceholder, DummyJSON).
- [UI research](./docs/ui-research.md) — styling options research (class-based Tailwind layers).

## Resources


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
