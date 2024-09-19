import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  TableController,
} from '@tanstack/lit-table'
import '@carbon/web-components/es/components/data-table/index.js';
import '@carbon/web-components/es/components/overflow-menu/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/tearsheet/index.js';
import Column from '@carbon/web-components/es/icons/column/16';
import { CDSTableToolbarSearch } from '@carbon/web-components/es';
// import { DragDropManager } from '@dnd-kit/dom';
// import { Sortable } from '@dnd-kit/dom/sortable';

import { makeData } from './makeData';


type Resource = {
  id: string
  name: string
  rule: string
  status: string
  other: string
  example: string
}

const columnHelper = createColumnHelper<Resource>()

const columns = [
  columnHelper.accessor(row => row.name, {
    id: 'lastName',
    cell: info => html`<i>${info.getValue()}</i>`,
    header: () => html`<span>Name</span>`,
  }),
  columnHelper.accessor('rule', {
    header: () => 'Rule',
    cell: info => info.renderValue(),
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
]

const data: Resource[] = makeData(10);

/**
 * An example table using `@tanstack/lit-table` and `@carbon/web-components` DataTable.
 *
 */

@customElement('basic-tanstack-table')
export class MyBasicTable extends LitElement {
  private tableController = new TableController<Resource>(this);

  @state()
  private _globalFilter = '';

  @state()
  private _tearsheetOpen = false;

  private _toggleTearsheet() {
    this._tearsheetOpen = !this._tearsheetOpen;
  }

  
  render() {
    const table = this.tableController.table({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      state: {
        globalFilter: this._globalFilter,
      }
    })

    interface toolbarSearchDetail {
      detail: {
        value: string;
      }
    }
    interface searchFull extends CDSTableToolbarSearch, toolbarSearchDetail {}

    return html`
      <cds-table>
      <cds-table-toolbar slot="toolbar">
          <cds-table-toolbar-content>
            <cds-table-toolbar-search
              placeholder="Filter table"
              @cds-search-input=${(e: searchFull) => this._globalFilter = e.detail.value}
            ></cds-table-toolbar-search>
            <cds-button
              @click=${this._toggleTearsheet}
              tooltipText='Customize columns'
              kind='ghost'>${Column({
                slot: 'icon',
                class: `customize-col-icon`,
              })}</cds-button>
          </cds-table-toolbar-content>
        </cds-table-toolbar>
        <cds-table-head>
          ${repeat(
            table.getHeaderGroups(),
            headerGroup => headerGroup.id,
            headerGroup =>
              html`<cds-table-header-row>
              ${repeat(
                headerGroup.headers,
                header => header.id,
                header =>
                  html` <cds-table-header-cell>
                    ${header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </cds-table-header-cell>`
              )}</cds-table-header-row>`
          )}
        </cds-table-head>
        <cds-table-body>
          ${repeat(
            table.getRowModel().rows,
            row => row.id,
            row => html`
              <cds-table-row>
                ${repeat(
                  row.getVisibleCells(),
                  cell => cell.id,
                  cell =>
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
      <cds-tearsheet
        class='customize-col-tearsheet'
        ?open=${this._tearsheetOpen}
        prevent-close-on-click-outside
        width='narrow'
        @cds-tearsheet-closed=${() => this._tearsheetOpen = false}
      >
          <span slot='title'>Customize column order</span>
        content
      </cds-tearsheet>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      place-items: center;
    }

    .customize-col-icon {
      fill: var(--cds-icon-primary)
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'basic-tanstack-table': MyBasicTable
  }
}
