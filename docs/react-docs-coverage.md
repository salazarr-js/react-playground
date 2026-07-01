# React Docs Coverage

Tracker to make sure the playground eventually covers the **entire** React documentation, no matter what order the examples are actually built in (e.g. following a video tutorial).

**How to use:** build examples in whatever order you like. Each time an example covers a docs page, fill in its folder under "Example" and tick the box. The goal is every row checked.

- Official index: <https://react.dev/llms.txt>
- Any page → clean markdown: append `.md` (e.g. `https://react.dev/learn/rendering-lists.md`)

Legend: ✅ done · 🟡 partially touched · ⬜ not yet

---

## Learn React — the official learning path

### 1. Describing the UI
| St | Docs page | Example folder |
|----|-----------|----------------|
| ✅ | Your First Component | `01-components` |
| ✅ | Importing and Exporting Components | `01-components` (default export + barrel) |
| ⬜ | Writing Markup with JSX | |
| 🟡 | JavaScript in JSX with Curly Braces | `01-components` (`{count}` embedding; no attrs/`{{}}`) |
| ✅ | Passing Props to a Component | `01-components` (`onClick` + `children`) |
| 🟡 | Conditional Rendering | `04-custom-hook` (touched: `&&`, early return) |
| ⬜ | Rendering Lists (keys) | |
| ⬜ | Keeping Components Pure | |
| ⬜ | Your UI as a Tree | |

### 2. Adding Interactivity
| St | Docs page | Example folder |
|----|-----------|----------------|
| 🟡 | Responding to Events | `01-components` (handler prop + `on`/`handle` naming; no event object/propagation) |
| ✅ | State: A Component's Memory | `02-use-state` (dedicated counter); also `01-components` |
| ⬜ | Render and Commit | |
| 🟡 | State as a Snapshot | `02-use-state` (snapshot/batching explained; no interactive demo) |
| 🟡 | Queueing a Series of State Updates | `02-use-state` (updater `prev =>` + batching explained; no multi-update demo) |
| ⬜ | Updating Objects in State | |
| ⬜ | Updating Arrays in State | |

### 3. Managing State
| St | Docs page | Example folder |
|----|-----------|----------------|
| ⬜ | Reacting to Input with State | |
| ⬜ | Choosing the State Structure | |
| ⬜ | Sharing State Between Components (lifting up) | |
| ⬜ | Preserving and Resetting State | |
| ⬜ | Extracting State Logic into a Reducer (useReducer) | |
| ⬜ | Passing Data Deeply with Context (useContext) | |
| ⬜ | Scaling Up with Reducer and Context | |

### 4. Escape Hatches
| St | Docs page | Example folder |
|----|-----------|----------------|
| ⬜ | Referencing Values with Refs (useRef) | |
| ⬜ | Manipulating the DOM with Refs | |
| ✅ | Synchronizing with Effects (useEffect) | `03-use-effect` (setup/cleanup/deps) + `04-custom-hook` (fetch race guard) |
| 🟡 | You Might Not Need an Effect | `04-custom-hook` (fetch-is-valid guidance; no anti-pattern demo) |
| ⬜ | Lifecycle of Reactive Effects | |
| ⬜ | Separating Events from Effects (useEffectEvent) | |
| ⬜ | Removing Effect Dependencies | |
| ✅ | Reusing Logic with Custom Hooks | `04-custom-hook` (`useFetch<T>`) |

---

## API Reference — Hooks

Some overlap with the path above; check here when an example digs into a specific hook's API.

| St | Hook | Example folder |
|----|------|----------------|
| ✅ | useState | `02-use-state` (dedicated); also `01-components` |
| 🟡 | useEffect | `03-use-effect` + `04-custom-hook` (setup/cleanup/deps + fetch guard; no external-store/`useEffectEvent`) |
| ⬜ | useReducer | |
| ⬜ | useContext | |
| ⬜ | useRef | |
| ⬜ | useMemo | |
| ⬜ | useCallback | |
| ⬜ | useTransition | |
| ⬜ | useDeferredValue | |
| ⬜ | useId | |
| ⬜ | useImperativeHandle | |
| ⬜ | useLayoutEffect | |
| ⬜ | useDebugValue | |
| ⬜ | useSyncExternalStore | |
| ⬜ | useEffectEvent | |
| ⬜ | useInsertionEffect | |
| ⬜ | use (read promise/context) | |
| ⬜ | useActionState (forms + Actions) | |
| ⬜ | useOptimistic | |

---

## API Reference — Components & APIs

| St | Topic | Example folder |
|----|-------|----------------|
| ⬜ | `<Suspense>` (data fetching boundary) | |
| ⬜ | `<Fragment>` / `<>` | |
| ⬜ | `<StrictMode>` | every `main.tsx` uses it (not a focus yet) |
| ⬜ | `memo` | |
| ⬜ | `lazy` (code splitting) | |
| ⬜ | `createPortal` | |
| ⬜ | `forwardRef` (legacy in 19 — ref as prop) | |
| ⬜ | Forms & Actions (`<form action>`, `useFormStatus`) | |

---

## Notes from what we already learned

- **Data fetching in Effects** (`04-custom-hook` / `useFetch`): React's canonical fix for race conditions is the `let ignore = false` flag; an `AbortController` does the same *and* cancels the request, but its `AbortError` must be ignored on cleanup. React officially recommends TanStack Query / SWR for real apps — hand-rolling is fine for learning. Source: `react.dev/reference/react/useEffect.md`.
- **useCallback / useMemo** are *optimizations*, not defaults — React Compiler auto-memoizes. Source: `react.dev/reference/react/useCallback.md`.
- **Conditional rendering**: prefer `&&` (not `??`) for "show when truthy"; early returns for state machines (loading/error/data). Source: `react.dev/learn/conditional-rendering.md`.
- **Custom `<button>`** (`01-components`): a native `<button>` defaults to `type="submit"` and will submit a surrounding `<form>` — always set `type="button"` for non-submit buttons. Event-handler props are named `onX`, handler fns `handleX`.
