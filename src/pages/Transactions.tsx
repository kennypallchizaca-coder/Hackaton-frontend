import { useState } from 'react';
import { Filter, Download, Activity, Bitcoin, Loader2 } from 'lucide-react';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { type Transaction } from '../data/mockTransactions';
import { useTransactions } from '../hooks/useTransactions';

export function Transactions() {
  const [filter, setFilter] = useState('All');
  const { data: transactions, isLoading } = useTransactions();
  
  const filters = ['All', 'Completed', 'Pending', 'Expired'];

  const filteredData = filter === 'All' 
    ? transactions 
    : transactions.filter(t => t.status.toLowerCase() === filter.toLowerCase());

  const columns: Column<Transaction>[] = [
    {
      header: 'Transaction ID',
      accessorKey: 'id',
      cell: (item) => <span className="font-mono text-white/90">{item.id}</span>
    },
    {
      header: 'Date & Time',
      accessorKey: 'date',
      cell: (item) => <span className="text-text-gray">{new Date(item.date).toLocaleString()}</span>
    },
    {
      header: 'Store',
      accessorKey: 'store',
    },
    {
      header: 'Network',
      accessorKey: 'network',
      cell: (item) => (
        <span className="flex items-center gap-2">
           {item.network === 'Lightning' ? <Activity size={16} className="text-accent-blue" /> : <Bitcoin size={16} className="text-status-purple" />}
           {item.network}
        </span>
      )
    },
    {
      header: 'Amount',
      accessorKey: 'amountBTC',
      cell: (item) => (
         <div className="flex flex-col">
            <span className="font-bold">{item.amountBTC} BTC</span>
            <span className="text-xs text-text-gray">{item.amountUSD}</span>
         </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item) => {
         const variants: Record<string, "success" | "warning" | "error" | "neutral"> = {
            completed: "success",
            pending: "warning",
            expired: "neutral"
          };
          return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-6 border-transparent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Transactions</h1>
          <p className="text-text-gray">Manage and export your complete payment history.</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-medium">
           <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-y border-white/5 sticky top-20 z-10 bg-bg-dark/80 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-white text-black' 
                  : 'bg-white/5 text-text-gray hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
          <Filter size={16} className="mr-2" /> Advanced Filters
        </button>
      </div>

      <div className="mt-4">
         {isLoading ? (
           <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent-blue" size={32} /></div>
         ) : (
           <DataTable data={filteredData} columns={columns} keyExtractor={(item) => item.id} />
         )}
      </div>
    </div>
  );
}
