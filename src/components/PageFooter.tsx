import { collections } from 'virtual:mpa-pages'
import { normalize } from '@/utils'

/** PageLayout footer: prev/next links within the collection + a back-to-index link. */
export default function PageFooter() {
  const current = normalize(window.location.pathname)

  // Match the current page; prev/next stay within its collection.
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
    <footer className="bg-gray-100">
      <div className="page-container grid grid-cols-1 gap-4 border-t border-gray-300 py-8 text-center xs:grid-cols-3">
        <span className="xs:text-left">
          {prev && (
            <a href={prev.path}>{prev.name}</a>
          )}
        </span>

        <a href="/">
          All Examples
        </a>

        <span className="xs:text-right">
          {next && (
            <a href={next.path}>{next.name}</a>
          )}
        </span>
      </div>
    </footer>
  )
}
