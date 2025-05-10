import '@picocss/pico/css/pico.red.min.css'
import './main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './userWorker'
import { IconoirProvider } from 'iconoir-react/regular'
import { MonacoProvider } from './components/MonacoContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IconoirProvider>
      <MonacoProvider>
        <App />
      </MonacoProvider>
    </IconoirProvider>
  </StrictMode>,
)
