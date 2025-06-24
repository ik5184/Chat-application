import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CountProvider } from './components/contextData.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CountProvider>
    <App/> 
    </CountProvider>
  </StrictMode>,
)
