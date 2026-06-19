import { type ReactNode, isValidElement } from 'react';

// GENERIC: <T> represents whatever data model is passed into the table
export interface DataTableColumn<T> {
  header: string;
  // Optional unique ID in case you have duplicate/empty headers
  id?: string;
  // accessor can be a strict key of T, or a render function returning a ReactNode
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  rowKey: (row: T) => string;
  emptyState?: ReactNode;
}

export function DataTable<T>({ columns, data, rowKey, emptyState }: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-600">
        {emptyState ?? 'No records found.'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-slate-500">
          <tr>
            {columns.map((column, index) => (
              <th
                // Use id if provided, fallback to header, fallback to index
                key={column.id || column.header || `col-${index}`}
                className={`px-6 py-4 text-left font-semibold ${column.width ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-slate-50 transition-colors">
              {columns.map((column, index) => {
                const columnKey = column.id || column.header || `col-${index}`;

                // Strict type-safe cell rendering with safety check
                const cellValue =
                  typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : row[column.accessor];

                // Prevent React from crashing if the value is an un-renderable object
                const cell =
                  typeof cellValue === 'object' && cellValue !== null && !isValidElement(cellValue)
                    ? JSON.stringify(cellValue)
                    : (cellValue as ReactNode);

                return (
                  <td key={columnKey} className="px-6 py-4 align-middle text-slate-700">
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
