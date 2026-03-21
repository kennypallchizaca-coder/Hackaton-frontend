import { useMemo } from 'react';
import { Bitcoin } from '../common/Icons';

export function TickerHeader() {
  // Static institutional data for mockup sync, in real app this would come from a WebSocket
  const tickerData = useMemo(() => ({
    pair: 'BTC/USDT',
    lastPrice: '19,965.74',
    fiatPrice: '₦9,236,949.95',
    change: { value: '-1,498.25', percent: '-6.98%', isPositive: false },
    high: '21,491.86',
    low: '19,549.09',
    volumeBTC: '715,559.40',
    volumeUSDT: '14,430,472,197.94'
  }), []);

  return (
    <div className="h-[68px] bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar select-none font-sans tabular-nums">
      {/* Symbol & Price Section */}
      <div className="flex items-center gap-4 border-r border-slate-800 pr-4 mr-1 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-50 tracking-tighter">{tickerData.pair}</h2>
            <Bitcoin size={16} className="text-blue-500" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Bitcoin Price</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-lg font-black text-red-500 leading-none">{tickerData.lastPrice}</span>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">{tickerData.fiatPrice}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase mb-1">24h Change</span>
          <span className="text-[11px] font-black text-red-500">{tickerData.change.value} {tickerData.change.percent}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase mb-1">24h High</span>
          <span className="text-[11px] font-black text-slate-50">{tickerData.high}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase mb-1">24h Low</span>
          <span className="text-[11px] font-black text-slate-50">{tickerData.low}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase mb-1">24h Volume(BTC)</span>
          <span className="text-[11px] font-black text-slate-50">{tickerData.volumeBTC}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase mb-1">24h Volume(USDT)</span>
          <span className="text-[11px] font-black text-slate-50">{tickerData.volumeUSDT}</span>
        </div>
      </div>

      {/* ml-auto spacer */}
      <div className="ml-auto" />
    </div>
  );
}
