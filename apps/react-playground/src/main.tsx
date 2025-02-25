import { Provider } from "@/components/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ModalorProvider } from "@modalor/react"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <ModalorProvider>
        <App />
      </ModalorProvider>
    </Provider>
  </StrictMode>,
)
