import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { useAuthStore } from '../../auth/store/authStore';
import Button from '../../../components/ui/button';
import { Input } from '../../../components/ui/Input';

const TRADE_MODES = [
  { id: 'spot', label: 'Spot' },
];

const ORDER_TYPES = ['Limit', 'Market', 'Stop-limit'];

export function TradePanel() {
  const user = useAuthStore(state => state.user);
  const [activeMode, setActiveMode] = useState('spot');
  const [orderType, setOrderType] = useState('Limit');
  const [price, setPrice] = useState('19972.90');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [isProcessingSell, setIsProcessingSell] = useState(false);

  const handleTrade = (type: 'buy' | 'sell') => {
    if (!amount || Number(amount) <= 0) return alert('Por favor, ingresa una cantidad válida de BTC.');
    if (type === 'buy') setIsProcessingBuy(true);
    else setIsProcessingSell(true);

    setTimeout(() => {
      if (type === 'buy') setIsProcessingBuy(false);
      else setIsProcessingSell(false);

      setAmount('');
      setTotal('');

      alert(`✅ Operación exitosa:\n${type === 'buy' ? 'Compra' : 'Venta'} de ${amount} BTC procesada correctamente en la red institucional.`);
    }, 1500);
  };

  // Auto-calculation logic
  useEffect(() => {
    if (price && amount && !total) {
      const calculatedTotal = (parseFloat(price) * parseFloat(amount)).toFixed(2);
      setTotal(calculatedTotal);
    }
  }, [price, amount]);

  const handlePriceChange = (val: string) => {
    setPrice(val);
    if (val && amount) {
      setTotal((parseFloat(val) * parseFloat(amount)).toFixed(2));
    }
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (val && price) {
      setTotal((parseFloat(price) * parseFloat(val)).toFixed(2));
    }
  };

  const handleTotalChange = (val: string) => {
    setTotal(val);
    if (val && price && parseFloat(price) !== 0) {
      setAmount((parseFloat(val) / parseFloat(price)).toFixed(8));
    }
  };

  const isConsumer = user?.role === 'consumer';
  const isMerchant = user?.role === 'merchant';
  const isAgent = user?.role === 'transaccionador';

  // Dynamic Labels based on Role
  const getBuyLabel = () => {
    if (isConsumer) return "Comprar BTC (vía P2P)";
    if (isMerchant) return "N/A (Sólo Ventas)";
    if (isAgent) return "Proveer Liquidez";
    return "Comprar BTC";
  };

  const getSellLabel = () => {
    if (isConsumer) return "Vender BTC (vía P2P)";
    if (isMerchant) return "Liquidar a Fiat";
    if (isAgent) return "Gestionar Reservas";
    return "Vender BTC";
  };

  const getFiatBalanceLabel = () => {
    if (isConsumer) return "Saldo USD";
    if (isMerchant) return "USD Liquidado";
    if (isAgent) return "Fiat del Sistema";
    return "Saldo USD";
  };

  const getCryptoBalanceLabel = () => {
    if (isConsumer) return "Saldo BTC";
    if (isMerchant) return "BTC Recaudado";
    if (isAgent) return "BTC del Sistema";
    return "Saldo BTC";
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 select-none text-slate-50 font-sans">
      {/* Top Tabs */}
      <div className="flex bg-slate-800 border-b border-slate-700">
        {TRADE_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              "relative px-4 py-3 border-t-2 transition-colors",
              activeMode === mode.id
                ? "bg-slate-900 border-t-blue-500 text-slate-50"
                : "bg-slate-800 border-t-transparent text-slate-400 hover:text-slate-50"
            )}
            style={{ marginBottom: activeMode === mode.id ? '-1px' : '0' }}
          >
            <div className="flex items-center gap-1">
              <span className="text-[14px]">{mode.label.split(' ')[0]}</span>
              {mode.label.includes(' ') && (
                <span className="text-[13px]">
                  {mode.label.split(' ')[1]}
                </span>
              )}
            </div>
          </button>
        ))}

        {/* Right side helper info */}
        <div className="ml-auto flex items-center pr-4 gap-4 text-[11px] text-slate-400">
          <span className="hidden lg:block text-slate-50">
            {isConsumer ? '0% trading fee on BTC pair' : 'Institutional Liquidity Pool'}
          </span>
        </div>
      </div>

      <div className="px-3 py-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Inner Order Type Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {ORDER_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={cn(
                  "text-[12px] transition-colors font-medium",
                  orderType === t
                    ? "text-blue-500"
                    : "text-slate-400 hover:text-slate-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Buy & Sell Columns */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {/* BUY COLUMN */}
          <div className={cn("space-y-3", isMerchant && "opacity-50 grayscale pointer-events-none")}>
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>{getFiatBalanceLabel()}</span>
                <button className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors text-[10px] w-[14px] h-[14px] flex items-center justify-center rounded-full font-bold leading-none">+</button>
              </div>
              <span className="text-slate-50 font-medium">{(user?.balance?.fiat ?? 9500.05).toLocaleString()} {isConsumer ? 'USD' : 'USDT'}</span>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Price"
                  value={price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange(e.target.value)}
                  className="pr-10 text-right font-medium text-[12px] h-10"
                />
                <span className="absolute right-3 top-[30px] text-[10px] font-bold text-slate-400">USD</span>
              </div>

              <div className="relative">
                <Input
                  label="Amount"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="pr-10 text-right font-medium text-[12px] h-10"
                />
                <span className="absolute right-3 top-[30px] text-[10px] font-bold text-slate-400">BTC</span>
              </div>

              {/* Slider Buy */}
              <div className="relative pt-3 pb-5 px-[7px]">
                <div className="absolute top-1/2 left-[7px] right-[7px] h-1 bg-slate-700 -translate-y-1/2 rounded"></div>
                <div className="absolute top-1/2 left-[7px] right-[7px] flex justify-between -translate-y-1/2 pointer-events-none">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <div key={p} className="w-3.5 h-3.5 bg-slate-800 border-[3px] border-slate-700 rounded-full" />
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  className="w-full h-1 opacity-0 cursor-pointer absolute top-1/2 -translate-y-1/2 left-0 z-10"
                />
              </div>

              <div className="relative">
                <Input
                  label="Total"
                  value={total}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTotalChange(e.target.value)}
                  className="pr-10 text-right font-medium text-[12px] h-10"
                />
                <span className="absolute right-3 top-[30px] text-[10px] font-bold text-slate-400">USD</span>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleTrade('buy')}
                  loading={isProcessingBuy}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 text-[12px] font-bold"
                >
                  {isProcessingBuy ? '...' : getBuyLabel()}
                </Button>
              </div>
            </div>
          </div>

          {/* SELL COLUMN */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>{getCryptoBalanceLabel()}</span>
                <button className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors text-[10px] w-[14px] h-[14px] flex items-center justify-center rounded-full font-bold leading-none">+</button>
              </div>
              <span className="text-slate-50 font-medium">{isMerchant ? (user?.balance?.crypto ?? 0.4728).toFixed(4) : (user?.balance?.crypto ?? 0.4177).toFixed(4)} BTC</span>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Price"
                  value={price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange(e.target.value)}
                  className="pr-10 text-right font-medium text-[12px] h-10"
                />
                <span className="absolute right-3 top-[30px] text-[10px] font-bold text-slate-400">USD</span>
              </div>

              <div className="relative">
                <Input
                  label="Amount"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="pr-10 text-right font-medium text-[12px] h-10"
                />
                <span className="absolute right-3 top-[30px] text-[10px] font-bold text-slate-400">BTC</span>
              </div>

              {/* Slider Sell */}
              <div className="relative pt-3 pb-5 px-[7px]">
                <div className="absolute top-1/2 left-[7px] right-[7px] h-1 bg-slate-700 -translate-y-1/2 rounded"></div>
                <div className="absolute top-1/2 left-[7px] right-[7px] flex justify-between -translate-y-1/2 pointer-events-none">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <div key={p} className="w-3.5 h-3.5 bg-slate-800 border-[3px] border-slate-700 rounded-full" />
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  className="w-full h-1 opacity-0 cursor-pointer absolute top-1/2 -translate-y-1/2 left-0 z-10"
                />
              </div>

              <div className="relative">
                <Input
                  label="Total"
                  value={total}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTotalChange(e.target.value)}
                  className="pr-10 text-right font-medium text-[12px] h-10"
                />
                <span className="absolute right-3 top-[30px] text-[10px] font-bold text-slate-400">USD</span>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => handleTrade('sell')}
                  loading={isProcessingSell}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-[12px] font-bold"
                >
                  {isProcessingSell ? '...' : getSellLabel()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
