import { useState, useEffect } from 'react';
import { ArrowLeftRight, Download, Filter, Search, ChevronDown } from '../../../components/common/Icons';
import { dashboardService } from '../api/dashboardService';
import { type Transaction } from '../../../types';
import { cn } from '../../../utils/cn';
import { SEO } from '../../../components/common/SEO';

const TABS = ['All History', 'Completed', 'Processing', 'Failed'];

const STATUS_STYLE: Record<string, string> = {
  completed: 'text-emerald-500 bg-emerald-500/10',
  processing: 'text-blue-500 bg-blue-500/10',
  failed: 'text-red-500 bg-red-500/10',
};

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All History');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dashboardService.getRecentTransactions().then(txs => {
      setTransactions(txs);
      setIsLoading(false);
    });
  }, []);

  const filtered = transactions.filter(tx => {
    const matchTab =
      activeTab === 'All History' ||
      (activeTab === 'Completed' && tx.status === 'completed') ||
      (activeTab === 'Processing' && tx.status === 'processing') ||
      (activeTab === 'Failed' && tx.status === 'failed');
    const matchSearch = !search || 
      tx.id.toLowerCase().includes(search.toLowerCase()) || 
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      tx.receiverRole.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const stats = [
    {
      label: '30D Volume',
      value: transactions.reduce((sum, tx) => sum + parseFloat(tx.amountBTC), 0).toFixed(6) + ' BTC',
      sub: null
    },
    {
      label: 'Avg Settlement',
      value: (transactions.length > 0 ? (transactions.reduce((sum, tx) => sum + parseFloat(tx.amountBTC), 0) / transactions.length) : 0).toFixed(6) + ' BTC',
      sub: null
    },
    {
      label: 'Success Rate',
      value: transactions.length === 0 ? '0%' : ((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100).toFixed(1) + '%',
      sub: null
    },
    {
      label: 'Audit Flag Rate',
      value: transactions.length === 0 ? '0%' : ((transactions.filter(t => t.compliance.riskLevel !== 'Low').length / transactions.length) * 100).toFixed(1) + '%',
      sub: null
    },
  ];

  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      <SEO 
        title="Transaction Ledger" 
        description="Monitor and audit the complete history of transactions and settlements for your KuriPay enterprise account." 
      />
      {/* Page Header */}
      <div className="border-b border-slate-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={14} className="text-blue-500" />
          <h1 className="text-[14px] font-bold text-slate-50">Ledger History</h1>
          <span className="text-[11px] text-slate-400">— Multi-role transaction audit & bridge logs</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 rounded text-[11px] text-slate-400 hover:text-slate-50 hover:border-blue-500/30 transition-colors">
          <Download size={12} />
          Export CSV
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-slate-800 border border-slate-800 rounded p-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-[16px] font-black text-slate-50">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
          {/* Tab bar + search */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4">
            <div className="flex">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-3 text-[11px] font-medium transition-colors border-b-2 -mb-px uppercase tracking-wider",
                    activeTab === tab
                      ? "text-slate-50 border-blue-500"
                      : "text-slate-400 border-transparent hover:text-slate-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID, Role or Type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-50 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors w-48"
                />
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-800 rounded text-[11px] text-slate-400 hover:text-slate-50 transition-colors">
                <Filter size={11} />
                Filter
                <ChevronDown size={10} />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 px-4 py-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider border-b border-slate-800 bg-slate-950">
            <span>Transaction ID</span>
            <span>Date</span>
            <span>Type / Recipient</span>
            <span>Value (BTC/USD)</span>
            <span className="text-right">Status</span>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-slate-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px]">Loading ledger...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <ArrowLeftRight size={28} className="opacity-20" />
              <span className="text-[12px]">No transactions found</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map(tx => (
                <div key={tx.id} className="grid grid-cols-5 px-4 py-3 text-[12px] hover:bg-white/2 transition-colors cursor-pointer">
                  <span className="font-mono text-slate-400 text-[11px]">#{tx.id}</span>
                  <span className="text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                  <div className="flex flex-col">
                    <span className="text-slate-50 font-bold capitalize">{tx.type.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{tx.receiverRole}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-50 font-bold">{tx.amountBTC} BTC</span>
                    <span className="text-[10px] text-slate-400">${tx.amountUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-end">
                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded", STATUS_STYLE[tx.status] ?? STATUS_STYLE['processing'])}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Showing {filtered.length} of {transactions.length} transactions</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
