/** Canonical BTC/USD reference rate — must stay in sync with transactionService and backend */
const BTC_USD_RATE = 65_000;

interface BalanceCardProps {
  title: string;
  fiatAmount: number;
  cryptoAmount: number;
  onAddFunds?: () => void;
}

import { Plus } from '../../../components/common/Icons';

export function BalanceCard({ title, fiatAmount, cryptoAmount, onAddFunds }: BalanceCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-sm p-6 shadow-xl relative overflow-hidden font-sans tabular-nums group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{title}</h3>
          {onAddFunds && (
            <button 
              onClick={onAddFunds}
              title="Añadir fondos de prueba"
              className="p-1.5 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <Plus size={14} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-tighter">SALDO FIAT</div>
            <div className="text-3xl font-black text-slate-50">
              <span className="text-blue-500 text-xl mr-1">$</span>
              {fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-tighter">SALDO CRIPTO</div>
            <div className="text-xl font-black text-slate-50">
              {cryptoAmount.toFixed(8)} <span className="text-blue-500 text-sm">BTC</span>
            </div>
            <div className="text-[10px] text-emerald-500 mt-1 font-bold uppercase tracking-tighter">
              ≈ ${(cryptoAmount * BTC_USD_RATE).toLocaleString()} USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}