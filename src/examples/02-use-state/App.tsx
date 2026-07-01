import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>02 - useState</h1>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount(prev => prev + 1)}>+1</button>
      <button type="button" onClick={() => setCount(prev => prev - 1)}>-1</button>
      <button type="button" onClick={() => setCount(0)}>reset</button>
    </div>
  )
}
