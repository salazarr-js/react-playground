import { pages } from 'virtual:mpa-pages'

export default function App() {
  return (
    <main>
      <h1>React Playground</h1>
      
      <ul>
        {pages.map(p => (
          <li key={p.name}>
            <a href={p.path}>{p.name}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
