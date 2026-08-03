# UI Styleguide

A living reference for the playground's **classless base styles**. Every element on the
page is a **bare tag** (`h1`–`h6`, `p`, `a`, `button`, `strong`, `em`, `code`) with **no
utility classes** — so what you see is exactly the default styling from
[`src/styles/global.css`](../../styles/global.css). If it looks good here, it looks good
on every page.

This is not a React-concept demo; it demonstrates the **styling layer**, so it lives under
`src/projects/` rather than `src/examples/`.

## The design decision

Rather than install a styling plugin (daisyUI, Skeleton), we keep the playground
**classless and Pico-inspired**: our own small set of semantic tokens + base element rules
on top of Tailwind v4. See [`docs/ui-research.md`](../../../docs/ui-research.md) for the
approach decision and [`docs/design-tokens.md`](../../../docs/design-tokens.md) for the
token comparison (Pico / daisyUI / Skeleton) and our schema.

## How the tokens work (two tiers)

The trick that makes the theme swappable and dark-mode-ready is Tailwind v4's
`@theme inline` — utilities emit a **live** `var(...)` instead of a baked value:

### 1. Runtime theme vars (`:root`) — the only place values live

```css
:root {
  --fg: var(--color-slate-900);
  --primary: var(--color-indigo-600);
  /* …bg, surface, muted, border, primary-hover, primary-contrast, ring */
}
```

Re-skin the whole playground by editing these ~9 vars. Add dark mode by overriding the
same vars inside `@media (prefers-color-scheme: dark)` — **no element rule changes**.

### 2. `@theme inline` — turns the vars into live Tailwind utilities

```css
@theme inline {
  --color-fg: var(--fg);
  --color-primary: var(--primary);
}
```

This generates `text-fg`, `bg-primary`, `border-border`, `ring-ring`, … that stay bound to
the runtime vars. Every token is therefore usable **both** as a bare-element default **and**
as a utility class — nothing is locked away from Tailwind.

### 3. Base element rules (`@layer base`)

Bare elements are styled with `@apply` using those semantic utilities:

```css
h1 { @apply mb-4 text-4xl; }
a  { @apply text-primary underline underline-offset-2 transition-colors; }
button { @apply … bg-primary text-primary-contrast …; }
```

## What this page shows

- **Headings** `h1`–`h6` — sized down the Tailwind scale (`text-4xl` → `text-base`),
  semibold, balanced wrapping.
- **Text** — paragraph rhythm (`mb-4`), plus `strong` / `em` / inline `code`.
- **Links** — `a` in the primary color, underlined, colour-shifts on hover.
- **Buttons** — filled primary by default, with `hover`, `focus-visible` ring, and a
  `disabled` state — no classes required.
- **Forms** — `label`, text-like `input`/`select`/`textarea` sharing `rounded-field`, with
  focus ring and `[aria-invalid]` validation (red/green border via a re-pointed
  `--field-border` role var). `checkbox`/`radio`/`range` stay native, themed with
  `accent-color: var(--color-primary)`.
- **Content** — `ul`/`ol`/`li` (markers + nested spacing), `details`/`summary`,
  `blockquote`, `hr`, `code`/`kbd`/`pre` (on the `--code-bg` tint), and `table`.

## Notes

- Styling a bare `button` globally means example buttons (e.g. `02-use-state`) pick up the
  primary look for free. A component with its **own class** (example `01`'s
  `.custom-button`) still wins, because a class selector beats an element selector.
- **No arbitrary values** (`[…]`) and **no new size tokens** — the base rules reuse
  Tailwind's built-in scale, per the project's styling rules.

## Scope / next

- **Now:** typography, links, buttons, forms.
- **Next:** optional Pico-style opt-in variant classes (`.secondary`, `.outline`);
  `warning`/`info` status colors and a `--radius-box` when a card/modal needs them.
- **Ready but not enabled:** dark mode via `light-dark()` (see
  [`docs/design-tokens.md`](../../../docs/design-tokens.md)).

## Links

- [Tailwind v4 — theme variables & `@theme`](https://tailwindcss.com/docs/theme)
- [Tailwind v4 — colors & the default palette vars](https://tailwindcss.com/docs/colors)
- [Pico CSS — CSS variables](https://picocss.com/docs/css-variables) — the classless inspiration
