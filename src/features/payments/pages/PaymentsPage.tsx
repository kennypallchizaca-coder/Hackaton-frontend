import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, ReceiptText, Zap } from '../../../components/common/Icons';
import { SEO } from '../../../components/common/SEO';
import { QRPaymentCard } from '../../../components/ui/QRPaymentCard';
import { QRCodeDisplay } from '../../../components/ui/QRCodeDisplay';
import { paymentService } from '../api/paymentService';
import { buildInvoiceUrl } from '../utils/paymentLinks';
import { type Invoice } from '../../../types';
import { cn } from '../../../utils/cn';

type Step = 'form' | 'qr' | 'receipt';
type CurrencyMode = 'SATS' | 'USD' | 'BTC';

const STORES = ['Cafe Central', 'Tienda Online', 'Sucursal Norte'];
const CURRENCIES: CurrencyMode[] = ['SATS', 'USD', 'BTC'];
const ORDER_ID = `GEN-${Math.floor(Math.random() * 90000) + 10000}`;

export function Payments() {
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<CurrencyMode>('SATS');
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    if (!amount || loading) {
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let sats = parseInt(amount, 10);
      if (currency === 'USD') {
        sats = Math.floor(parseFloat(amount) * 1587);
      }
      if (currency === 'BTC') {
        sats = Math.floor(parseFloat(amount) * 100_000_000);
      }

      const nextInvoice = await paymentService.createInvoice(
        sats,
        description || 'Merchant Payment',
        selectedStore,
      );

      setInvoice(nextInvoice);
      setStep('qr');
    } catch (error) {
      console.error('Failed to generate invoice', error);
      setErrorMsg(
        'No fue posible generar una factura real desde el backend. Configura un backend operativo o habilita el modo demo solo para pruebas controladas.',
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('form');
    setInvoice(null);
    setAmount('');
    setDescription('');
    setErrorMsg('');
  };

  useEffect(() => {
    if (step !== 'qr' || !invoice?.id) {
      return;
    }

    let isSubscribed = true;
    const poll = async () => {
      try {
        const status = await paymentService.checkPaymentStatus(invoice.id);
        if (!isSubscribed) {
          return;
        }

        setInvoice((current) => (current ? { ...current, status } : current));

        if (status === 'paid' || status === 'completed') {
          setStep('receipt');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const interval = window.setInterval(poll, 3000);

    // Listen for storage events (updates from other tabs) or custom simulation events
    const handleImmediateUpdate = () => {
      poll();
    };

    window.addEventListener('storage', handleImmediateUpdate);
    window.addEventListener('payment-simulated', handleImmediateUpdate);

    return () => {
      isSubscribed = false;
      window.clearInterval(interval);
      window.removeEventListener('storage', handleImmediateUpdate);
      window.removeEventListener('payment-simulated', handleImmediateUpdate);
    };
  }, [step, invoice?.id]);

  const invoiceUrl = invoice ? buildInvoiceUrl(invoice) : '';
  const receiptQrCorrectionLevel = invoiceUrl.length > 180 ? 'M' : 'Q';

  return (
    <div className="flex min-h-full flex-col overflow-hidden bg-slate-950 lg:h-full lg:flex-row">
      <SEO
        title="POS Payment Terminal"
        description="Accept fast and secure payments through the Lightning Network with a QR flow that stays shareable on real mobile devices."
      />

      <div className="w-full shrink-0 border-b border-slate-800 lg:w-[460px] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-3">
          <Zap size={14} className="text-blue-500" />
          <h1 className="text-[14px] font-bold text-slate-50">POS Terminal</h1>
          <span className="text-[11px] text-slate-400">Lightning Network</span>
        </div>

        <div className="max-h-[42vh] overflow-y-auto p-5 lg:max-h-none lg:flex-1">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-slate-400">
                Payment Amount
              </label>
              <div className="flex overflow-hidden rounded border border-slate-800 bg-slate-800 transition-colors focus-within:border-blue-500">
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  disabled={step !== 'form'}
                  className="flex-1 bg-transparent px-4 py-3 text-[22px] font-black text-slate-50 outline-none placeholder-slate-500"
                />
                <div className="flex border-l border-slate-800">
                  {CURRENCIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrency(item)}
                      className={cn(
                        'px-3 text-[11px] font-bold transition-colors',
                        currency === item ? 'bg-blue-500/10 text-blue-500' : 'text-slate-400 hover:text-slate-50',
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-slate-400">
                Merchant Node
              </label>
              <select
                value={selectedStore}
                onChange={(event) => setSelectedStore(event.target.value)}
                disabled={step !== 'form'}
                className="w-full cursor-pointer appearance-none rounded border border-slate-800 bg-slate-800 px-3 py-2.5 text-[12px] text-slate-50 outline-none transition-colors focus:border-blue-500"
              >
                {STORES.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-slate-400">
                Order ID
              </label>
              <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2.5 text-[11px] font-mono text-slate-400">
                {ORDER_ID}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-slate-400">
                Internal Memo
              </label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Product or service description..."
                disabled={step !== 'form'}
                className="w-full rounded border border-slate-800 bg-slate-800 px-3 py-2.5 text-[12px] text-slate-50 outline-none transition-colors placeholder-slate-500 focus:border-blue-500"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] leading-5 text-red-100">
                {errorMsg}
              </div>
            )}

            {step === 'form' ? (
              <button
                type="submit"
                disabled={!amount || loading}
                className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 py-3 text-[13px] font-black text-slate-950 transition-colors hover:bg-blue-500 disabled:opacity-40"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                ) : (
                  <Zap size={16} />
                )}
                Generate Mobile-Safe QR
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="w-full rounded border border-slate-800 bg-slate-800 py-3 text-[12px] font-bold text-slate-50 transition-colors hover:bg-white/5"
              >
                Reset Terminal
              </button>
            )}
          </form>

          <div className="mt-6">
            <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">Recent Payments</div>
            <div className="divide-y divide-slate-800 rounded border border-slate-800 bg-slate-800">
              {[
                { id: 'inv_001', amount: '12,000 SATS', store: 'Cafe Central', status: 'paid' },
                { id: 'inv_002', amount: '5,500 SATS', store: 'Tienda Online', status: 'paid' },
                { id: 'inv_003', amount: '87,000 SATS', store: 'Sucursal Norte', status: 'expired' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-white/3">
                  <div>
                    <div className="text-[12px] font-bold text-slate-50">{item.amount}</div>
                    <div className="text-[10px] text-slate-400">{item.store}</div>
                  </div>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[9px] font-black uppercase',
                      item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-400/10 text-slate-400',
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-blue-600/3 blur-[120px]" />

        {step === 'form' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-800">
              <Zap size={40} className="text-slate-700" />
            </div>
            <div>
              <p className="text-[16px] font-black uppercase tracking-widest text-slate-200">Awaiting Input</p>
              <p className="mx-auto mt-1 max-w-xs text-[11px] text-slate-500">
                Configure the payment parameters on the left to activate the terminal and generate a QR that opens correctly on real phones.
              </p>
            </div>
          </div>
        )}

        {step === 'qr' && invoice && (
          <div className="z-10 w-full max-w-lg">
            <QRPaymentCard invoice={invoice} onRegenerate={reset} />
          </div>
        )}

        {step === 'receipt' && invoice && (
          <div className="z-10 w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-800 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-[20px] font-black uppercase tracking-wider text-slate-50">Settled</h2>
              <p className="mt-1 text-[11px] text-slate-400">Invoice confirmed and shareable from any phone camera.</p>
            </div>

            <div className="mx-auto w-fit rounded-xl border-2 border-emerald-500/30 bg-white p-3 shadow-lg">
              <QRCodeDisplay
                value={invoiceUrl}
                alt="Invoice QR"
                width={220}
                errorCorrectionLevel={receiptQrCorrectionLevel}
                imageClassName="h-[min(55vw,180px)] w-[min(55vw,180px)] rounded sm:h-[180px] sm:w-[180px]"
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500">
              Escanea para abrir la factura en movil
            </p>

            <div className="space-y-2 rounded border border-slate-800 bg-slate-950 p-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Settlement</span>
                <span className="text-[13px] font-black text-emerald-500">
                  +{invoice.amountSats?.toLocaleString() ?? 0} SATS
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>TX ID</span>
                <span className="font-mono">{invoice.id.slice(0, 16)}...</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => window.open(invoiceUrl, '_blank', 'noopener,noreferrer')}
                className="flex-1 rounded bg-brand-yellow py-2.5 text-[11px] font-black text-binance-black shadow-[0_0_10px_rgba(252,213,53,0.2)] transition-colors hover:bg-yellow-400"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <ReceiptText size={13} /> VER FACTURA
                </span>
              </button>
              <button
                onClick={reset}
                className="flex-1 rounded bg-blue-600 py-2.5 text-[11px] font-bold text-slate-950 transition-colors hover:bg-blue-500"
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
