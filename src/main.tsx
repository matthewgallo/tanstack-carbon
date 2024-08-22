import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ResizableCols } from './ResizableCols'
import './index.scss'
import { TableWithSearch } from './TableWithSearch'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResizableCols />
    <TableWithSearch />
  </StrictMode>,
)
