# useEffect

`useEffect` synchronizes a component with an external system — here, the browser tab title — running after the component commits to the screen.

## What this example shows

**Setup that syncs an external system.** The effect writes React state (`count`) into a browser API (`document.title`) after each render where the dependency changed.

```tsx
useEffect(() => {
  document.title = `Count: ${count}`
  // ...
}, [count])
```

**Cleanup.** The returned function undoes the effect. React runs it before the next setup and once when the component unmounts, so the title is restored instead of left stale.

```tsx
return () => {
  document.title = 'react-playground'
}
```

**Dependency array.** Listing `count` re-runs the effect only when `count` changes. Compared with `Object.is`.

| Dependency array | When the effect runs |
|-----------------|----------------------|
| omitted | after every render |
| `[]` | once, on mount |
| `[count]` | on mount and whenever `count` changes |

## Notes

- **StrictMode double-invoke.** In development React runs setup → cleanup → setup an extra time to stress-test that cleanup mirrors setup. Because this effect's cleanup restores the title correctly, the extra cycle is invisible. It does not happen in production.
- **When NOT to reach for an effect.** Effects are for synchronizing with systems *outside* React (the DOM, timers, subscriptions, network). Anything that can be a derived value during render or logic inside an event handler should not be an effect.
- **Data fetching caveat.** If an effect fetches, guard against race conditions with an `ignore` flag (or an `AbortController` that ignores `AbortError` on cleanup) so a stale response can't overwrite a newer one. Not needed here since `document.title` is a synchronous assignment.

## Links

- [useEffect — React docs](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
