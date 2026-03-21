import { useState } from 'react';
import { cn } from '../../utils/cn';

const ORDER_TYPES = ['Limit', 'Market', 'Stop-limit'];
const TRADE_MODES = [
  { id: 'spot', label: 'Spot' },
  { id: 'cross', label: 'Cross 3x' },
  { id: 'isolated', label: 'Isolated 10x' },
];
const PERCENTAGES = [25, 50, 75, 100];

export function TradePanel() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState('Limit');
  const [tradeMode, setTradeMode] = useState('spot');
  const [price, setPrice] = useState('19,965.74');
  const [amount, setAmount] = useState('');
  const [pct, setPct] = useState(0);

  return (
    <div className="flex flex-col h-full bg-[#060E1E]">
      {/* Trade Mode Tabs (Spot / Cross / Isolated) - Figma row */}
      <div className="flex border-b border-[#1a2d4a] flex-shrink-0">
        {TRADE_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setTradeMode(mode.id)}
            className={cn(
              "relative flex-1 py-3 text-[12px] font-bold transition-colors",
              tradeMode === mode.id
                ? "text-[#EAECEF]"
                : "text-[#6B8CAE] hover:text-[#EAECEF]"
            )}
          >
            {mode.label}
            {tradeMode === mode.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FCD535]" />
            )}
          </button>
        ))}
        {/* "0% fee" badge */}
        <div className="flex items-center px-2">
          <span className="text-[9px] bg-[#FCD535]/15 text-[#FCD535] border border-[#FCD535]/30 px-1.5 py-0.5 rounded font-bold whitespace-nowrap">HOT</span>
        </div>
      </div>

      {/* Buy / Sell Toggle */}
      <div className="flex border-b border-[#1a2d4a] flex-shrink-0">
        <button
          onClick={() => setSide('buy')}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-bold transition-colors",
            side === 'buy' ? "text-[#0ECB81] border-b-2 border-[#0ECB81]" : "text-[#6B8CAE] hover:text-[#EAECEF]"
          )}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-bold transition-colors",
            side === 'sell' ? "text-[#F6465D] border-b-2 border-[#F6465D]" : "text-[#6B8CAE] hover:text-[#EAECEF]"
          )}
        >
          Sell
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
        {/* Order Type Tabs */}
        <div className="flex gap-3">
          {ORDER_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={cn(
                "text-[12px] font-medium pb-1.5 transition-colors border-b-2",
                orderType === t
                  ? "text-[#EAECEF] border-[#FCD535]"
                  : "text-[#6B8CAE] border-transparent hover:text-[#EAECEF]"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Available Balance */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#6B8CAE]">Avbl</span>
          <span className="text-[#EAECEF] font-medium">9,540.23 USDT</span>
        </div>

        {/* Price Input */}
        <div className="relative">
          <div className="flex items-center border border-[#1a2d4a] rounded bg-[#131A22] focus-within:border-[#FCD535] transition-colors">
            <span className="text-[11px] text-[#6B8CAE] px-3 shrink-0">Price</span>
            <input
              type="text"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="flex-1 bg-transparent py-2 text-right text-[13px] text-[#EAECEF] outline-none pr-2 font-medium"
            />
            <span className="text-[11px] text-[#6B8CAE] px-3 shrink-0">USDT</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="relative">
          <div className="flex items-center border border-[#1a2d4a] rounded bg-[#131A22] focus-within:border-[#FCD535] transition-colors">
            <span className="text-[11px] text-[#6B8CAE] px-3 shrink-0">Amount</span>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent py-2 text-right text-[13px] text-[#EAECEF] outline-none pr-2 font-medium placeholder-[#3D4D5C]"
            />
            <span className="text-[11px] text-[#6B8CAE] px-3 shrink-0">BTC</span>
          </div>
        </div>

        {/* Percentage Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={e => setPct(Number(e.target.value))}
            className="w-full h-1 accent-[#FCD535] cursor-pointer"
          />
          <div className="flex justify-between">
            {PERCENTAGES.map(p => (
              <button
                key={p}
                onClick={() => setPct(p)}
                className={cn(
                  "text-[10px] px-1 py-0.5 rounded transition-colors",
                  pct === p ? "text-[#FCD535]" : "text-[#6B8CAE] hover:text-[#EAECEF]"
                )}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        {/* Total Input */}
        <div className="flex items-center border border-[#1a2d4a] rounded bg-[#131A22] focus-within:border-[#FCD535] transition-colors">
          <span className="text-[11px] text-[#6B8CAE] px-3 shrink-0">Total</span>
          <input
            type="text"
            placeholder="0.00"
            className="flex-1 bg-transparent py-2 text-right text-[13px] text-[#EAECEF] outline-none pr-2 font-medium placeholder-[#3D4D5C]"
          />
          <span className="text-[11px] text-[#6B8CAE] px-3 shrink-0">USDT</span>
        </div>

        {/* Trade Info */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="bg-[#FCD535]/15 text-[#FCD535] border border-[#FCD535]/30 px-1.5 py-0.5 rounded font-bold text-[9px]">HOT</span>
          <span className="text-[#6B8CAE]">0% trading fee on this BTC pair</span>
        </div>

        {/* Submit Button */}
        <button className={cn(
          "w-full py-2.5 rounded font-bold text-[13px] transition-all active:scale-95",
          side === 'buy'
            ? "bg-[#0ECB81] hover:bg-[#0ab571] text-white"
            : "bg-[#F6465D] hover:bg-[#e03350] text-white"
        )}>
          {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
        </button>

        {/* Footer info */}
        <div className="pt-1 space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-[#6B8CAE]">Max Buy</span>
            <span className="text-[#EAECEF]">0.47728 BTC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B8CAE]">Trade Fee</span>
            <span className="text-[#EAECEF]">0.00 USDT</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4 text-[11px] pt-1">
          <button className="text-[#6B8CAE] hover:text-[#FCD535] flex items-center gap-1 transition-colors">
            Spot Grid
          </button>
          <button className="text-[#6B8CAE] hover:text-[#FCD535] transition-colors">
            Fee Level
          </button>
        </div>
      </div>
    </div>
  );
}
