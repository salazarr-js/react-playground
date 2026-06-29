import { collections } from 'virtual:mpa-pages'

export default function App() {
  return (
    <main>
      <h1>React Playground</h1>

      {collections.map(c => (
        <section key={c.name}>
          <h2>{c.name}</h2>
          {c.pages.length > 0 ? (
            <ul>
              {c.pages.map(p => (
                <li key={p.path}>
                  <a href={p.path}>{p.name}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <em>No pages yet</em>
            </p>
          )}
        </section>
      ))}
    </main>
  )
}
