import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  appType: 'mpa',
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        main: 'index.html',
        '01-use-state': 'src/examples/01-use-state/index.html',
        '02-use-effect': 'src/examples/02-use-effect/index.html',
      },
    },
  },
})
