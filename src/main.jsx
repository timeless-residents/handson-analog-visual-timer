import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Analogtimer from './Analogtimer.jsx'

const App = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Analogtimer />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
