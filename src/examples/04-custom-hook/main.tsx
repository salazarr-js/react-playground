import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from './App'
import { PageLayout } from '@/components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageLayout>
      <App />
    </PageLayout>
  </StrictMode>
)
