import { useState, useEffect } from 'react';
import { Zap, CheckCircle2, ReceiptText } from '../../../components/common/Icons';
import { QRPaymentCard } from '../../../components/ui/QRPaymentCard';
import { paymentService } from '../api/paymentService';
import { type Invoice } from '../../../types';
import { cn } from '../../../utils/cn';
import { SEO } from '../../../components/common/SEO';

type Step = 'form' | 'qr' | 'receipt';
type CurrencyMode = 'SATS' | 'USD' | 'BTC';

const STORES = ['Café Central', 'Tienda Online', 'Sucursal Norte'];
const CURRENCIES: CurrencyMode[] = ['SATS', 'USD', 'BTC'];

// Stable order ID so it doesn't regenerate on re-renders
const ORDER_ID = `GEN-${Math.floor(Math.random() * 90000) + 10000}`;

export function Payments() {
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<CurrencyMode>('SATS');
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || loading) return;
    setLoading(true);
    try {
      let sats = parseInt(amount);
      if (currency === 'USD') sats = Math.floor(parseFloat(amount) * 1587);
      if (currency === 'BTC') sats = Math.floor(parseFloat(amount) * 100_000_000);
      const inv = await paymentService.createInvoice(sats, description || 'Merchant Payment', selectedStore);
      setInvoice(inv);
      setStep('qr');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('form'); setInvoice(null); setAmount(''); setDescription(''); };

  // Real-time polling for payment status
  useEffect(() => {
    if (step !== 'qr' || !invoice?.id) return;

    let isSubscribed = true;
    const poll = async () => {
      try {
        const status = await paymentService.checkPaymentStatus(invoice.id);
        if (isSubscribed && (status === 'paid' || status === 'completed')) {
          setStep('receipt');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const interval = setInterval(poll, 3000); // Poll every 3 seconds
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [step, invoice?.id]);

  return (
    <div className="flex h-full overflow-hidden bg-slate-950">
      <SEO
        title="POS Payment Terminal"
        description="Accept fast and secure payments through the Lightning Network with our crypto point of sale terminal."
      />
      {/* LEFT: Form Panel */}
      <div className="w-[460px] border-r border-slate-800 flex flex-col shrink-0">
        {/* Sub-header */}
        <div className="border-b border-slate-800 px-5 py-3 flex items-center gap-2">
          <Zap size={14} className="text-blue-500" />
          <h1 className="text-[14px] font-bold text-slate-50">POS Terminal</h1>
          <span className="text-[11px] text-slate-400">— Lightning Network</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Amount Input */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Payment Amount</label>
              <div className="flex border border-slate-800 rounded overflow-hidden focus-within:border-blue-500 transition-colors bg-slate-800">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={step !== 'form'}
                  className="flex-1 bg-transparent px-4 py-3 text-[22px] font-black text-slate-50 outline-none placeholder-slate-500"
                />
                {/* Currency Toggle */}
                <div className="flex border-l border-slate-800">
                  {CURRENCIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "px-3 text-[11px] font-bold transition-colors",
                        currency === c ? "bg-blue-500/10 text-blue-500" : "text-slate-400 hover:text-slate-50"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Store Selector */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Merchant Node</label>
              <select
                value={selectedStore}
                onChange={e => setSelectedStore(e.target.value)}
                disabled={step !== 'form'}
                className="w-full bg-slate-800 border border-slate-800 rounded px-3 py-2.5 text-[12px] text-slate-50 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {STORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Order ID */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Order ID</label>
              <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2.5 text-[11px] font-mono text-slate-400">
                {ORDER_ID}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Internal Memo</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Product or service description..."
                disabled={step !== 'form'}
                className="w-full bg-slate-800 border border-slate-800 rounded px-3 py-2.5 text-[12px] text-slate-50 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* CTA */}
            {step === 'form' ? (
              <button
                type="submit"
                disabled={!amount || loading}
                className="w-full py-3 bg-blue-600 text-slate-950 font-black rounded text-[13px] hover:bg-blue-500 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <Zap size={16} />}
                Generate Terminal QR
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="w-full py-3 bg-slate-800 border border-slate-800 text-slate-50 font-bold rounded text-[12px] hover:bg-white/5 transition-colors"
              >
                Reset Terminal
              </button>
            )}
          </form>

          {/* Recent Payments */}
          <div className="mt-6">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Recent Payments</div>
            <div className="bg-slate-800 border border-slate-800 rounded divide-y divide-slate-800">
              {[
                { id: 'inv_001', amount: '12,000 SATS', store: 'Café Central', status: 'paid' },
                { id: 'inv_002', amount: '5,500 SATS', store: 'Tienda Online', status: 'paid' },
                { id: 'inv_003', amount: '87,000 SATS', store: 'Sucursal Norte', status: 'expired' },
              ].map(r => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/3 transition-colors">
                  <div>
                    <div className="text-[12px] text-slate-50 font-bold">{r.amount}</div>
                    <div className="text-[10px] text-slate-400">{r.store}</div>
                  </div>
                  <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                    r.status === 'paid' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-400/10'
                  )}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: QR / Status Panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/3 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />

        {step === 'form' && (
          <div className="text-center space-y-4">
            <div className="w-28 h-28 bg-slate-800 border-2 border-dashed border-slate-800 rounded-2xl mx-auto flex items-center justify-center">
              <Zap size={40} className="text-slate-800" />
            </div>
            <div>
              <p className="text-[16px] font-black text-slate-800 uppercase tracking-widest">Awaiting Input</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">Configure the payment parameters on the left to activate the terminal</p>
            </div>
          </div>
        )}

        {step === 'qr' && invoice && (
          <div className="z-10">
            <QRPaymentCard
              invoice={invoice}
              onRegenerate={() => setInvoice(null)}
            />
          </div>
        )}

        {step === 'receipt' && (
          <div className="bg-slate-800 border border-slate-800 rounded-lg p-8 text-center space-y-5 max-w-sm w-full z-10">
            <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-slate-50 uppercase tracking-wider">Settled</h2>
              <p className="text-[11px] text-slate-400 mt-1">Invoice confirmed on-chain</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Settlement</span>
                <span className="text-[13px] font-black text-emerald-500">+{invoice?.amountSats?.toLocaleString() ?? 0} SATS</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>TX ID</span>
                <span className="font-mono">{invoice?.id.slice(0, 16)}...</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-slate-800 border border-slate-800 text-slate-400 rounded text-[11px] font-bold hover:text-slate-50 transition-colors flex items-center justify-center gap-1.5">
                <ReceiptText size={13} /> Receipt
              </button>
              <button
                onClick={reset}
                className="flex-1 py-2.5 bg-blue-600 text-slate-950 rounded text-[11px] font-bold hover:bg-blue-500 transition-colors"
              >
                New Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
