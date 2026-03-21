import { useState, useEffect } from 'react';
import { ArrowLeftRight, Download, Filter, Search, ChevronDown } from '../components/Icons';
import { dashboardService } from '../services/dashboardService';
import { type Transaction } from '../types';
import { cn } from '../utils/cn';

const TABS = ['All History', 'Completed', 'Processing', 'Failed'];

const STATUS_STYLE: Record<string, string> = {
  completed: 'text-[#0ECB81] bg-[#0ECB81]/10',
  processing: 'text-[#FCD535] bg-[#FCD535]/10',
  failed: 'text-[#F6465D] bg-[#F6465D]/10',
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
    const matchSearch = !search || tx.id.includes(search) || tx.store?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const stats = [
    {
      label: '30D Volume',
      value: transactions.reduce((sum, tx) => sum + parseFloat(tx.amountBTC ?? '0'), 0).toFixed(6) + ' BTC',
      sub: null
    },
    {
      label: 'Avg Settlement',
      value: '0.004 BTC',
      sub: null
    },
    {
      label: 'Success Rate',
      value: transactions.length === 0 ? '0%' : ((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100).toFixed(1) + '%',
      sub: null
    },
    {
      label: 'Pending Audits',
      value: '0',
      sub: null
    },
  ];

  return (
    <div className="min-h-full bg-[#060E1E] text-[#EAECEF]">
      {/* Page Header */}
      <div className="border-b border-[#1a2d4a] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={14} className="text-[#FCD535]" />
          <h1 className="text-[14px] font-bold text-[#EAECEF]">Ledger History</h1>
          <span className="text-[11px] text-[#6B8CAE]">— Monitor and audit all merchant settlement activity</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1a2d4a] rounded text-[11px] text-[#6B8CAE] hover:text-[#EAECEF] hover:border-[#FCD535]/30 transition-colors">
          <Download size={12} />
          Export CSV
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#0D1F3C] border border-[#1a2d4a] rounded p-3">
              <div className="text-[10px] text-[#6B8CAE] uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-[16px] font-black text-[#EAECEF]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
          {/* Tab bar + search */}
          <div className="flex items-center justify-between border-b border-[#1a2d4a] px-4">
            <div className="flex">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-3 text-[11px] font-medium transition-colors border-b-2 -mb-px uppercase tracking-wider",
                    activeTab === tab
                      ? "text-[#EAECEF] border-[#FCD535]"
                      : "text-[#6B8CAE] border-transparent hover:text-[#EAECEF]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B8CAE]" />
                <input
                  type="text"
                  placeholder="Search ID / Store..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[#060E1E] border border-[#1a2d4a] rounded pl-7 pr-3 py-1.5 text-[11px] text-[#EAECEF] placeholder-[#3D4D5C] outline-none focus:border-[#FCD535] transition-colors w-48"
                />
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1.5 border border-[#1a2d4a] rounded text-[11px] text-[#6B8CAE] hover:text-[#EAECEF] transition-colors">
                <Filter size={11} />
                Filter
                <ChevronDown size={10} />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 px-4 py-2 text-[10px] text-[#6B8CAE] font-medium uppercase tracking-wider border-b border-[#1a2d4a] bg-[#060E1E]">
            <span>Transaction ID</span>
            <span>Date</span>
            <span>Store</span>
            <span>Amount</span>
            <span className="text-right">Status</span>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-[#6B8CAE]">
              <div className="w-4 h-4 border-2 border-[#FCD535] border-t-transparent rounded-full animate-spin" />
              <span className="text-[12px]">Loading transactions...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#6B8CAE]">
              <ArrowLeftRight size={28} className="opacity-20" />
              <span className="text-[12px]">No transactions found</span>
            </div>
          ) : (
            <div className="divide-y divide-[#1a2d4a]">
              {filtered.map(tx => (
                <div key={tx.id} className="grid grid-cols-5 px-4 py-3 text-[12px] hover:bg-white/2 transition-colors cursor-pointer">
                  <span className="font-mono text-[#6B8CAE] text-[11px]">#{tx.id}</span>
                  <span className="text-[#6B8CAE]">{new Date(tx.date).toLocaleString()}</span>
                  <span className="text-[#EAECEF] font-medium">{tx.store}</span>
                  <span className="text-[#EAECEF] font-bold">{parseFloat(tx.amountBTC ?? '0').toFixed(8)} BTC</span>
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
          <div className="px-4 py-2.5 border-t border-[#1a2d4a] flex items-center justify-between text-[10px] text-[#6B8CAE]">
            <span>Showing {filtered.length} of {transactions.length} transactions</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
