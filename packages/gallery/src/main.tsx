import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  CodeSnippet,
  Column,
  Grid,
  Header,
  HeaderContainer,
  HeaderName,
} from '@carbon/react'
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'

// Imported from local monorepo packages directory
import { ResizableCols } from 'resizing'
import { PaginationExample } from 'pagination'
import { GlobalFilter } from 'global-filter'
import { SortableColumns } from 'sortable'
import { CustomizeColumns } from 'customize-columns'
import { EditableCells } from 'editable-cells'

import { WithSelectableRows } from './WithSelectableRows'
import { WithBatchActions } from './WithBatchActions'
import { WithExpansion } from './WithExpansion'
import { WithInfiniteScroll } from './WithInfiniteScroll'
import { WithRowClick } from './WithRowClick'
import { WithStickyColumn } from './WithStickyColumn'
import { WithNestedRows } from './WithNestedRows'
import { WithFilterFlyout } from './WithFilterFlyout'

import './index.scss'
const queryClient = new QueryClient()

const renderUIShellHeader = () => (
  <HeaderContainer
    render={() => (
      <Header aria-label="Tanstack Carbon DataTable">
        <HeaderName href="/" prefix="Carbon">
          DataTable / <CodeSnippet hideCopyButton type='inline'>@tanstack/table</CodeSnippet>explorations
        </HeaderName>
      </Header>
    )}
  />
);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      {renderUIShellHeader()}
      <Grid className='page-grid'>
        <Column sm={4} md={8} lg={16}>
          <ResizableCols />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <GlobalFilter />
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
        <Column sm={4} md={8} lg={16}>
          <SortableColumns />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <WithStickyColumn />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <WithNestedRows />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <CustomizeColumns />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <EditableCells />
        </Column>
        <Column sm={4} md={8} lg={16}>
          <WithFilterFlyout />
        </Column>
      </Grid>
    </StrictMode>
  </QueryClientProvider>,
)
