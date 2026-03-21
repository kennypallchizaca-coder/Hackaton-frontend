import { useState, useCallback } from 'react';
import { Zap, Bitcoin, Store, ChevronRight, CheckCircle2, ReceiptText } from 'lucide-react';
import { QRPaymentCard } from '../components/ui/QRPaymentCard';
import { paymentService } from '../services/paymentService';
import { type Invoice } from '../types';

type Step = 'form' | 'qr' | 'receipt';
type CurrencyMode = 'SATS' | 'USD' | 'BTC';

const STORES = ['Café Central', 'Tienda Online', 'Sucursal Norte'];
const BTC_PRICE = 63012.50;

export function Payments() {
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('SATS');
  const [description, setDescription] = useState('');
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const getSats = (): number => {
    const val = parseFloat(amount) || 0;
    if (currencyMode === 'SATS') return val;
    if (currencyMode === 'USD') return Math.round((val / BTC_PRICE) * 100_000_000);
    if (currencyMode === 'BTC') return Math.round(val * 100_000_000);
    return 0;
  };

  const getUSD = (): string => {
    const sats = getSats();
    return ((sats / 100_000_000) * BTC_PRICE).toFixed(2);
  };

  const handleGenerate = async () => {
    const sats = getSats();
    if (!sats || sats < 1) return;
    setIsLoading(true);
    try {
      const inv = await paymentService.createInvoice(sats, description, selectedStore);
      setInvoice(inv);
      setStep('qr');
      setConfirmed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = useCallback(async () => {
    if (!invoice) return;
    setIsLoading(true);
    try {
      const inv = await paymentService.regenerateInvoice(invoice);
      setInvoice(inv);
      setConfirmed(false);
    } finally {
      setIsLoading(false);
    }
  }, [invoice]);

  const handlePaymentConfirmed = useCallback(() => {
    setConfirmed(true);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-[#0A192F]">Cobrar / POS</h1>
        {step !== 'form' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => { setStep('form'); setInvoice(null); setConfirmed(false); }}
              className="hover:text-[#0A192F] transition-colors font-medium">Nuevo cobro</button>
            <ChevronRight size={14} />
            <span className={step === 'qr' ? 'text-[#F4B41A] font-bold' : 'text-gray-400'}>QR Invoice</span>
            {confirmed && <><ChevronRight size={14} /><span className="text-emerald-600 font-bold">Comprobante</span></>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Form */}
        <div className={`glass p-8 space-y-6 ${step !== 'form' ? 'opacity-60 pointer-events-none' : ''}`}>
          <h2 className="text-xl font-bold text-[#0A192F] flex items-center gap-2">
            <ReceiptText size={20} className="text-[#F4B41A]" /> Crear Cobro
          </h2>

          {/* Currency Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Moneda</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {(['SATS', 'USD', 'BTC'] as CurrencyMode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrencyMode(c); setAmount(''); }}
                  className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
                    currencyMode === c ? 'bg-[#0A192F] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {c === 'SATS' ? <><Zap size={12} className="inline mr-1 text-[#F4B41A]" />SATS</> :
                   c === 'BTC' ? <><Bitcoin size={12} className="inline mr-1 text-orange-500" />BTC</> : `$ USD`}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Monto</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={currencyMode === 'SATS' ? '0' : currencyMode === 'USD' ? '0.00' : '0.00000000'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-5 pr-20 text-3xl font-black text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{currencyMode}</span>
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-gray-400 mt-2 text-right">
                ≈ {getSats().toLocaleString()} SATS · ${getUSD()} USD
              </p>
            )}
          </div>

          {/* Store Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">
              <Store size={12} className="inline mr-1" /> Sucursal / Caja
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[#0A192F] font-semibold focus:outline-none focus:border-[#F4B41A] transition-colors"
            >
              {STORES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Descripción (opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Orden #1234, Mesa 5, Servicio..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="w-full py-4 bg-[#0A192F] text-white font-bold text-lg rounded-2xl hover:bg-[#1A2C49] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generando...</span>
            ) : (
              <><Zap size={20} className="text-[#F4B41A]" /> Generar QR Lightning</>
            )}
          </button>
        </div>

        {/* RIGHT: QR or Receipt */}
        <div className="glass p-8">
          {step === 'form' && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                <Zap size={36} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">Completa el formulario<br/>para generar el cobro.</p>
            </div>
          )}

          {step === 'qr' && invoice && !confirmed && (
            <QRPaymentCard
              invoice={invoice}
              onRegenerate={handleRegenerate}
              onPaymentConfirmed={handlePaymentConfirmed}
            />
          )}

          {(step === 'qr' && confirmed) && invoice && (
            <div className="flex flex-col items-center gap-5 py-4 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#0A192F] mb-1">¡Pago Confirmado!</h3>
                <p className="text-gray-500">El pago Lightning fue recibido exitosamente.</p>
              </div>
              <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Referencia</span>
                  <span className="font-mono font-bold text-[#0A192F]">{invoice.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Monto</span>
                  <span className="font-bold text-[#0A192F]">{invoice.amountSats.toLocaleString()} SATS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Equivalente</span>
                  <span className="font-bold text-[#0A192F]">${getUSD()} USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Sucursal</span>
                  <span className="font-bold text-[#0A192F]">{invoice.store}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Red</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Zap size={12} /> Lightning Network
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Hora</span>
                  <span className="font-mono text-[#0A192F]">{new Date().toLocaleTimeString('es-EC')}</span>
                </div>
              </div>
              <button
                onClick={() => { setStep('form'); setInvoice(null); setAmount(''); setDescription(''); setConfirmed(false); }}
                className="w-full py-3.5 bg-[#F4B41A] text-[#0A192F] font-bold rounded-2xl hover:bg-[#FFC13B] transition-colors"
              >
                Nuevo Cobro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
