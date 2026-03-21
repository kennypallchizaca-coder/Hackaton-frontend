/** Canonical BTC/USD reference rate — must stay in sync with transactionService and backend */
const BTC_USD_RATE = 65_000;

interface BalanceCardProps {
  title: string;
  fiatAmount: number;
  cryptoAmount: number;
}

export function BalanceCard({ title, fiatAmount, cryptoAmount }: BalanceCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-sm p-6 shadow-xl relative overflow-hidden font-sans tabular-nums">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <h3 className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-4">{title}</h3>

        <div className="space-y-4">
          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-tighter">FIAT BALANCE</div>
            <div className="text-3xl font-black text-slate-50">
              <span className="text-blue-500 text-xl mr-1">$</span>
              {fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          <div>
            <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-tighter">CRYPTO BALANCE</div>
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