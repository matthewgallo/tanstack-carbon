import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  TableController,
} from '@tanstack/lit-table';
import '@carbon/web-components/es/components/data-table/index.js';
import { VirtualizerController } from '@tanstack/lit-virtual';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

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

const data: Resource[] = makeData(1000);

/**
 * An example table using `@tanstack/lit-table` and `@carbon/web-components` DataTable.
 *
 */

@customElement('virtual-tanstack-table')
export class VirtualTable extends LitElement {
  private tableController = new TableController<Resource>(this);

  private tableContainerRef: Ref = createRef();

  private rowVirtualizerController: VirtualizerController<Element, Element>;

  connectedCallback() {
    this.rowVirtualizerController = new VirtualizerController(this, {
      count: data.length,
      getScrollElement: () => this.tableContainerRef.value!,
      estimateSize: () => 48,
      overscan: 5,
    });
    super.connectedCallback();
  }

  render() {
    const table = this.tableController.table({
      columns,
      data,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });
    const { rows } = table.getRowModel();

    const virtualizer = this.rowVirtualizerController.getVirtualizer();

    return html`
      <div
        class="container"
        ${ref(this.tableContainerRef)}
        style="${styleMap({
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
          height: '540px', //should be a fixed height
        })}">
        <cds-table style="display: grid">
          <cds-table-head
            style="${styleMap({
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            })}">
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) =>
                html`<cds-table-header-row
                  style="${styleMap({ display: 'flex', width: '100%' })}">
                  ${repeat(
                    headerGroup.headers,
                    (header) => header.id,
                    (header) =>
                      html` <cds-table-header-cell
                        style="${styleMap({
                          display: 'flex',
                          width: `${header.getSize()}px`,
                          alignItems: 'center',
                        })}">
                        ${header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </cds-table-header-cell>`
                  )}</cds-table-header-row
                >`
            )}
          </cds-table-head>
          <cds-table-body
            style=${styleMap({
              display: 'grid',
              height: `${virtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative', //needed for absolute positioning of rows
            })}>
            ${repeat(
              this.rowVirtualizerController.getVirtualizer().getVirtualItems(),
              (item) => item.key,
              (item) => {
                const row = rows[item.index] as Row<Resource>;
                return html`
                  <cds-table-row
                    style=${styleMap({
                      display: 'flex',
                      position: 'absolute',
                      transform: `translateY(${item.start}px)`,
                      width: '100%',
                    })}
                    ${ref((node) =>
                      this.rowVirtualizerController
                        .getVirtualizer()
                        .measureElement(node)
                    )}>
                    ${repeat(
                      row.getVisibleCells(),
                      (cell) => cell.id,
                      (cell) => html`
                        <cds-table-cell
                          style=${styleMap({
                            display: 'flex',
                            width: `${cell.column.getSize()}px`,
                            alignItems: 'center',
                          })}>
                          ${flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </cds-table-cell>
                      `
                    )}
                  </cds-table-row>
                `;
              }
            )}
          </cds-table-body>
        </cds-table>
      </div>
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'virtual-tanstack-table': VirtualTable;
  }
}
