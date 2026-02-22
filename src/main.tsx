import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PluginProvider, getRegisteredSlots } from './plugins/PluginContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PluginProvider slots={getRegisteredSlots()}>
      <App />
    </PluginProvider>
  </StrictMode>,
)
