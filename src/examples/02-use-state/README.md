# useState

`useState` lets a component **remember a value between renders**. When you update it, React re-renders the component with the new value. This example is a counter with `+1`, `-1`, and `reset` buttons.

## What this example shows

### 1. Declaring state
`useState` returns a pair: the current value and a setter. The argument is the **initial value**, used only on the first render:

```tsx
const [count, setCount] = useState(0)
```

### 2. Reading state in JSX
The current value is embedded with curly braces; it re-renders whenever `count` changes:

```tsx
<p>Count: {count}</p>
```

### 3. Updating state on an event — functional form
Each button calls `setCount` with an **updater function** that receives the pending value and returns the next one. Calling the setter triggers a re-render — it does **not** mutate `count` in place:

```tsx
<button type="button" onClick={() => setCount(prev => prev + 1)}>+1</button>
<button type="button" onClick={() => setCount(0)}>reset</button>
```

## Why the functional form (`prev => prev + 1`)?

React treats `count` as a **snapshot**: within a single render its value is fixed. `setCount` doesn't change that variable — it only **schedules** a new render.

**Batching:** React groups all setter calls that happen in the same event and applies them together *before* re-rendering (a single screen update). The problem shows up when you want to apply several updates in a row:

```tsx
// ❌ direct form — all 3 read the SAME count (snapshot), adds only +1
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)

// ✅ functional form — each receives the pending value, adds +3
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

The direct form uses the `count` captured in the current render (which batching doesn't change), so all three compute the same result and the last one wins. The functional form queues each updater and React runs them **in order against the latest value**, with no stale closures.

Here each handler does a single update, so the direct form would work too — but `prev => …` is the **safe default** whenever the new state depends on the previous one.

## Notes

- **State updates are async.** `setCount` schedules a re-render; `count` keeps its value for the rest of the current render. The new value appears on the *next* render.
- **Buttons set `type="button"`** so they never accidentally submit a surrounding `<form>` (a native `<button>` defaults to `type="submit"`).
- **Strict Mode** runs updaters twice in development to verify they're pure — so the updater must not have side effects.
- **Rules of Hooks.** Call `useState` only at the top level of a component — never inside loops, conditions, or nested functions.

## Links

- [useState — React reference](https://react.dev/reference/react/useState)
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
