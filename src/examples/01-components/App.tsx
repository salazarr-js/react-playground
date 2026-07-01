import { useState } from 'react'
import { Button } from './components'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>01 - Components</h1>

      <Button onClick={() => setCount((prev) => prev + 1)}>
        Count is <b>{count}</b>
      </Button>
    </div>
  )
}
