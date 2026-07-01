import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { ExampleFooter } from '@/components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <ExampleFooter />
  </StrictMode>
)
