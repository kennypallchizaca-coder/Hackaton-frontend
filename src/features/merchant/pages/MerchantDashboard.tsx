import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { SEO } from '../../../components/common/SEO';
import { transactionService } from '../../trading/api/transactionService';
import { type Transaction } from '../../../types';

// Binance Figma Components
import { TradingTerminalLayout } from '../../../layouts/TradingTerminalLayout';
import { TickerHeader } from '../../../components/layout/TickerHeader';
import { OrderBook } from '../../trading/components/OrderBook';
import { TradingChart } from '../../trading/components/TradingChart';
import { TradePanel } from '../../trading/components/TradePanel';
import { TransactionTable } from '../../shared/components/TransactionTable';
import { SystemFlowMap } from '../../shared/components/SystemFlowMap';
import { walletsService, type Wallet } from '../../wallets/api/walletsService';
import { BalanceCard } from '../../consumer/components/BalanceCard';
import { cn } from '../../../utils/cn';

export function MerchantDashboard() {
  const user = useAuthStore(state => state.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [txs, wls] = await Promise.all([
        transactionService.getAll(),
        walletsService.getMyWallets()
      ]);
      
      const filteredTxs = txs.filter(tx => 
        tx.receiverId === user.id || 
        tx.senderId === user.id || 
        tx.receiverRole === 'merchant'
      );
      
      setTransactions(filteredTxs);
      setWallets(wls);
    } catch (error) {
      console.error('Error fetching merchant data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddFakeFunds = async () => {
    await walletsService.addMockFunds('USD', 2000);
    await walletsService.addMockFunds('BTC', 0.2);
    fetchData();
  };

  const fiatBalance = wallets.find(w => w.currency === 'USD' || w.currency === 'FIAT')?.balance || '0';
  const cryptoBalance = wallets.find(w => w.currency === 'BTC' || w.currency === 'CRYPTO')?.balance || '0';

  const tabs = [
    { id: 'dashboard', label: 'Vista General' },
    { id: 'trades', label: 'Historial de Transacciones' },
    { id: 'protocol', label: 'Protocolo de Enrutamiento' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden select-none font-sans">
      <SEO title="Panel de Local / Comercio | KuriPay" />
      
      <TradingTerminalLayout
        ticker={<TickerHeader />}
        orderbook={<OrderBook />}
        chart={<TradingChart />}
        tradePanel={<TradePanel />}
        history={
          <div className="h-full flex flex-col">
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
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-950">
              {activeTab === 'dashboard' && (
                <div className="p-6 space-y-6">
                  <BalanceCard 
                    title="Liquidez del Comercio"
                    fiatAmount={parseFloat(fiatBalance)} 
                    cryptoAmount={parseFloat(cryptoBalance)} 
                    onAddFunds={handleAddFakeFunds}
                  />
                  
                  <div className="bg-slate-800 border border-slate-700 rounded-sm p-5">
                    <h4 className="text-blue-500 text-[11px] font-black uppercase tracking-widest mb-4">Estado del Terminal</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">POS ID</span>
                          <span className="text-slate-50 text-[11px] font-mono">{user?.id?.slice(0, 12).toUpperCase()}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Canal de Pago</span>
                          <span className="text-emerald-500 text-[11px] font-black uppercase">Activo (L1)</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trades' && (
                <div className="bg-slate-900">
                  {isLoading ? (
                    <div className="p-12 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest animate-pulse">
                      Sincronizando Datos...
                    </div>
                  ) : (
                    <TransactionTable transactions={transactions} hideHeader />
                  )}
                </div>
              )}

              {activeTab === 'protocol' && (
                <div className="p-6">
                   <h3 className="font-black text-slate-50 text-[12px] uppercase tracking-widest mb-6">Visualización del Ecosistema</h3>
                   <SystemFlowMap />
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
