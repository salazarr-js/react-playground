# Components

A component is a reusable piece of UI: a JavaScript function that returns JSX. This example builds a custom `Button` and uses it inside `App`, covering the core "Describing the UI" ideas plus a bit of state.

## What this example shows

### 1. Defining & exporting a component
`Button` is a function that returns JSX, `default`-exported and re-exported through a barrel (`components/index.ts`) so it imports cleanly:

```tsx
// components/index.ts
export { default as Button } from './Button/Button'
// App.tsx
import { Button } from './components'
```

### 2. Props (`onClick`, `children`)
Props are the component's inputs. `children` is the special prop for whatever you nest between the tags. In TS they're typed with an interface:

```tsx
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode   // anything renderable
}

function Button({ onClick, children }: ButtonProps) {
  return <button className="custom-button" onClick={onClick}>{children}</button>
}
```

### 3. Event handlers & naming convention
The prop that receives the click is named **`onClick`** (`on` + event); the handler passed from the parent is an arrow function. Convention: props are `onSomething`, handler functions are `handleSomething`.

```tsx
<Button onClick={() => setCount((count) => count + 1)}>…</Button>
```

### 4. JavaScript in JSX with curly braces
`{count}` embeds a value; markup can wrap it (`<b>{count}</b>`).

### 5. State with `useState`
The counter remembers its value across renders. The **functional update** `setCount(prev => prev + 1)` uses the previous value safely:

```tsx
const [count, setCount] = useState(0)
```

## Notes

- Each component lives in its own folder with **colocated CSS** (`Button.css`, imported by the component).
- State updates are async — the new value shows on the next render, not right after `setCount`.
- `Button` sets `type="button"` explicitly: a native `<button>` defaults to `type="submit"`, which would submit a surrounding `<form>`. Always set it for non-submit buttons.
- `React.ReactNode` types the `children` prop — it accepts anything renderable (text, elements, fragments, `null`).

## Links

- [Your First Component](https://react.dev/learn/your-first-component)
- [Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Responding to Events](https://react.dev/learn/responding-to-events)
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [State: A Component's Memory (`useState`)](https://react.dev/learn/state-a-components-memory)
