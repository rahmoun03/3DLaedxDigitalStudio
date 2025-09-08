import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Laedx from './Laedx.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Laedx />
  </StrictMode>,
)
