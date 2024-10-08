import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { state } from 'lit/decorators/state.js';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  TableController,
  type SortingState,
} from '@tanstack/lit-table';
import '@carbon/web-components/es/components/data-table/index.js';
import '@carbon/web-components/es/components/button/index.js';
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
    sortingFn: 'alphanumeric',
  }),
];

const data: Resource[] = makeData(10);

/**
 * An example table using `@tanstack/lit-table` and `@carbon/web-components` DataTable.
 *
 */

@customElement('basic-tanstack-table')
export class MyBasicTable extends LitElement {
  private tableController = new TableController<Resource>(this);

  @state()
  private _sorting: SortingState = [];

  render() {
    const table = this.tableController.table({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      state: {
        sorting: this._sorting,
      },
      onSortingChange: (updaterOrValue) => {
        if (typeof updaterOrValue === 'function') {
          this._sorting = updaterOrValue(this._sorting);
        } else {
          this._sorting = updaterOrValue;
        }
      },
      getSortedRowModel: getSortedRowModel(),
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
                  (header) => {
                    console.log(header.column.getIsSorted());
                    return html` <cds-table-header-cell>
                      <cds-button
                        kind=${'ghost'}
                        @click=${header.column.getToggleSortingHandler()}
                        class="sortable-col-button">
                        ${header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        ${{
                          asc: html`<svg
                            class="sorting-icon"
                            id="icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32">
                            <defs>
                              <style>
                                .cls-1 {
                                  fill: none;
                                }
                              </style>
                            </defs>
                            <polygon
                              points="16 4 6 14 7.41 15.41 15 7.83 15 28 17 28 17 7.83 24.59 15.41 26 14 16 4" />
                            <rect
                              id="_Transparent_Rectangle_"
                              data-name="&lt;Transparent Rectangle&gt;"
                              class="cls-1"
                              width="32"
                              height="32" />
                          </svg>`,
                          desc: html`<svg
                            class="sorting-icon-desc sorting-icon"
                            id="icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32">
                            <defs>
                              <style>
                                .cls-1 {
                                  fill: none;
                                }
                              </style>
                            </defs>
                            <polygon
                              points="16 4 6 14 7.41 15.41 15 7.83 15 28 17 28 17 7.83 24.59 15.41 26 14 16 4" />
                            <rect
                              id="_Transparent_Rectangle_"
                              data-name="&lt;Transparent Rectangle&gt;"
                              class="cls-1"
                              width="32"
                              height="32" />
                          </svg>`,
                        }[header.column.getIsSorted() as string] ?? null}
                      </cds-button>
                    </cds-table-header-cell>`;
                  }
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
                    html`<cds-table-cell>
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
    .sortable-col-button {
      width: calc(100% + 1rem);
      transform: translateX(-1rem);
    }
    .sorting-icon {
      width: 1rem;
      height: 1rem;
    }
    .sorting-icon-desc {
      transform: rotate(0.5turn);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'basic-tanstack-table': MyBasicTable;
  }
}
