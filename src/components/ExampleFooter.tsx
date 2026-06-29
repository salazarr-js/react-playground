import { collections } from 'virtual:mpa-pages'

/** Normalize a URL path for comparison: drop a trailing `.html` and any trailing slash. */
const normalize = (path: string) => path.replace(/\.html$/, '').replace(/\/$/, '')

/**
 * Footer shown on every example page: links to the previous/next example and
 * back to the index. It locates the current page by matching the browser path
 * against `virtual:mpa-pages`, so it stays in sync as examples are added.
 */
export default function ExampleFooter() {
  const current = normalize(window.location.pathname)

  // Find the current page within its collection, so prev/next stays inside one
  // collection — you never jump from a hook cheatsheet into a full project.
  let siblings: { name: string; path: string }[] = []
  let idx = -1
  for (const c of collections) {
    const i = c.pages.findIndex(p => normalize(p.path) === current)
    if (i >= 0) {
      siblings = c.pages
      idx = i
      break
    }
  }
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null

  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #ccc',
      }}
    >
      <span style={{ flex: 1 }}>
        {prev && <a href={prev.path}>← {prev.name}</a>}
      </span>
      <a href="/" style={{ flex: 1, textAlign: 'center' }}>
        all examples
      </a>
      <span style={{ flex: 1, textAlign: 'right' }}>
        {next && <a href={next.path}>{next.name} →</a>}
      </span>
    </footer>
  )
}
