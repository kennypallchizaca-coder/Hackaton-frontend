import { useState } from 'react';
import { OrderBook } from '../components/trading/OrderBook';
import { TradingChart } from '../components/trading/TradingChart';
import { TradePanel } from '../components/trading/TradePanel';
import { MarketTrades } from '../components/trading/MarketTrades';
import { cn } from '../utils/cn';

// --- Mock Data ---
function genBook(basePrice: number, count: number, dir: 1 | -1) {
  return Array.from({ length: count }, (_, i) => {
    const price = basePrice + dir * (i + 1) * 0.5;
    const amount = Math.random() * 0.5 + 0.001;
    return { price, amount, total: price * amount };
  });
}
const ASKS = genBook(19965.74, 18, 1);
const BIDS = genBook(19965.74, 18, -1);

// --- Market Stats Sub-bar ---
const STATS = [
  { label: '24h Change', value: '-1,498.25  -6.98%', negative: true },
  { label: '24h High', value: '21,491.86' },
  { label: '24h Low', value: '19,549.09' },
  { label: '24h Volume(BTC)', value: '715,559.40' },
  { label: '24h Volume(USDT)', value: '14,430,472,197.94' },
];

const OPEN_ORDER_TABS = ['Open Orders(1)', 'Order History', 'Trade History', 'Funds'];

// --- Dashboard Page ---
export function Dashboard() {
  const [activeOrderTab, setActiveOrderTab] = useState('Open Orders(1)');

  return (
    <div className="flex flex-col h-full bg-[#060E1E] overflow-hidden">
      
      {/* Market Ticker/Stats Bar - matches Figma section 1:1648 */}
      <div className="flex items-center px-3 py-1.5 border-b border-[#1a2d4a] bg-[#060E1E] flex-shrink-0 gap-4 overflow-x-auto no-scrollbar">
        {/* Pair name & price */}
        <div className="flex items-center gap-3 pr-4 border-r border-[#1a2d4a] shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-black text-[#EAECEF]">BTC/USDT</span>
              <button className="text-[#6B8CAE] hover:text-[#EAECEF]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>
            <span className="text-[10px] text-[#6B8CAE]">Bitcoin Price</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-black text-[#F6465D]">19,965.74</span>
            <span className="text-[10px] text-[#6B8CAE]">₦9,236,949.95</span>
          </div>
        </div>

        {/* Stats */}
        {STATS.map(s => (
          <div key={s.label} className="flex flex-col shrink-0 min-w-[90px]">
            <span className="text-[10px] text-[#6B8CAE]">{s.label}</span>
            <span className={cn("text-[11px] font-medium", s.negative ? "text-[#F6465D]" : "text-[#EAECEF]")}>
              {s.value}
            </span>
          </div>
        ))}

        <div className="ml-auto flex items-center gap-4 shrink-0">
          <button className="text-[11px] text-[#6B8CAE] hover:text-[#FCD535] transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Spot Tutorial
          </button>
          <button className="text-[11px] text-[#6B8CAE] hover:text-[#FCD535] transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Spot Guidance
          </button>
        </div>
      </div>

      {/* Main 3-column trading layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Order Book (320px) */}
        <div className="w-[280px] xl:w-[320px] flex-shrink-0 border-r border-[#1a2d4a] flex flex-col overflow-hidden">
          <OrderBook bids={BIDS} asks={ASKS} />
        </div>

        {/* CENTER: Chart + Open Orders */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart takes most space */}
          <div className="flex-1 overflow-hidden">
            <TradingChart />
          </div>

          {/* Open Orders tabs & table */}
          <div className="flex-shrink-0 border-t border-[#1a2d4a]" style={{ height: '200px' }}>
            <div className="flex border-b border-[#1a2d4a] px-4 gap-5 overflow-x-auto no-scrollbar">
              {OPEN_ORDER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveOrderTab(tab)}
                  className={cn(
                    "py-2 text-[12px] font-medium whitespace-nowrap transition-colors border-b-2",
                    activeOrderTab === tab
                      ? "text-[#EAECEF] border-[#FCD535]"
                      : "text-[#6B8CAE] border-transparent hover:text-[#EAECEF]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a2d4a" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="text-[12px] text-[#6B8CAE]">No open orders</span>
                <button className="text-[11px] text-[#FCD535] hover:opacity-80 transition-opacity">Place Order</button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Trade Panel + Market Trades */}
        <div className="w-[260px] xl:w-[300px] flex-shrink-0 border-l border-[#1a2d4a] flex flex-col overflow-hidden">
          {/* Trade Panel - top ~60% */}
          <div className="flex-1 border-b border-[#1a2d4a] overflow-hidden">
            <TradePanel />
          </div>
          {/* Market Trades - bottom ~40% */}
          <div className="h-[220px] flex-shrink-0 overflow-hidden">
            <MarketTrades />
          </div>
        </div>

      </div>
    </div>
  );
}
