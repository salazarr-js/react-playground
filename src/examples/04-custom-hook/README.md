# Custom Hook (`useFetch`)

A custom Hook is a `use`-prefixed function that packages reusable stateful logic. Here `useFetch` wraps `useState` + `useEffect` so any component can fetch a URL and read back `data`, `loading`, and `error`.

## What this example shows

**A custom Hook is just a function that calls Hooks.** Its name must start with `use`, and it can call `useState`, `useEffect`, etc. It returns arbitrary values (not JSX) — here an object.

```tsx
export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  // ...
  return { data, loading, error }
}
```

**Custom Hooks share logic, not state.** Every component that calls `useFetch` gets its own independent `data`/`loading`/`error` state — the Hook shares the *behavior*, not one shared value.

**Generics keep it typed.** `useFetch<T>` lets the caller declare the response shape, so `data` is typed as `T | null` at the call site.

```tsx
const { data, error, loading } = useFetch(url)
```

**Race-condition guard.** Fetching in an Effect needs cleanup so a stale response can't overwrite a newer one. This example uses an `AbortController`: cleanup aborts the in-flight request, and the resulting `AbortError` is ignored (React's `ignore`-flag pattern, but it also cancels the network call).

```tsx
useEffect(() => {
  const abortCtrl = new AbortController()
  async function fetchData() {
    try {
      const response = await fetch(url, { signal: abortCtrl.signal })
      // ...set data
    } catch (err) {
      if ((err as Error).name === 'AbortError') return // ignore cleanup abort
      setError(err as Error)
    }
  }
  fetchData()
  return () => abortCtrl.abort()
}, [url])
```

**Re-runs on `url` change.** `[url]` in the dependency array re-fetches whenever the URL changes and aborts the previous request first.

## Notes

- **StrictMode double-invoke.** In development React runs setup → cleanup → setup once extra. The first fetch is aborted by cleanup and ignored, so the double-invoke is invisible; it does not happen in production.
- **`.finally` respects the abort.** `setLoading(false)` is skipped when the request was aborted, so a cancelled request never flips loading state for a component that has moved on.
- **When to reach for this.** Extract a custom Hook when Effect logic is duplicated across components or complex enough to deserve a name. For real apps the React docs recommend a framework's data fetching or a cache (TanStack Query, useSWR) over hand-rolled fetch Effects — moving fetching into a Hook like this makes that migration easier later.
- **`T` is a compile-time assumption, not a runtime guarantee.** `response.json()` is cast to `T` with no validation, so a response that doesn't match the declared shape passes silently and can blow up later at the point of use. Fine for a learning demo; in production validate the payload at the boundary (e.g. a `zod` schema, or a hand-written type guard) and derive `T` from that.

## Links

- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [useEffect — React docs](https://react.dev/reference/react/useEffect)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Synchronizing with Effects — fetching data](https://react.dev/learn/synchronizing-with-effects#fetching-data)
