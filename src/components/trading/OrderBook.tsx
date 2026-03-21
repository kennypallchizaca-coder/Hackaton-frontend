import { cn } from '../../utils/cn';

interface OrderItem {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookProps {
  bids: OrderItem[];
  asks: OrderItem[];
}

export function OrderBook({ bids, asks }: OrderBookProps) {
  const maxVolume = Math.max(...bids.map(b => b.total), ...asks.map(a => a.total));

  const Row = ({ order, type }: { order: OrderItem; type: 'bid' | 'ask' }) => {
    const pct = (order.total / maxVolume) * 100;
    return (
      <div className="relative flex items-center px-4 h-5 text-[12px] hover:bg-white/5 cursor-pointer group">
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 opacity-15 transition-all",
            type === 'bid' ? "bg-[#0ECB81]" : "bg-[#F6465D]"
          )}
          style={{ width: `${pct}%` }}
        />
        <span className={cn("flex-1 font-medium z-10", type === 'bid' ? "text-[#0ECB81]" : "text-[#F6465D]")}>
          {order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span className="flex-1 text-right text-[#EAECEF] z-10">{order.amount.toFixed(5)}</span>
        <span className="flex-1 text-right text-[#6B8CAE] z-10">{order.total.toFixed(5)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#060E1E] select-none">
      {/* Header with view toggles */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a2d4a] flex-shrink-0">
        <span className="text-[12px] font-bold text-[#EAECEF]">Order Book</span>
        <div className="flex gap-1">
          {/* All icon */}
          <button className="w-6 h-6 flex items-center justify-center rounded bg-[#FCD535]/10 border border-[#FCD535]/30 text-[#FCD535]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="0" width="5" height="5" opacity="0.5"/>
              <rect x="7" y="0" width="5" height="5"/>
              <rect x="0" y="7" width="5" height="5" opacity="0.3"/>
              <rect x="7" y="7" width="5" height="5" opacity="0.5"/>
            </svg>
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#0D1F3C] text-[#6B8CAE] hover:text-[#EAECEF]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="0" width="12" height="5" opacity="0.3"/>
              <rect x="0" y="7" width="12" height="5"/>
            </svg>
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#0D1F3C] text-[#6B8CAE] hover:text-[#EAECEF]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="0" width="12" height="5"/>
              <rect x="0" y="7" width="12" height="5" opacity="0.3"/>
            </svg>
          </button>
          {/* Precision selector */}
          <button className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#6B8CAE] hover:text-[#EAECEF] border border-[#1a2d4a] rounded">
            0.01
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex px-4 py-1.5 text-[10px] text-[#6B8CAE] font-medium flex-shrink-0">
        <span className="flex-1">Price(USDT)</span>
        <span className="flex-1 text-right">Amount(BTC)</span>
        <span className="flex-1 text-right">Total</span>
      </div>

      {/* Asks (Sell) - top, shown in reverse so lowest ask is at bottom */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden">
        {asks.slice(0, 14).reverse().map((ask, i) => (
          <Row key={i} order={ask} type="ask" />
        ))}
      </div>

      {/* Mid-price row */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#060E1E] border-y border-[#1a2d4a] flex-shrink-0">
        <span className="text-[17px] font-black text-[#F6465D]">19,965.74</span>
        <span className="text-[11px] text-[#6B8CAE]">₦9,236,949.95</span>
        <span className="ml-auto text-[11px] text-[#FCD535] cursor-pointer hover:underline">More</span>
      </div>

      {/* Bids (Buy) */}
      <div className="flex-1 overflow-hidden">
        {bids.slice(0, 14).map((bid, i) => (
          <Row key={i} order={bid} type="bid" />
        ))}
      </div>
    </div>
  );
}
