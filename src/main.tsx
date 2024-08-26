import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Column, Grid } from '@carbon/react'
import { QueryClient,
  QueryClientProvider, } from '@tanstack/react-query'

import { ResizableCols } from './ResizableCols'
import { TableWithSearch } from './TableWithSearch'
import { PaginationExample } from './Pagination'
import { WithSelectableRows } from './WithSelectableRows'
import { WithBatchActions } from './WithBatchActions'
import { WithExpansion } from './WithExpansion'
import { WithInfiniteScroll } from './WithInfiniteScroll'

import './index.scss'
import { WithRowClick } from './WithRowClick'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
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
        <Column sm={4} md={8} lg={16}>
          <WithExpansion />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <WithInfiniteScroll />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <WithRowClick />
        </Column>
      </Grid>
    </StrictMode>
  </QueryClientProvider>,
)
