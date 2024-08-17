import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClientOptions, TransportMode } from '@helenejs/client'
import { ClientProvider } from '@helenejs/react'
import { App } from '@/client/app.tsx'

const clientOptions: ClientOptions = {
  mode: TransportMode.HttpSSE,
  host: window.location.hostname,
  port: import.meta.env.MODE === 'development' ? 8002 : undefined,
  errorHandler: console.error,
  secure: window.location.protocol === 'https:',
  idlenessTimeout: 600000, // 10 minutes,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientProvider clientOptions={clientOptions}>
      <App />
    </ClientProvider>
  </StrictMode>,
)
