import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, CheckCircle2, Clock, XCircle, Zap } from '../common/Icons';
import { paymentService } from '../../features/payments/api/paymentService';
import { type Invoice, type PaymentStatus } from '../../types';
import { cn } from '../../utils/cn';

interface QRPaymentCardProps {
  invoice: Invoice;
  onRegenerate: () => void;
}

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  pending: {
    label: 'Waiting for payment...',
    color: 'text-brand-yellow',
    icon: <Clock size={16} className="animate-pulse" />,
    bg: 'bg-brand-yellow/10 border-brand-yellow/20'
  },
  paid: {
    label: 'Payment received!',
    color: 'text-binance-green',
    icon: <CheckCircle2 size={16} />,
    bg: 'bg-binance-green/10 border-binance-green/20'
  },
  completed: {
    label: 'Completed',
    color: 'text-binance-green',
    icon: <CheckCircle2 size={16} />,
    bg: 'bg-binance-green/10 border-binance-green/20'
  },
  failed: {
    label: 'Payment failed',
    color: 'text-binance-red',
    icon: <XCircle size={16} />,
    bg: 'bg-binance-red/10 border-binance-red/20'
  },
  expired: {
    label: 'Invoice expired',
    color: 'text-binance-muted',
    icon: <XCircle size={16} />,
    bg: 'bg-binance-gray border-binance-border'
  }
};

export function QRPaymentCard({ invoice, onRegenerate }: QRPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<PaymentStatus>(invoice.status);

  useEffect(() => {
    setStatus(invoice.status);
  }, [invoice]);

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const exp = typeof invoice.expiresAt === 'number' ? invoice.expiresAt : Date.now();
      const remaining = Math.max(0, Math.floor((exp - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && status === 'pending') {
        setStatus('expired');
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [invoice.expiresAt, status]);

  // Payment detection is handled by the parent/service via polling or SSE
  // removing simulated timeout to ensure 100% real backend integration

  const handleCopy = useCallback(() => {
    const text = invoice.lightningInvoice || '';
    if (text) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [invoice.lightningInvoice]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const cfg = statusConfig[status] || statusConfig.pending;

  const currentAmountSats = invoice.amountSats || 0;
  const btcUSD = (currentAmountSats / 100_000_000 * 63012.50).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* QR CONTAINER */}
      <div className={cn(
        "relative p-4 bg-white rounded-[2rem] shadow-2xl transition-all duration-700 transform",
        status === 'paid' || status === 'completed' ? "scale-105 border-4 border-binance-green shadow-[0_0_50px_rgba(14,203,129,0.3)]" : 
        status === 'expired' ? "grayscale opacity-50" : "border-4 border-brand-yellow shadow-[0_0_50px_rgba(252,213,53,0.15)]"
      )}>
        {/* Success Overlay */}
        {(status === 'paid' || status === 'completed') && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[1.75rem] bg-binance-green/90 z-20 backdrop-blur-sm">
            <div className="text-center text-binance-black">
              <CheckCircle2 size={64} className="mx-auto mb-3 animate-bounce" />
              <p className="font-black text-2xl tracking-tight">PAID</p>
            </div>
          </div>
        )}

        {/* Expired Overlay */}
        {status === 'expired' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[1.75rem] bg-binance-gray/90 z-20 backdrop-blur-sm">
            <div className="text-center text-binance-muted">
              <XCircle size={56} className="mx-auto mb-3" />
              <p className="font-black text-xl">EXPIRED</p>
            </div>
          </div>
        )}

        {/* REAL QR GENERATION VIA API */}
        <div className="relative bg-white p-4 rounded-2xl shadow-inner border-4 border-binance-black">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
              (status === 'paid' || status === 'completed')
                ? `${window.location.origin}/invoice/${invoice.id}#payload=${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({
                    id: invoice.id,
                    amount: invoice.amount,
                    amountSats: invoice.amountSats,
                    amountUsd: invoice.amountUsd,
                    description: invoice.description,
                    status: invoice.status,
                    store: invoice.store,
                    createdAt: invoice.createdAt
                  }))))}`
                : (invoice.lightningInvoice || '')
            )}&bgcolor=ffffff&color=020617&margin=1`}
            alt={status === 'paid' || status === 'completed' ? "Invoice QR Code" : "Payment QR Code"}
            className="w-[240px] h-[240px] rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-black uppercase tracking-widest shadow-lg transition-colors",
        cfg.bg, cfg.color
      )}>
        {cfg.icon}
        {cfg.label}
      </div>

      {/* Amount Display */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
           <Zap size={24} className="text-brand-yellow" fill="currentColor" />
           <p className="text-4xl font-black text-binance-text tracking-tighter">
             {currentAmountSats.toLocaleString()} <span className="text-xl text-brand-yellow">SATS</span>
           </p>
        </div>
        <p className="text-sm font-medium text-binance-muted">≈ ${btcUSD} USD · 0.{String(currentAmountSats).padStart(8, '0').slice(-8)} BTC</p>
        {invoice.description && <p className="text-xs text-binance-muted italic mt-2 opacity-80 decoration-dotted underline">"{invoice.description}"</p>}
      </div>

      {/* Expiry */}
      {status === 'pending' && (
        <div className="flex items-center gap-3 text-sm py-2 px-4 bg-binance-gray rounded-lg border border-binance-border">
          <span className="text-binance-muted font-medium">Expires in</span>
          <span className={cn(
            "font-mono font-black text-lg",
            timeLeft < 60 ? "text-binance-red animate-pulse" : "text-binance-text"
          )}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 w-full pt-2">
        {(status === 'paid' || status === 'completed') ? (
          <button
            onClick={() => window.open(`/invoice/${invoice.id}#payload=${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({
              id: invoice.id,
              amount: invoice.amount,
              amountSats: invoice.amountSats,
              amountUsd: invoice.amountUsd,
              description: invoice.description,
              status: invoice.status,
              store: invoice.store,
              createdAt: invoice.createdAt
            }))))}`, '_blank')}
            className="w-full flex items-center justify-center gap-3 py-4 bg-brand-yellow border border-brand-yellow rounded-xl hover:bg-yellow-400 active:scale-95 transition-all font-black text-sm text-binance-black shadow-md"
          >
            <CheckCircle2 size={18} /> VER FACTURA / PDF
          </button>
        ) : (
          <>
            <button
              onClick={handleCopy}
              disabled={status !== 'pending'}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-binance-gray border border-binance-border rounded-xl hover:bg-white/5 active:scale-95 transition-all font-black text-sm text-binance-text disabled:opacity-30 shadow-md"
            >
              {copied ? <CheckCircle2 size={18} className="text-binance-green" /> : <Copy size={18} />}
              {copied ? 'COPIED' : 'COPY INVOICE'}
            </button>
            <button 
              onClick={onRegenerate} 
              disabled={status !== 'pending'}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-binance-black border border-brand-yellow/30 text-brand-yellow rounded-xl hover:bg-brand-yellow hover:text-binance-black active:scale-95 transition-all font-black text-sm disabled:opacity-30 shadow-md"
            >
              <RefreshCw size={18} /> NEW QR
            </button>
          </>
        )}
      </div>

      {status === 'pending' && (
        <button
          onClick={() => paymentService.simulatePayment(invoice.id)}
          className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all font-black text-[10px] uppercase tracking-widest mt-2"
        >
          Simular Pago (Testing)
        </button>
      )}
    </div>
  );
}
