import { type ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto glass rounded-[16px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {columns.map((col, idx) => (
              <th key={typeof col.accessorKey === 'string' ? col.accessorKey : idx} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-gray-400">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-gray-50/80 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td key={typeof col.accessorKey === 'string' ? col.accessorKey : colIndex} className="p-5 whitespace-nowrap text-sm text-[#0A192F]">
                    {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
