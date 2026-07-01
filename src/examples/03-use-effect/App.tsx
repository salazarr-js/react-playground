import { useState, useEffect } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Count: ${count}`

    return () => {
      document.title = 'react-playground'
    }
  }, [count])

  return (
    <div>
      <h1>useEffect</h1>
      <p>The tab title reflects the current value.</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
