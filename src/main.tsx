import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ResizableCols } from './ResizableCols'
import './index.scss'
import { TableWithSearch } from './TableWithSearch'
import { PaginationExample } from './Pagination'
import { Column, Grid } from '@carbon/react'
import { WithSelectableRows } from './WithSelectableRows'
import { WithBatchActions } from './WithBatchActions'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Grid>
      <Column sm={4} md={8} lg={16}>
        <ResizableCols />
      </Column>
      <Column sm={4} md={8} lg={16}>
        <TableWithSearch />
      </Column>
      <Column sm={4} md={8} lg={16}>
        <PaginationExample />
      </Column>
      <Column sm={4} md={8} lg={16}>
        <WithSelectableRows />
      </Column>
      <Column sm={4} md={8} lg={16}>
        <WithBatchActions />
      </Column>
    </Grid>
  </StrictMode>,
)
