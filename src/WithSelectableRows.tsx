import React, { useRef, useState, useLayoutEffect } from 'react'
import { Checkbox, DataTable, Pagination } from '@carbon/react';
const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} = DataTable;

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { makeData } from './makeData';

type Resource = {
  id: string
  name: string
  rule: string
  status: string
  other: string
  example: string
}

export const WithSelectableRows = () => {
  const columnHelper = createColumnHelper<Resource>()
  
  const [rowSelection, setRowSelection] = React.useState({})
  const [data] = useState(makeData(200))
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = [
    {
      id: 'select',
      width: 48,
      header: ({ table }) => (
        <Checkbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
            id: 'header-checkbox',
            labelText: 'header checkbox',
            hideLabel: true
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
              id: `header-checkbox__${row.id}`,
              labelText: 'row checkbox',
              hideLabel: true
            }}
          />
        </div>
      ),
    },
    columnHelper.accessor(row => row.name, {
      id: 'name',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor('rule', {
      header: () => 'Rule',
      cell: info => info.renderValue(),
    }),
    columnHelper.accessor('status', {
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor('other', {
      header: 'Other',
    }),
    columnHelper.accessor('example', {
      header: 'Example',
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
      rowSelection
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection 
    onRowSelectionChange: setRowSelection,
  })

  const tableWrap = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const tableWrapElement = tableWrap.current;
    if (tableWrapElement) {
      const tableElement = tableWrapElement.querySelector('table');
      tableElement.style.width = `${table.getCenterTotalSize()}px`;
    }
  }, [table]);

  return (
    <TableContainer
      title="Selectable rows"
      className="basic-table tanstack-example"
      style={{
        width: table.getCenterTotalSize(),
      }}
    >
      <Table
        size="lg"
        useZebraStyles={false}
        aria-label="sample table"
      >
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHeader
                  key={header.id}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={table.getState().pagination.pageIndex + 1}
        totalItems={data.length}
        pagesUnknown={false}
        pageInputDisabled={undefined}
        pageSizeInputDisabled={undefined}
        backwardText={'Previous page'}
        forwardText={'Next page'}
        pageSize={table.getState().pagination.pageSize}
        pageSizes={[10, 20, 30, 40, 50]}
        itemsPerPageText={'Items per page:'}
        onChange={({ pageSize, page }) => {
          table.setPageSize(Number(pageSize))
          table.setPageIndex(page - 1)
        }}
      />
    <p>
      {Object.keys(rowSelection).length} of{' '}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
    </p>
    </TableContainer>
  )
}
