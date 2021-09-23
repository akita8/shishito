import { useState } from "react";
import classnames from "classnames";

import style from "./Table.module.scss";

export interface SortOrder {
  column: number;
  ascending: boolean;
}

export interface Header {
  label: string;
  onSort?: (order: SortOrder) => void;
}

export interface Row<T> {
  id: number;
  cells: T[];
}

interface TableProps<T> {
  headers: Header[];
  rows: Row<T>[];
  onRowSelection?: (ids: number[]) => void;
}

export const Table = <T extends number | string | null>({
  headers,
  rows,
  onRowSelection,
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Array<number>>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  return (
    <table className={style.Table}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={h.label}
              onClick={() => {
                if (!h.onSort) return;
                const order: SortOrder = { column: i, ascending: true };
                if (sortOrder && sortOrder.column === i) {
                  order.ascending = !sortOrder.ascending;
                }
                setSortOrder(order);
                h.onSort(order);
              }}
            >
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.id}
            onClick={() => {
              if (!onRowSelection) return;
              const idIndex = selectedRows.indexOf(r.id);
              const ids = [...selectedRows];
              if (idIndex === -1) {
                ids.push(r.id);
              } else {
                ids.splice(idIndex, 1);
              }
              setSelectedRows(ids);
              onRowSelection(ids);
            }}
            className={classnames({
              [style.Selected]: selectedRows.includes(r.id),
            })}
          >
            {r.cells.map((c, i) => (
              <td key={`cell_${i}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
