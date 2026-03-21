import { useEffect, useState } from 'react';
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
import { cn } from '../../../utils/cn';
export function MerchantDashboard() {
  const user = useAuthStore(state => state.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('trades');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!user) return;
      
      try {
        const txs = await transactionService.getAll();
        
        // Filter transactions where merchant is sender or receiver
        const filteredTxs = txs.filter(tx => 
          tx.receiverId === user.id || 
          tx.senderId === user.id || 
          tx.receiverRole === 'merchant'
        );
        
        setTransactions(filteredTxs);
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, [user]);

  const tabs = [
    { id: 'trades', label: 'Trade History' },
    { id: 'protocol', label: 'Routing Protocol' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      <SEO title="Trading Terminal | KuriPay" />
      
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
            
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-900">
              {activeTab === 'protocol' ? (
                <div className="p-4">
                   <SystemFlowMap />
                </div>
              ) : isLoading ? (
                <div className="p-12 text-center text-slate-400 text-[11px] font-black uppercase tracking-widest animate-pulse">
                  Syncing Ledger Data...
                </div>
              ) : (
                <TransactionTable transactions={transactions} hideHeader />
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
