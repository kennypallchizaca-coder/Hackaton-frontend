import { useMemo } from 'react';

export function OrderBook() {
  const sellOrders = useMemo(() => [
    { price: '19,967.98', amount: '0.10016', total: '1,999.99' },
    { price: '19,967.69', amount: '0.00100', total: '19.96' },
    { price: '19,967.66', amount: '0.00066', total: '13.17' },
    { price: '19,967.61', amount: '0.27769', total: '5,544.80' },
    { price: '19,967.60', amount: '0.01961', total: '391.56' },
    { price: '19,967.59', amount: '0.73579', total: '14,691.95' },
    { price: '19,967.58', amount: '0.09455', total: '1,887.93' },
    { price: '19,967.57', amount: '0.05009', total: '1,000.17' },
  ], []);

  const buyOrders = useMemo(() => [
    { price: '19,965.66', amount: '0.00203', total: '40.53' },
    { price: '19,965.54', amount: '0.03576', total: '713.96' },
    { price: '19,965.49', amount: '0.04142', total: '826.97' },
    { price: '19,965.46', amount: '0.00066', total: '13.17' },
    { price: '19,965.43', amount: '0.03441', total: '687.01' },
    { price: '19,965.38', amount: '0.12000', total: '2,395.84' },
    { price: '19,965.27', amount: '0.00064', total: '12.77' },
    { price: '19,965.24', amount: '0.04000', total: '798.60' },
  ], []);

  return (
    <div className="h-full flex flex-col bg-slate-900 select-none font-sans tabular-nums">
      {/* Header */}
      <div className="grid grid-cols-3 px-4 py-2 text-[12px] text-slate-400 border-b border-slate-800">
        <span>Price(USDT)</span>
        <span className="text-right">Amount(BTC)</span>
        <span className="text-right">Total</span>
      </div>

      {/* Sells */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden">
        {sellOrders.map((order, i) => (
          <div key={`sell-${i}`} className="grid grid-cols-3 px-4 py-[2px] text-[12px] relative group hover:bg-slate-800 cursor-pointer">
            <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 pointer-events-none" style={{ width: `${Math.random() * 60 + 20}%` }} />
            <span className="text-red-500 z-10">{order.price}</span>
            <span className="text-right text-slate-50 z-10">{order.amount}</span>
            <span className="text-right text-slate-50 z-10">{order.total}</span>
          </div>
        ))}
      </div>

      {/* Current Price Middle */}
      <div className="px-4 py-2 border-y border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-medium text-emerald-500">19,965.74</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M12 19V5M5 12l7 7 7-7"/></svg>
        </div>
        <span className="text-slate-50 text-[12px] underline decoration-dashed underline-offset-2">$19,965.74</span>
      </div>

      {/* Buys */}
      <div className="flex-1 flex flex-col overflow-hidden pt-1">
        {buyOrders.map((order, i) => (
          <div key={`buy-${i}`} className="grid grid-cols-3 px-4 py-[2px] text-[12px] relative group hover:bg-slate-800 cursor-pointer">
            <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none" style={{ width: `${Math.random() * 60 + 20}%` }} />
            <span className="text-emerald-500 z-10">{order.price}</span>
            <span className="text-right text-slate-50 z-10">{order.amount}</span>
            <span className="text-right text-slate-50 z-10">{order.total}</span>
          </div>
        ))}
      </div>

      {/* Footer / Granularity */}
      <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[12px] text-slate-50">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-800 px-1 rounded">
          <span>0.01</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <div className="flex gap-4 text-slate-400">
          <button className="hover:text-blue-500 font-medium">More</button>
        </div>
      </div>
    </div>
  );
}
