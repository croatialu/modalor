import { ModalorProvider } from '@modalor/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from './components/ui/provider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <ModalorProvider>
        <App />
      </ModalorProvider>
    </Provider>
  </StrictMode>,
)
