import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionTable } from '../../shared/components/TransactionTable';
import { SEO } from '../../../components/common/SEO';
import { transactionService } from '../../trading/api/transactionService';
import { walletsService, type Wallet } from '../../wallets/api/walletsService';
import { SystemFlowMap } from '../../shared/components/SystemFlowMap';
import { type Transaction } from '../../../types';// Terminal Components
import { TradingTerminalLayout } from '../../../layouts/TradingTerminalLayout';
import { TickerHeader } from '../../../components/layout/TickerHeader';
import { OrderBook } from '../../trading/components/OrderBook';
import { TradingChart } from '../../trading/components/TradingChart';
import { TradePanel } from '../../trading/components/TradePanel';
import { cn } from '../../../utils/cn';

export function ConsumerDashboard() {
  const user = useAuthStore(state => state.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [txs, wls] = await Promise.all([
        transactionService.getAll(),
        walletsService.getMyWallets()
      ]);
      setTransactions(txs.filter(tx => tx.senderId === user?.id || tx.receiverId === user?.id));
      setWallets(wls);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  const handleAddFakeFunds = async () => {
    await walletsService.addMockFunds('USD', 1000);
    await walletsService.addMockFunds('BTC', 0.1);
    fetchData();
  };

  const fiatBalance = wallets.find(w => w.currency === 'USD' || w.currency === 'FIAT')?.balance || '0';
  const cryptoBalance = wallets.find(w => w.currency === 'BTC' || w.currency === 'CRYPTO')?.balance || '0';

  const tabs = [
    { id: 'dashboard', label: 'Vista General' },
    { id: 'trades', label: 'Historial de Transacciones' },
    { id: 'protocol', label: 'Protocolo de Red' },
    { id: 'funds', label: 'Billeteras y Activos' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 overflow-hidden select-none font-sans">
      <SEO title="Panel de Consumidor | KuriPay" />
      
      <TradingTerminalLayout
        ticker={<TickerHeader />}
        orderbook={<OrderBook />}
        chart={<TradingChart />}
        tradePanel={<TradePanel />}
        history={
          <div className="h-full flex flex-col">
            {/* Header / Tabs */}
            <div className="px-5 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-8">
                {tabs.map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "text-[11px] font-black uppercase tracking-widest transition-colors pb-2 -mb-2.5",
                      activeTab === tab.id ? "text-blue-500 border-b-2 border-blue-500" : "text-slate-400 hover:text-slate-50 border-b-2 border-transparent"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-tighter">Verified L1</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-950 p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BalanceCard 
                      title="Liquidez Disponible"
                      fiatAmount={parseFloat(fiatBalance)} 
                      cryptoAmount={parseFloat(cryptoBalance)} 
                      onAddFunds={handleAddFakeFunds}
                    />
                    
                    <div className="bg-slate-800 border border-slate-700 rounded-sm p-5 flex flex-col justify-center relative overflow-hidden">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Portfolio Growth</span>
                      <div className="text-3xl font-black text-emerald-500 flex items-center gap-2">
                         +12.4%
                         <span className="text-[10px] bg-emerald-500/10 px-2 py-1 rounded">30D</span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 font-bold">Network Benchmark: +8.2%</div>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 -rotate-45 translate-x-10 -translate-y-10" />
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-sm p-5 flex flex-col justify-center">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Safety & Compliance</span>
                      <div className="text-3xl font-black text-slate-50">L1 SECURE</div>
                      <div className="mt-2 text-[10px] text-emerald-500 font-black uppercase tracking-tighter flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ruta de Transacción Verificada
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trades' && (
                <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/50">
                    <h3 className="font-bold text-slate-50 text-[12px] uppercase tracking-widest">Transaction Ledger</h3>
                  </div>
                  {isLoading ? (
                    <div className="p-12 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest animate-pulse">Syncing...</div>
                  ) : (
                    <TransactionTable transactions={transactions} hideHeader />
                  )}
                </div>
              )}

              {activeTab === 'protocol' && (
                <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 overflow-hidden">
                   <h3 className="font-black text-slate-50 text-[12px] uppercase tracking-widest mb-6">Protocol Visualization</h3>
                   <SystemFlowMap />
                </div>
              )}

              {activeTab === 'funds' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  <BalanceCard 
                    title="Active BTC Reserve"
                    fiatAmount={parseFloat(fiatBalance)} 
                    cryptoAmount={parseFloat(cryptoBalance)} 
                  />
                   <div className="bg-slate-800 border border-slate-700 rounded-sm p-5">
                      <h4 className="text-blue-500 text-[11px] font-black uppercase tracking-widest mb-4">Account Metadata</h4>
                      <div className="space-y-3">
                         <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Node ID</span>
                            <span className="text-slate-50 text-[11px] font-mono">{user?.id?.slice(0, 16).toUpperCase()}</span>
                         </div>
                         <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Network</span>
                            <span className="text-emerald-500 text-[11px] font-black uppercase">Mainnet v3</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Latency</span>
                            <span className="text-slate-50 text-[11px] font-bold">2ms</span>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}

