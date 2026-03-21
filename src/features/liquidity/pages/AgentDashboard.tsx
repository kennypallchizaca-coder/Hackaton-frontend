import { useEffect, useState } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { TransactionTable } from '../../shared/components/TransactionTable';
import { SEO } from '../../../components/common/SEO';
import { transactionService } from '../../trading/api/transactionService';
import { liquidityService } from '../api/liquidityService';
import { walletsService, type Wallet } from '../../wallets/api/walletsService';
import { complianceService } from '../../compliance/api/complianceService';
import { type Transaction, type LiquidityOrder } from '../../../types';
import { SystemFlowMap } from '../../shared/components/SystemFlowMap';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/button';

// Terminal Components
import { TradingTerminalLayout } from '../../../layouts/TradingTerminalLayout';
import { TickerHeader } from '../../../components/layout/TickerHeader';
import { OrderBook } from '../../trading/components/OrderBook';
import { TradingChart } from '../../trading/components/TradingChart';
import { TradePanel } from '../../trading/components/TradePanel';

export function AgentDashboard() {
  const user = useAuthStore(state => state.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<LiquidityOrder[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('node');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [txs, ords, wls, kytAlerts] = await Promise.all([
          transactionService.getAll(),
          liquidityService.getOrders(),
          walletsService.getMyWallets(),
          complianceService.getAllAlerts()
        ]);
        setTransactions(txs.filter(tx => tx.senderId === user?.id || tx.receiverId === user?.id || tx.senderRole === 'transaccionador'));
        setOrders(ords);
        setWallets(wls);
        setAlerts(kytAlerts);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const cryptoReserve = wallets.find(w => w.currency === 'BTC' || w.currency === 'CRYPTO')?.balance || '0';
  const fiatReserve = wallets.find(w => w.currency === 'USD' || w.currency === 'FIAT')?.balance || '0';

  const tabs = [
    { id: 'node', label: 'Vista del Nodo' },
    { id: 'orders', label: `Órdenes Activas (${orders.length})` },
    { id: 'history', label: 'Registros de Intercambio' },
    { id: 'compliance', label: 'Cumplimiento & KYT' },
    { id: 'protocol', label: 'Protocolo de Enrutamiento' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 overflow-hidden select-none font-sans">
      <SEO title="Terminal de Transaccionador | KuriPay" />

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
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-tighter animate-pulse">Nodo en Línea</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-950 p-6">
              {activeTab === 'node' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-sm">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Reservas BTC</span>
                      <div className="text-2xl font-black text-slate-50">{cryptoReserve} <span className="text-sm text-slate-400 font-normal">BTC</span></div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-sm">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Reservas Fiat</span>
                      <div className="text-2xl font-black text-slate-50">${parseFloat(fiatReserve).toLocaleString()} <span className="text-sm text-slate-400 font-normal">USD</span></div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-sm">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Puntaje de Salud</span>
                      <div className="text-2xl font-black text-emerald-500">98.2%</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-sm">
                      <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Volumen 24h</span>
                      <div className="text-2xl font-black text-blue-500">$124.5k</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-sm flex gap-4">
                    <Button variant="outline" className="border-slate-700 text-slate-50 hover:bg-slate-700 px-6 py-2 font-black text-[11px] tracking-widest uppercase flex-1">
                      Deposit Fiat
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-2 font-black text-[11px] tracking-widest uppercase flex-1">
                      Post Liquidity
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/50">
                    <h3 className="font-bold text-slate-50 text-[12px] uppercase tracking-widest">Órdenes de Liquidación Post-Trade</h3>
                  </div>
                  <div className="p-4">
                    {isLoading ? (
                      <div className="flex justify-center py-12 text-slate-400 animate-pulse text-[11px] font-black uppercase tracking-widest">Syncing Orders...</div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-[11px] font-black uppercase tracking-widest border border-dashed border-slate-800 rounded-sm">
                        No active orders
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {orders.map(order => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-800 hover:border-blue-500/30 transition-colors">
                            <div className="flex gap-6 items-center">
                              <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded", order.type === 'buy' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                                {order.type}
                              </span>
                              <span className="text-[12px] font-black text-slate-50 font-mono">{order.amountBTC} BTC</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Rate: {order.rateUSD.toLocaleString()} USD</span>
                            </div>
                            <button className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 hover:underline">Cancel</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/50">
                    <h3 className="font-bold text-slate-50 text-[12px] uppercase tracking-widest">Registros de Provisión</h3>
                  </div>
                  <TransactionTable transactions={transactions} hideHeader />
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="max-w-2xl space-y-4">
                  <h4 className="text-red-500 text-[11px] font-black uppercase tracking-widest mb-4 border-b border-red-500/20 pb-2">Compliance KYT/AML System</h4>
                  {alerts.length > 0 ? alerts.map((alert, i) => (
                    <div key={i} className="text-[11px] flex items-start gap-3 bg-slate-900 p-4 border border-slate-800">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", alert.severity === 'high' ? 'bg-red-500' : 'bg-blue-500')} />
                      <div>
                        <p className="text-slate-50 font-bold leading-tight mb-1">{alert.message || alert.type}</p>
                        <div className="flex gap-3">
                          <span className="text-slate-400 text-[9px] uppercase font-black">Ref: {alert.id?.slice(0, 8) || 'TX-AUTH'}</span>
                          <span className="text-slate-500 text-[9px] uppercase font-black">Priority: {alert.severity || 'LOW'}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-emerald-500 text-[11px] uppercase font-black tracking-widest opacity-50 bg-slate-900 border border-slate-800 border-dashed rounded-sm">KYT System Signals Clear</div>
                  )}
                </div>
              )}

              {activeTab === 'protocol' && (
                <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 overflow-hidden">
                  <h3 className="font-black text-slate-50 text-[12px] uppercase tracking-widest mb-6">Protocol Provision Map</h3>
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
