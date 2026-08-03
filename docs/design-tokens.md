# Design tokens — research & our schema

Deep dive into how **Pico**, **daisyUI**, and **Skeleton** model design tokens, and the
token schema we settled on for our **classless, Pico-inspired** layer on Tailwind v4.

For the broader "which styling approach" decision see [`ui-research.md`](./ui-research.md);
this doc is only about the **tokens**. The implementation lives in
[`src/styles/global.css`](../src/styles/global.css) and is showcased at
[`/projects/ui-styleguide`](../src/projects/ui-styleguide/).

## The three systems, side by side

| Dimension | **Pico** (classless) | **daisyUI** | **Skeleton** |
|---|---|---|---|
| Prefix | `--pico-*` | `--color-*`, `--radius-*` (Tailwind namespaces) | Tailwind namespaces + `--typo-{role}--{prop}` |
| Raw palette tier | ❌ none (hex inline) | ❌ none (oklch inline) | ✅ 50–950 ramp per family |
| Semantic colors | `primary/secondary/contrast` + surface/text/muted + form-state | `primary/secondary/accent/neutral` + `base-100/200/300` + `info/success/warning/error` | `primary…tertiary/success/warning/error/surface` |
| Foreground token | `-inverse` | `-content` | `-contrast-{shade}` |
| Color space | hex/rgb (v2) | **oklch** | **oklch** |
| Radius tokens | 1 (`--border-radius`) + local overrides | 3 roles: `selector/field/box` | 2 roles: `base/container` |
| Typography tokens | ✅ full (families, h1–h6 scale, spacing) | ❌ (delegates to Tailwind) | ✅ (base/heading/anchor roles + `--text-*`) |
| Dark mode | 3 duplicated blocks, gated on `:not([data-theme])` | themes as `[data-theme]` blocks, `--prefersdark` | **`light-dark()` + `color-scheme`** (one switch, no duplication) |
| Theme surface | ~80 vars, re-declared per theme | **~28 vars** per theme (minimal) | ~11 inputs/family → derives ~400 |

### What each does uniquely well

- **daisyUI — minimal semantic API.** ~28 variables define an entire theme: ~4 role
  colors, a 3-step `base-100/200/300` surface ramp with a single `base-content`, status
  colors, and shape tokens bucketed into `selector`/`field`/`box` shape families (one
  radius knob each). No raw palette is exposed at all.
- **Skeleton — derivation machinery.** Author ~11 ramp values per family; contrasts,
  light/dark pairings, and the type scale are all *derived*. Its `light-dark()` +
  `color-scheme` dark mode is the cleanest of the three: each theme-sensitive token is
  written **once** as `light-dark(a, b)` and flipping `color-scheme` swaps the whole
  palette — no `.dark:` variants, no duplicated blocks.
- **Pico — classless element wiring.** Bare elements paint from a small set of *generic
  role vars* (`--color`, `--background-color`, `--border-color`, `--box-shadow`); every
  variant/state (`:hover`, `[type=reset]`, `[aria-invalid]`) only **re-points** those vars
  at a different semantic token. One line — `h1 { --pico-color: var(--pico-h1-color) }` —
  restyles a whole element.

## Principles all three agree on

1. **Role-based tokens, never hue names** at the call site (`primary`/`surface`/`error`,
   not `blue-500`). daisyUI and Pico don't even expose a raw palette.
2. **A foreground token paired with every fill** (`-content` / `-contrast` / `-inverse`) —
   the contrast decision lives in the token, decided once by the theme author.
3. **OKLCH** for color (daisyUI + Skeleton). Tailwind v4's palette is already oklch.
4. **A handful of radii by role**, not an `sm/md/lg/xl` scale.
5. **One spacing base unit + `calc()`/utilities**, not a token zoo.
6. **`aria-invalid` as the validation switch** (Pico) — classless and a11y-correct.

## Our schema (decided)

We keep the two-tier setup already in `global.css` — runtime `:root` vars →
`@theme inline` → live Tailwind utilities (see the `@theme inline` note there and in
[`ui-research.md`](./ui-research.md)) — and adopt the ideas above **only where a bare
element consumes them** (classless discipline: no speculative tokens).

### Color tokens (semantic, light values today)

| Token | Value (via Tailwind palette) | Role | Foreground pair |
|---|---|---|---|
| `--bg` | white | page background | — |
| `--surface` | white | card / input background | — |
| `--fg` | slate-900 | body text | — |
| `--muted` | slate-500 | de-emphasized text / placeholder | — |
| `--border` | slate-200 | subtle borders | — |
| `--primary` | indigo-600 | accent: links, buttons | `--primary-contrast` (white) |
| `--primary-hover` | indigo-700 | accent hover | — |
| `--ring` | indigo-500 | focus ring | — |
| `--success` | emerald-600 | valid form field | `--success-contrast` (white) |
| `--error` | red-600 | invalid form field | `--error-contrast` (white) |
| `--code-bg` | slate-100 | `code`/`kbd`/`pre` surface tint | — |

Each is exposed as a live utility through `@theme inline` (`bg-primary`, `text-fg`,
`ring-ring`, `ring-error`, …). We adopt the **foreground-pair** principle (`-contrast`) and
**oklch** (inherited from Tailwind's palette).

### Shape tokens

- `--radius-field` (`= --radius-md`) — one roundness knob shared by `button`, `input`,
  `select`, `textarea` (utility: `rounded-field`). daisyUI's shape-family idea, trimmed to
  the one family we render.

### The classless wiring (Pico's pattern)

Form fields paint `border-color: var(--field-border)` **once**; states only re-point
`--field-border`:

```css
:where(input…), select, textarea { --field-border: var(--color-border); border-color: var(--field-border); }
:where(input, select, textarea):focus-visible          { --field-border: var(--color-ring); }
:where(input, select, textarea)[aria-invalid='true']   { --field-border: var(--color-error); }
:where(input, select, textarea)[aria-invalid='false']  { --field-border: var(--color-success); }
```

Native `checkbox`/`radio`/`range` stay native, themed with one line:
`accent-color: var(--color-primary)`. `:where()` keeps specificity at 0 so any utility
class overrides the base rule.

### Deferred / reserved (no consumer yet)

- **Dark mode.** Path is decided: wrap each `:root` value in `light-dark(<light>, <dark>)`
  and set `color-scheme: light dark` — one switch, no duplicated blocks, no `@theme`
  change (Skeleton's approach). Not enabled yet.
- **`warning` / `info` status colors** — add when something renders them.
- **`--radius-box`** (cards/modals) — add when we ship a card.
- **A `base-100/200/300` elevation ramp** — our `bg`/`surface` pair suffices until layered
  surfaces appear.

## Why not just install daisyUI/Skeleton?

They're excellent, but both are **class** vocabularies (`btn`, `card`, `bg-surface-100-900`)
— our goal is the opposite: bare tags that look right with **no classes**. We took their
*token ideas* (semantic roles, `-contrast` pairs, oklch, role-based radii, `light-dark()`)
and Pico's *classless element wiring*, and skipped the component classes.

## Sources

- Pico — [CSS variables](https://picocss.com/docs/css-variables) · [`pico.classless.css`](https://github.com/picocss/pico/blob/main/css/pico.classless.css)
- daisyUI — [colors](https://daisyui.com/docs/colors/) · [themes](https://daisyui.com/docs/themes/) · [`light.css`](https://github.com/saadeghi/daisyui/blob/master/packages/daisyui/src/themes/light.css)
- Skeleton — [core API](https://www.skeleton.dev/docs/svelte/get-started/core-api) · [`theme.css`](https://github.com/skeletonlabs/skeleton/blob/main/packages/skeleton/src/base/theme.css)
- [MDN — `light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)
