/// <reference types="vite/client" />
declare module 'virtual:mpa-pages' {
  export const collections: { name: string; pages: { name: string; path: string }[] }[]
}
