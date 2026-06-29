# vite-plugin-examples — Brief

Plugin Vite propio para el react-playground. Auto-descubre ejemplos y los sirve como MPA
sin requerir ningún archivo de configuración por carpeta de ejemplo.

Ver investigación previa en `../mpa-plugin-research.md`.

---

## Objetivo

Que agregar un ejemplo sea esto:

```
src/examples/
  03-use-ref/
    main.tsx     ← único requisito
    App.tsx
    hooks/
```

Y aparezca solo en el dev server. Sin tocar ningún archivo de config.

---

## Estructura de proyecto

```
react-playground/
  src/
    examples/
      01-use-state/
        main.tsx
        App.tsx
        components/
        hooks/
      02-use-effect/
        main.tsx
        App.tsx
  template.html               ← único HTML, compartido por todos los ejemplos
  vite.config.ts
  vite-plugin-examples.ts     ← el plugin
```

---

## Convención

- Carpeta bajo `src/examples/` con nombre `NN-nombre-kebab`
- Debe tener un `main.tsx` (configurable) — ese es el único requisito
- Todo lo demás dentro de la carpeta es libre: `App.tsx`, `components/`, `hooks/`, `README.md`

---

## Qué hace el plugin

### 1. Discovery — hook `config`

Escanea `src/examples/*/main.tsx` con glob al arrancar.

Sets `appType: 'mpa'` to disable Vite's SPA fallback (otherwise all unknown URLs serve root `index.html`).

Builds `rolldownOptions.input` automatically (Vite 8 uses Rolldown, not Rollup):
```ts
{
  '01-use-state': '/abs/path/src/examples/01-use-state/main.tsx',
  '02-use-effect': '/abs/path/src/examples/02-use-effect/main.tsx',
}
```

### 2. Dev server — hook `configureServer`

Middleware que intercepta requests:

| Request | Respuesta |
|---|---|
| `GET /` | Landing page — lista HTML con links a todos los ejemplos |
| `GET /01-use-state` | `template.html` con `<script src="/src/examples/01-use-state/main.tsx">` inyectado |
| `GET /01-use-state/` | idem |
| cualquier otra ruta | 404 con lista de ejemplos disponibles |

El HTML se genera en memoria — nunca se escribe al disco.

### 3. HTML virtual — hooks `resolveId` + `load`

Para el build, virtualiza los HTML de cada ejemplo en memoria.

Vite nunca busca archivos `.html` en disco para los ejemplos — el plugin los sintetiza
reemplazando los placeholders del template:

```
__TITLE__  → nombre del ejemplo (ej: "01-use-state")
__ENTRY__  → <script type="module" src="/src/examples/01-use-state/main.tsx"></script>
```

---

## template.html

Un solo archivo en la raíz. Todos los ejemplos comparten este template.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>__TITLE__</title>
  </head>
  <body>
    <div id="root"></div>
    __ENTRY__
  </body>
</html>
```

---

## API del plugin

```ts
examplesPlugin({
  dir?: string      // default: 'src/examples'
  entry?: string    // default: 'main.tsx'
  template?: string // default: 'template.html'
})
```

Todos los parámetros son opcionales. Con defaults funciona out-of-the-box.

---

## DX resultante

```bash
pnpm dev
```

```
localhost:5173/              → landing: lista todos los ejemplos
localhost:5173/01-use-state  → ejemplo corriendo
localhost:5173/02-use-effect → ejemplo corriendo
```

Agregar ejemplo: crear carpeta + `main.tsx`. Recargar dev server. Aparece solo.

---

## Scope

- Sin EJS ni templating avanzado — string replace es suficiente
- Sin CLI filtering — no necesario para aprender
- Sin SPA sub-routes por página — los ejemplos no usan React Router
- Sin `htmlMinify` — dev only, no importa
- Sin watch de nuevas carpetas en caliente — `ctrl+c` + `pnpm dev` es aceptable

---

## Implementación estimada

~70 líneas en un solo archivo TypeScript. Sin dependencias extra (glob ya viene con Vite/Node).
