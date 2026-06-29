# MPA Plugin Research

Evaluación de plugins existentes para decidir qué construir propio.

## Contexto

Proyecto de aprendizaje de React + TypeScript. Cada carpeta en `src/examples/` es un ejemplo
aislado. Queremos correr y ver cada ejemplo rápido, sin fricción, sin config por carpeta.

Arquitectura elegida: **single Vite project + MPA** con plugin propio.

---

## Plugins evaluados

### 1. IndexXuan/vite-plugin-mpa

**Repo**: https://github.com/IndexXuan/vite-plugin-mpa
**Stars**: 240 | **Último commit**: junio 2023 — sin mantenimiento activo

**Cómo funciona**
- Discovery automático via `fast-glob` buscando `main.{js,ts,jsx,tsx}` bajo `src/pages/`
- Construye `rollupOptions.input` mapeando el entry JS al `index.html` de la misma carpeta
- Dev server: usa `connect-history-api-fallback`, soporta `/foo`, `/foo.html`, `/foo/*` (SPA sub-routes por página)
- HTML: **requiere un `index.html` físico por carpeta** — no genera nada
- Post-build: aplana output de `dist/src/pages/foo/` → `dist/foo/`

**Config**
```ts
{ scanDir, scanFile, filename, open, defaultEntries, rewrites }
```

**Lo bueno**: discovery por glob es la idea correcta, URL rewriting sólido con SPA sub-routes
**Lo malo**: abandonado, requiere HTML por carpeta, sin landing page en dev

---

### 2. moonlitusun/vite-plugin-mpa

**Repo**: https://github.com/moonlitusun/vite-plugin-mpa
**Stars**: 86 | **Último commit**: junio 2025 — activo

**Cómo funciona**
- Discovery: **ninguno** — pages 100% manuales en config
- HTML: **virtual** — genera el HTML en memoria desde un template compartido, inyecta `<script type="module">` y `<title>` automáticamente
- Dev server: middleware custom, URLs siempre `/<pageName>.html`
- 404 en dev muestra lista clickeable de todas las páginas registradas
- Template cacheado en `Map` — se lee del disco una sola vez

**Config**
```ts
{
  pages: {
    'page-name': { title: string, entry: string, template: string }
  },
  generateNotFoundHtml?: (pages) => string
}
```

**Lo bueno**: HTML virtual es la idea correcta (cero archivos HTML por ejemplo), template compartido, 404 con lista de páginas
**Lo malo**: sin auto-discovery, hay que registrar cada página a mano

---

### 3. emosheeep/vite-plugin-virtual-mpa

**Repo**: https://github.com/emosheeep/vite-plugin-virtual-mpa
**Stars**: activo | **Mantenimiento**: activo

**Cómo funciona**
- Discovery: manual (`pages[]`) con `scanOptions` opcional para auto-detectar carpetas
- HTML: **virtual con EJS** — un template compartido genera todos los HTML en memoria con datos por página
- Dev server: genera rewrite rules automáticamente desde el config de pages
- Soporta `transformHtml` hook, `htmlMinify`, `watchOptions`
- Build: materializa los HTML virtuales en disco

**Config**
```ts
{
  pages: Page[],
  template: string,         // global shared template (.html o .ejs)
  scanOptions: { scanDirs, entryFile, filename },
  rewrites, previewRewrites,
  transformHtml,
  watchOptions,
  htmlMinify,
  verbose
}
```

**Lo bueno**: el más completo, EJS para templates dinámicos, rewrites automáticos
**Lo malo**: demasiado para un proyecto de aprendizaje — EJS, minify, watch hooks agregan complejidad innecesaria

---

## Comparación

| Feature | IndexXuan | moonlitusun | emosheeep |
|---|---|---|---|
| Auto-discovery | glob | no | opcional |
| HTML por página | requerido | virtual | virtual |
| Template compartido | no | sí | sí (EJS) |
| URLs limpias en dev | sí | `/<name>.html` | sí |
| Landing/404 en dev | no | sí | no |
| Mantenimiento | muerto | activo | activo |
| Complejidad | media | baja | alta |

---

## Conclusión

Ninguno hace exactamente lo que necesitamos:

- **IndexXuan**: discovery correcto pero sin HTML virtual y abandonado
- **moonlitusun**: HTML virtual correcto pero sin discovery automático
- **emosheeep**: el más completo pero sobredimensionado

La solución: combinar lo mejor de los tres en un plugin propio de ~70 líneas.
Ver `docs/plugin-brief.md`.
