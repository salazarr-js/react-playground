const examples = [
  { slug: '01-use-state', href: '/src/examples/01-use-state/' },
  { slug: '02-use-effect', href: '/src/examples/02-use-effect/' },
]

export default function App() {
  return (
    <div>
      <h1>react-playground</h1>
      <ul>
        {examples.map(({ slug, href }) => (
          <li key={slug}>
            <a href={href}>{slug}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
