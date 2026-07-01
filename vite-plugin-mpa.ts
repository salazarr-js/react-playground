import type { Plugin } from 'vite'
import { normalizePath, send } from 'vite'
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'

interface Options {
  entry: string // required — per-folder entry file, e.g. 'main.tsx' (React) or 'main.ts' (Vue)
  dirs?: string[] // default ['src/pages'] — one collection per dir; basename becomes the collection name/URL prefix
  template?: string // default 'template.html'
}

const VIRTUAL_ID = 'virtual:mpa-pages'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID // \0 marks it virtual so other plugins skip it
const SUFFIX = '.html'
const MAIN = 'index.html' // the main page (root index.html), served by Vite
// ids resolveId/load may claim: the pages module (matched by suffix — the resolved
// id is \0-prefixed) or any '*.html'. A filter narrows which ids reach the handlers.
const ID_FILTER = /virtual:mpa-pages$|\.html$/

/** Resolve to an absolute path normalized to POSIX, so id comparisons match on Windows. */
const norm = (...segments: string[]) => normalizePath(resolve(...segments))

/** One discovered collection: its source dir, name, URL/file prefixes, and pages. */
interface Collection {
  dir: string // 'src/examples'
  name: string // 'examples' — basename(dir); used as collection name and URL prefix
  urlBase: string // '/examples'
  filePrefix: string // 'examples/'
  names: string[] // page folder names, sorted
}

/**
 * Each direct subfolder of `dir` that contains `entry` becomes a page.
 * Returns the folder names (= page names), sorted for stable ordering.
 */
function discover(root: string, dir: string, entry: string): string[] {
  const base = resolve(root, dir)
  if (!existsSync(base)) return []
  return readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(join(base, d.name, entry)))
    .map(d => d.name)
    .sort()
}

/**
 * Fill the template's placeholders for one example: title and entry script.
 * Used in both dev (middleware) and build (load hook) so the two never diverge.
 */
function renderExample(
  template: string,
  name: string,
  dir: string,
  entry: string,
  sitePrefix: string
): string {
  const src = `/${dir}/${name}/${entry}` // root-absolute URL Vite understands
  const title = sitePrefix ? `${sitePrefix} | ${name}` : name // 'React Playground | 01-components'
  return template
    .replace('__TITLE__', title)
    .replace('__ENTRY__', `<script type="module" src="${src}"></script>`)
}

/**
 * Turns each subfolder of every `dir` that has an `entry` file into its own page,
 * served from one shared `template.html` (no per-folder HTML). Each dir is a
 * "collection" (its basename, e.g. `examples`/`projects`) that becomes the URL
 * prefix, so pages live at `/examples/01` and `/projects/01` and never collide.
 * The main `index.html` stays physical (Vite serves it); only the discovered
 * pages are virtual HTML synthesized here. Also exposes a `virtual:mpa-pages`
 * module — `{ name, pages: { name, path }[] }[]` — so the main page can render a
 * grouped index and pages can build prev/next navigation within their collection.
 *
 * @param opts - see {@link Options}; `entry` is required, the rest are optional.
 * @returns the Vite plugin.
 */
export default function mpa(opts: Options): Plugin {
  const { entry } = opts
  const dirs = opts.dirs ?? ['src/pages']
  const templatePath = opts.template ?? 'template.html'

  // Populated across hooks (config → configResolved), then read in load/serve.
  // Paths are normalized to POSIX so id comparisons work the same on Windows.
  let root = process.cwd()
  let collections: Collection[] = []
  let template = ''
  let sitePrefix = '' // main page <title>, prefixed onto example titles
  const fileToPage = new Map<string, { name: string; dir: string }>() // abs '.../examples/01.html' → page

  /** (Re)discover every collection's pages against the current `root`. */
  const buildCollections = () => {
    collections = dirs.map(dir => {
      const name = basename(dir) // 'src/examples' → 'examples'
      return {
        dir,
        name,
        urlBase: `/${name}`,
        filePrefix: `${name}/`,
        names: discover(root, dir, entry),
      }
    })
  }

  /** (Re)read the shared template and the main page's <title> prefix. */
  const readTemplates = () => {
    template = readFileSync(resolve(root, templatePath), 'utf-8')
    const mainHtml = readFileSync(resolve(root, MAIN), 'utf-8')
    sitePrefix = mainHtml.match(/<title>([^<]*)<\/title>/)?.[1].trim() ?? ''
  }

  /** Rebuild the absolute-path → page map from the current collections. */
  const mapFiles = () => {
    fileToPage.clear()
    for (const c of collections)
      for (const n of c.names)
        fileToPage.set(norm(root, `${c.filePrefix}${n}${SUFFIX}`), { name: n, dir: c.dir })
  }

  /** Stable signature of the current page set, to detect add/remove during dev. */
  const signature = () => collections.map(c => `${c.name}:${c.names.join('|')}`).join('~')

  return {
    name: 'vite-plugin-mpa',

    /**
     * Discover pages and register them as MPA build inputs: the physical main
     * page plus one virtual `<collection>/<name>.html` per page. `appType: 'mpa'`
     * makes Vite serve on-disk HTML and not fall back to index.html on unknown
     * routes. Input keys are namespaced by collection so names can't collide.
     */
    config() {
      root = process.cwd()
      buildCollections()
      const input: Record<string, string> = { index: MAIN }
      for (const c of collections)
        for (const n of c.names) input[`${c.name}/${n}`] = `${c.filePrefix}${n}${SUFFIX}`
      return { appType: 'mpa', build: { rolldownOptions: { input } } }
    },

    /**
     * Cache the resolved root, read the template + main page title, and build the
     * collections + file→page map. These are refreshed on demand by the dev watcher.
     */
    configResolved(c) {
      root = c.root
      readTemplates()
      buildCollections()
      mapFiles()
    },

    /**
     * Claim our two kinds of virtual id: the pages module, and each page's .html
     * (returning its absolute path so the build emits dist/examples/01.html). The
     * `filter` narrows which ids reach the handler (perf; the guards still run).
     */
    resolveId: {
      filter: { id: ID_FILTER },
      handler(id) {
        if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
        if (id.endsWith(SUFFIX)) {
          const abs = norm(root, id) // id arrives as 'examples/01.html'
          if (fileToPage.has(abs)) return abs
        }
        return null
      },
    },

    /**
     * Provide the content for the ids claimed above: the pages list as a JS
     * module, or the rendered HTML for a page. The `filter` matches the resolved
     * virtual id (suffix, since it's `\0`-prefixed) or any '*.html'.
     */
    load: {
      filter: { id: ID_FILTER },
      handler(id) {
        if (id === RESOLVED_VIRTUAL_ID) {
          const out = collections.map(c => ({
            name: c.name,
            pages: c.names.map(n => ({ name: n, path: `${c.urlBase}/${n}` })),
          }))
          return `export const collections = ${JSON.stringify(out)}`
        }
        const page = fileToPage.get(id)
        if (page) return renderExample(template, page.name, page.dir, entry, sitePrefix)
        return null
      },
    },

    /**
     * Dev only: (1) hot-reload when the page set or the template/main page title
     * changes, and (2) serve the page HTML on request. There is no file on disk,
     * so we render it and run it through transformIndexHtml (for HMR / React Fast
     * Refresh). Anything we don't handle is passed to Vite via next().
     */
    configureServer(server) {
      const templateAbs = norm(root, templatePath)
      const mainAbs = norm(root, MAIN)

      const invalidatePages = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) server.moduleGraph.invalidateModule(mod) // main page re-imports the new list
      }

      // A page folder/entry was added or removed under any collection → re-discover;
      // if the set changed, refresh the map, invalidate the pages module, and
      // reload. (handleHotUpdate would miss this — it only fires for files already
      // in the module graph, not brand-new folders.)
      const onPagesChanged = (file: string) => {
        const f = norm(file)
        if (!collections.some(c => f.startsWith(norm(root, c.dir) + '/'))) return
        const before = signature()
        buildCollections()
        if (signature() === before) return // entry set unchanged → nothing to do
        mapFiles()
        invalidatePages()
        server.hot.send({ type: 'full-reload' })
      }
      for (const ev of ['add', 'unlink', 'addDir', 'unlinkDir'] as const) {
        server.watcher.on(ev, onPagesChanged)
      }

      // The shared template or the main page <title> was edited → re-read and
      // reload, so the change shows without a dev restart (no stale cache).
      server.watcher.on('change', file => {
        const f = norm(file)
        if (f !== templateAbs && f !== mainAbs) return
        readTemplates()
        server.hot.send({ type: 'full-reload' })
      })

      const re = /^\/([^/]+)\/(.+?)(?:\.html)?\/?$/ // /<collection>/<name>[.html][/]
      server.middlewares.use(async (req, res, next) => {
        // Only intercept HTML page navigations; let assets/JS/etc. fall through.
        if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) return next()
        const url = (req.url ?? '/').split('?')[0]
        if (url === '/') return next() // main page is physical → Vite serves it

        // Resolve <collection>/<name>; unknown route → rewrite to the main page (it
        // lists everything, so it doubles as the not-found page).
        const m = url.match(re)
        const collection = m && collections.find(c => c.name === m[1])
        const name = m?.[2]
        if (!collection || !name || !collection.names.includes(name)) {
          req.url = '/'
          return next()
        }

        const html = renderExample(template, name, collection.dir, entry, sitePrefix)
        const out = await server.transformIndexHtml(url, html, req.originalUrl)
        send(req, res, out, 'html', { headers: server.config.server.headers }) // adds etag/304/cache like Vite's own HTML middleware
      })
    },
  }
}
