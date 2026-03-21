import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, className }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto binance-card border-none bg-transparent", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-binance-border bg-binance-gray/20">
            {columns.map((col, idx) => (
              <th 
                key={typeof col.accessorKey === 'string' ? col.accessorKey : idx} 
                className="p-4 text-[10px] font-black text-binance-muted uppercase tracking-widest whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-binance-border bg-transparent">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-12 text-center text-binance-muted text-sm font-medium">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 rounded-full bg-binance-gray/30 flex items-center justify-center">
                     {/* Empty icon */}
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12"/><path d="M14 18l4 4"/><path d="M18 18l-4 4"/></svg>
                   </div>
                   No records found
                </div>
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-white/5 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td key={typeof col.accessorKey === 'string' ? col.accessorKey : colIndex} className="p-4 whitespace-nowrap text-sm text-binance-text font-medium">
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
