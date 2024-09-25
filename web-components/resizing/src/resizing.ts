import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  TableController,
} from '@tanstack/lit-table';
import '@carbon/web-components/es/components/data-table/index.js';
import { makeData } from './makeData';

type Resource = {
  id: string;
  name: string;
  rule: string;
  status: string;
  other: string;
  example: string;
};

const columnHelper = createColumnHelper<Resource>();

const columns = [
  columnHelper.accessor((row) => row.name, {
    id: 'lastName',
    cell: (info) => html`<i>${info.getValue()}</i>`,
    header: () => html`<span>Name</span>`,
  }),
  columnHelper.accessor('rule', {
    header: () => 'Rule',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('status', {
    header: () => html`<span>Status</span>`,
  }),
  columnHelper.accessor('other', {
    header: 'Other',
  }),
  columnHelper.accessor('example', {
    header: 'Example',
  }),
];

const data: Resource[] = makeData(10);

/**
 * An example table using `@tanstack/lit-table` and `@carbon/web-components` DataTable.
 *
 */

@customElement('resizable-columns')
export class ResizableColumns extends LitElement {
  private tableController = new TableController<Resource>(this);

  render() {
    const table = this.tableController.table({
      columns,
      data,
      columnResizeMode: 'onChange',
      columnResizeDirection: 'ltr',
      getCoreRowModel: getCoreRowModel(),
    });

    return html`
      <cds-table>
        <cds-table-head>
          ${repeat(
            table.getHeaderGroups(),
            (headerGroup) => headerGroup.id,
            (headerGroup) =>
              html`<cds-table-header-row>
                ${repeat(
                  headerGroup.headers,
                  (header) => header.id,
                  (header) =>
                    html` <cds-table-header-cell
                      class="resize-col"
                      colspan="${header.colSpan}"
                      style="width: ${header.getSize()}px">
                      ${flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      ${header.isPlaceholder
                        ? null
                        : html`<div
                            class="resizer ${table.options
                              .columnResizeDirection} ${header.column.getIsResizing()
                              ? 'is-resizing'
                              : ''}"
                            @dblclick="${() => header.column.resetSize()}"
                            @mousedown="${header.getResizeHandler()}"
                            @touchstart="${header.getResizeHandler()}" />`}
                    </cds-table-header-cell>`
                )}</cds-table-header-row
              >`
          )}
        </cds-table-head>
        <cds-table-body>
          ${repeat(
            table.getRowModel().rows,
            (row) => row.id,
            (row) => html`
              <cds-table-row>
                ${repeat(
                  row.getVisibleCells(),
                  (cell) => cell.id,
                  (cell) =>
                    html` <cds-table-cell>
                      ${flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </cds-table-cell>`
                )}
              </cds-table-row>
            `
          )}
        </cds-table-body>
      </cds-table>
    `;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      place-items: center;
    }

    .resize-col {
      position: relative;
    }

    .resizer {
      position: absolute;
      top: 0;
      height: 100%;
      width: 5px;
      background: rgba(0, 0, 0, 0.5);
      cursor: col-resize;
      user-select: none;
      touch-action: none;
    }

    .resizer.ltr {
      right: 0;
    }

    .resizer.rtl {
      left: 0;
    }

    .resizer.is-resizing {
      background: blue;
      opacity: 1;
    }

    @media (hover: hover) {
      .resizer {
        opacity: 0;
      }

      *:hover > .resizer {
        opacity: 1;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'resizable-columns': ResizableColumns;
  }
}
