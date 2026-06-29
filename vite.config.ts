import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mpaPlugin from './vite-plugin-mpa'

export default defineConfig({
  plugins: [
    mpaPlugin({
      dir: 'src/examples',
      entry: 'main.tsx',
    }),
    react()
  ],
})
