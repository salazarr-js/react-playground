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

## Classless / minimal (the direction we took)

Rather than adopt a plugin's class vocabulary, we lifted the **token + base-element**
ideas from these projects and rolled our own thin layer on Tailwind (see _Next step_).
For the detailed token comparison and the schema we landed on, see
[`design-tokens.md`](./design-tokens.md).

| Project | Repo | Why it's here |
|---|---|---|
| **Pico** | https://github.com/picocss/pico | **Classless** — styles bare `h1`/`p`/`a`/`button`/form tags via CSS variables. The main inspiration; adds a few opt-in classes only when needed. |
| **water.css** | https://github.com/kognise/water.css | Pure **classless** drop-in — no classes at all, just nice defaults on bare elements. |
| **daisyUI** | https://github.com/saadeghi/daisyui | Tailwind plugin — borrowed its semantic-token / theme-variable naming. |
| **Skeleton** | https://github.com/skeletonlabs/skeleton | Tailwind design-token system — borrowed its structured token approach. |
| **Pure CSS** | https://github.com/pure-css/pure | Yahoo's ultra-light (~3.5 kB) modular framework — reference for staying tiny and splitting into opt-in modules (base/forms/tables). |
| **Skeleton (classic)** | https://github.com/dhg/Skeleton · http://getskeleton.com | The original minimal boilerplate — styles bare typography/forms/buttons like a classless framework; "just a starting point, not a framework" spirit. |
| **Ripple UI** | https://github.com/Siumauricio/rippleui | daisyUI-style Tailwind plugin — second reference for plugin packaging and component-class naming. |

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

## Decision — stay classless (no plugin)

We already have Tailwind. Instead of installing daisyUI/Skeleton, we keep the playground
**classless, Pico-inspired**: our own small set of **semantic tokens + base element
styles** live in [`src/styles/global.css`](../src/styles/global.css), so bare `h1`–`h6`,
`p`, `a` and `button` look good by default with **no classes and no framework**.

- **Tokens** are two-tier: runtime `:root` vars (the theme, currently slate + indigo) →
  `@theme inline` semantic tokens → live Tailwind utilities (`bg-primary`, `text-fg`, …).
  Re-skinning = edit the `:root` vars; dark mode = one `@media` override block.
- **Living reference:** the [`ui-styleguide`](../src/projects/ui-styleguide/) page
  (`/projects/ui-styleguide`) renders every styled bare element on one screen.
- **Next elements:** forms (`input`/`label`/`select`/`textarea`), then optional Pico-style
  opt-in variant classes. A plugin (daisyUI/Skeleton) stays an option if we ever want a
  full class vocabulary.
