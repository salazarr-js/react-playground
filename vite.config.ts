import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import mpaPlugin from './vite-plugin-mpa'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    mpaPlugin({
      dirs: ['src/examples', 'src/projects'],
      entry: 'main.tsx',
    }),
    react()
  ],
})
