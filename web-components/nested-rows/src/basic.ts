import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  TableController,
} from '@tanstack/lit-table'
import '@carbon/web-components/es/components/data-table/index.js';
import '@carbon/web-components/es/components/button/index.js';
import ChevronRight from '@carbon/web-components/es/icons/chevron--right/16';
import { styleMap } from 'lit/directives/style-map.js'
import { makeData } from './makeData';


type Resource = {
  id: string
  name: string
  rule: string
  status: string
  other: string
  example: string
  subRows?: Resource[]
}

const columnHelper = createColumnHelper<Resource>()

const data: Resource[] = makeData(10, 5);

/**
 * An example table using `@tanstack/lit-table` and `@carbon/web-components` DataTable.
 *
 */

@customElement('basic-tanstack-table')
export class MyBasicTable extends LitElement {
  private tableController = new TableController<Resource>(this);

  _columns = [
    columnHelper.accessor(row => row.name, {
      id: 'lastName',
      header: ({ table }) => html`
        <div class='flex'>
          <cds-button
            @click=${() => {
              const rows = table.getRowModel().rows;
              const newExpansionState = {} as {
                [ key: string]: boolean
              };
              if (!this._expandAll) {
                rows.forEach(row => {
                  newExpansionState[row.id] = true;
                });
                this._expanded = newExpansionState;
                this._expandAll = true;
              } else {
                rows.forEach(row => {
                  newExpansionState[row.id] = false;
                });
                this._expanded = newExpansionState;
                this._expandAll = false;
              }
              // doesn't seem to be working, but would expand all without having to do it manually
              // table.getToggleAllRowsExpandedHandler();
            }}
            className='row-expander'
            kind="ghost"
            size='sm'
          >
          ${ChevronRight({
            slot: 'icon',
            class: table.getIsAllRowsExpanded() ? `row-expanded-icon` : 'row-expandable-icon',
          })}
          </cds-button>
          <span>Name</span>
        </div>`,
      cell: ({ row, renderValue }) => {
        return html`
        <div
          style='${styleMap({
            paddingLeft: row.depth > 0 ? `${(row.depth * 2) + 1.5}rem` : 0,
          })}'
        >
          <div className='flex'>
            ${row.getCanExpand() ? (
              html`<cds-button
                @click=${() => {
                // row.getToggleExpandedHandler()
                  if (!row.getIsExpanded()) {
                    this._expanded = {...this._expanded, [row.id]: true};
                    return;
                  }
                  this._expanded = {...this._expanded, [row.id]: false};
                }}
                className='row-expander'
                kind='ghost'
                size='sm'
              >
              ${ChevronRight({
                slot: 'icon',
                class: row.getIsExpanded() ? `row-expanded-icon` : 'row-expandable-icon',
              })}
              </cds-button>`
            ) : (
              null
            )}
            ${renderValue()}
          </div>
        </div>`},
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

  @state()
  private _expanded = {};

  @state()
  private _expandAll = false;

  render() {
    const table = this.tableController.table({
      columns: this._columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      // onExpandedChange: (row) => console.log('onChange', row),
      getSubRows: row => row.subRows,
      state: {
        expanded: this._expanded,
      }
    })

    return html`
      <cds-table>
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

    .row-expandable-icon {
      transition: transform 150ms ease-in;
    }

    .row-expanded-icon {
      transform: rotate(0.25turn);
      transition: transform 150ms ease-in; // replace with carbon motion easing
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'basic-tanstack-table': MyBasicTable
  }

}