# useState

`useState` is a React Hook that lets a component remember values between renders. When state changes, React re-renders the component with the new value.

## Signature

```ts
const [state, setState] = useState(initialValue)
```

- `state` — the current value
- `setState` — function to update it and trigger a re-render
- `initialValue` — only used on the first render

## Key rules

- Only call it at the top level of a component (not inside loops or conditions).
- Each call creates an independent piece of state.
- State updates are asynchronous — the new value is available on the next render, not immediately after calling `setState`.

## Functional updates

When the new state depends on the previous value, pass a function instead of a value:

```ts
setCount(prev => prev + 1)
```

This avoids stale closures when updates are batched.

## Links

- [useState — React docs](https://react.dev/reference/react/useState)
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
