# useEffect

`useEffect` is a React Hook for synchronizing a component with an external system — the DOM, a timer, a subscription, an API call, etc. It runs after the component renders.

## Signature

```ts
useEffect(() => {
  // setup
  return () => {
    // cleanup (optional)
  }
}, [dependencies])
```

- **Setup** — runs after every render where a dependency changed.
- **Cleanup** — runs before the next setup call and when the component unmounts. Use it to cancel subscriptions, clear timers, or undo DOM changes.
- **Dependencies** — controls when the effect re-runs:

| Dependency array | When the effect runs |
|-----------------|----------------------|
| omitted | after every render |
| `[]` | once, on mount only |
| `[a, b]` | when `a` or `b` change |

## StrictMode double-invoke

In development, React mounts every component twice to surface cleanup bugs. If your effect is idempotent and the cleanup is correct, this is harmless.

## When NOT to use useEffect

Avoid it for logic that can be expressed as a derived value or an event handler. Effects are for synchronizing with things outside React.

## Links

- [useEffect — React docs](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
