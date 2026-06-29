# UI Research — styling for the playground

Investigation of UI/styling options for the playground, with a focus on what we
actually want: **class-based style layers on top of Tailwind** (like daisyUI and
Skeleton) — a plugin that gives you styled classes + themes, with **no JS and no
framework components to import**.

---

## What we want

> "Solo estilos como daisy / skeleton."

A styling layer you drive entirely through **classes**: install a Tailwind plugin,
get semantic classes (`btn`, `card`, …) and themes, done. Explicitly **not** a
component/JS library (no React components, no headless logic to wire up).

This rules out the headless/component families (shadcn/ui, HeroUI, Headless UI,
Radix, Flowbite-React, …) — useful, but they ship components/JS, which is not the
ask here.

## Recommended fit (class-based style layers)

| Option | What it is | Notes |
|---|---|---|
| **daisyUI** | Tailwind plugin: semantic classes (`btn`, `card`, `badge`…) + themes | The purest match. Zero JS, classes only. Easiest plug-and-play. |
| **Skeleton** | Tailwind plugin + design tokens + themes; framework-agnostic core | v3 split the CSS/tokens from the Svelte components → you can use just the styles. More structured theming/token system. |
| **Rippleui** | daisyUI-style Tailwind plugin | Same idea: classes + themes, no JS. |
| **FlyonUI** | Plugin built on daisyUI (+ optional Preline JS) | If used only for the classes, it's "styles only". |
| **Franken UI** | Pure CSS with the shadcn aesthetic (based on UIkit) | Classes / web components, **no React**. Modern shadcn look without a JS framework. |
| **Sira UI** | Smaller class-based component plugin | Same enforcement, narrower scope. |

**Pick:**
- **daisyUI** — most direct for this playground (plugin → themes → classes).
- **Skeleton** — if we want a more structured theme/token system.
- **Franken UI** — if we like the shadcn look but want no React dependency.

---

## Fuller landscape (for reference)

The broader "Tailwind frameworks" space, grouped by type — most of these are
*not* what we want here, but recorded so we don't re-research.

### 1. Class-based component libraries (DaisyUI style)
daisyUI · Flowbite · Preline UI · HyperUI · Tailwind Plus (official, paid) ·
Meraki UI · TailGrids · Wind UI · Float UI · Penguin UI · Konsta UI (mobile) ·
Material Tailwind · Rippleui.

### 2. Headless + Tailwind (most used in React today — ships components/JS)
**shadcn/ui** (de-facto standard; copy components into your repo, Radix + Tailwind;
ports `shadcn-vue`, `shadcn-svelte`) · Headless UI (official) · Radix UI / Ark UI ·
HeroUI (ex-NextUI) · Park UI.

### 3. Animated / effects (usually on top of shadcn)
Aceternity UI · Magic UI · Motion Primitives.

### 4. Dashboards / data
Tremor (React charts/KPIs on Tailwind).

### 5. Non-React frameworks
Skeleton · Bits UI · Melt UI (Svelte) · Flowbite-Vue (Vue).

### Bonus — alternatives to Tailwind itself (utility engines)
UnoCSS (atomic, faster, Tailwind-compatible presets) · Master CSS · Open Props
(CSS variables, same spirit, not Tailwind).

---

## Next step (proposed)

Add Tailwind + **daisyUI** to the playground and create a new example
(e.g. `src/examples/03-daisyui/main.tsx`) using the existing
[`vite-plugin-mpa`](./vite-plugin-mpa.md) — it shows up at `/examples/03-daisyui`
and on `/` with no extra config. Swap daisyUI for Skeleton/Franken UI later if we
want to compare.
