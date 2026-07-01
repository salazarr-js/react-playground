/** Normalize a URL path for comparison. */
export const normalize = (path: string) => path.replace(/\.html$/, '').replace(/\/$/, '')
