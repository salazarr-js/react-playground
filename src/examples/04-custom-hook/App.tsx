
import { useFetch } from './hooks'

const url = 'https://dummyjson.com/quotes'

export default function App() {
  const { data, error, loading } = useFetch(url)

  const title = <h1>04 Custom Hook</h1>

  if (loading) {
    return <div>
      {title}
      <p>Loading...</p>
    </div>
  }

  if (error) {
    return <div>
      {title}
      <p>Error: {error.message}</p>
    </div>
  }

  return <div>
    {title}
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}
