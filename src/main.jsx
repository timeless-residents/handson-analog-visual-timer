import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Analogtimer from './Analogtimer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analogtimer />
  </StrictMode>,
)
