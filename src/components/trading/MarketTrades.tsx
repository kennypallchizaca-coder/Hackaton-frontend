import { cn } from '../../utils/cn';

const trades = [
  { price: 19965.74, amount: 0.13624, time: '18:43:07', side: 'buy' },
  { price: 19965.75, amount: 0.18760, time: '18:43:06', side: 'buy' },
  { price: 19965.78, amount: 0.08921, time: '18:43:05', side: 'sell' },
  { price: 19965.80, amount: 0.08726, time: '18:43:05', side: 'buy' },
  { price: 19965.90, amount: 0.03056, time: '18:43:04', side: 'sell' },
  { price: 19965.92, amount: 0.00125, time: '18:43:04', side: 'buy' },
  { price: 19966.01, amount: 0.00066, time: '18:43:03', side: 'sell' },
  { price: 19966.11, amount: 0.05009, time: '18:43:02', side: 'buy' },
  { price: 19966.19, amount: 0.00064, time: '18:43:02', side: 'buy' },
  { price: 19966.39, amount: 0.02000, time: '18:43:01', side: 'sell' },
  { price: 19966.43, amount: 0.03015, time: '18:43:01', side: 'buy' },
  { price: 19966.56, amount: 0.00066, time: '18:43:00', side: 'sell' },
  { price: 19966.60, amount: 0.01200, time: '18:42:59', side: 'buy' },
  { price: 19966.12, amount: 0.00400, time: '18:42:58', side: 'sell' },
];

export function MarketTrades() {
  return (
    <div className="flex flex-col h-full bg-[#060E1E]">
      <div className="px-3 py-2 border-b border-[#1a2d4a] flex-shrink-0">
        <span className="text-[12px] font-bold text-[#EAECEF]">Market Trades</span>
      </div>

      <div className="flex px-3 py-1.5 text-[10px] text-[#6B8CAE] font-medium flex-shrink-0">
        <span className="flex-1">Price(USDT)</span>
        <span className="flex-1 text-right">Amount(BTC)</span>
        <span className="flex-1 text-right">Time</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {trades.map((trade, i) => (
          <div key={i} className="flex px-3 h-5 text-[12px] items-center hover:bg-white/5 cursor-pointer">
            <span className={cn("flex-1 font-medium", trade.side === 'buy' ? "text-[#0ECB81]" : "text-[#F6465D]")}>
              {trade.price.toFixed(2)}
            </span>
            <span className="flex-1 text-right text-[#EAECEF]">{trade.amount.toFixed(5)}</span>
            <span className="flex-1 text-right text-[#6B8CAE]">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
