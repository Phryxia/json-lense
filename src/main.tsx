import '@picocss/pico/css/pico.red.min.css'
import './main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './userWorker'
import { IconoirProvider } from 'iconoir-react/regular'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IconoirProvider>
      <App />
    </IconoirProvider>
  </StrictMode>,
)
