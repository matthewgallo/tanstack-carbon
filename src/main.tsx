import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.scss'
import { TableWithSearch } from './TableWithSearch'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <TableWithSearch />
  </StrictMode>,
)
