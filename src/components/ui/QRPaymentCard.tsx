import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, Clock, Copy, RefreshCw, XCircle, Zap } from '../common/Icons';
import { paymentService } from '../../features/payments/api/paymentService';
import { buildInvoiceUrl, buildPaymentUrl } from '../../features/payments/utils/paymentLinks';
import { type Invoice, type PaymentStatus } from '../../types';
import { cn } from '../../utils/cn';
import { QRCodeDisplay } from './QRCodeDisplay';

interface QRPaymentCardProps {
  invoice: Invoice;
  onRegenerate: () => void;
}

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: ReactNode; bg: string }> = {
  pending: {
    label: 'Waiting for payment...',
    color: 'text-brand-yellow',
    icon: <Clock size={16} className="animate-pulse" />,
    bg: 'bg-brand-yellow/10 border-brand-yellow/20',
  },
  paid: {
    label: 'Payment received!',
    color: 'text-binance-green',
    icon: <CheckCircle2 size={16} />,
    bg: 'bg-binance-green/10 border-binance-green/20',
  },
  completed: {
    label: 'Completed',
    color: 'text-binance-green',
    icon: <CheckCircle2 size={16} />,
    bg: 'bg-binance-green/10 border-binance-green/20',
  },
  failed: {
    label: 'Payment failed',
    color: 'text-binance-red',
    icon: <XCircle size={16} />,
    bg: 'bg-binance-red/10 border-binance-red/20',
  },
  expired: {
    label: 'Invoice expired',
    color: 'text-binance-muted',
    icon: <XCircle size={16} />,
    bg: 'bg-binance-gray border-binance-border',
  },
};

export function QRPaymentCard({ invoice, onRegenerate }: QRPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<PaymentStatus>(invoice.status);

  useEffect(() => {
    setStatus(invoice.status);
  }, [invoice]);

  useEffect(() => {
    const update = () => {
      let expiration = 0;
      const rawExpiresAt = invoice.expiresAt;

      if (typeof rawExpiresAt === 'number') {
        // Handle seconds vs milliseconds (if < year 2000, it's likely seconds)
        expiration = rawExpiresAt < 100000000000 ? rawExpiresAt * 1000 : rawExpiresAt;
      } else if (typeof rawExpiresAt === 'string') {
        expiration = new Date(rawExpiresAt).getTime();
      }

      // If no valid expiration, default to 1 hour from now as a safety fallback
      if (!expiration || isNaN(expiration)) {
        expiration = Date.now() + 3600000;
      }

      const remaining = Math.max(0, Math.floor((expiration - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && status === 'pending') {
        setStatus('expired');
      }
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [invoice.expiresAt, status]);

  const handleCopy = useCallback(() => {
    const text = invoice.lightningInvoice || '';
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [invoice.lightningInvoice]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const cfg = statusConfig[status] || statusConfig.pending;
  const shareableInvoice = { ...invoice, status };
  const invoiceUrl = buildInvoiceUrl(shareableInvoice);
  const paymentUrl = buildPaymentUrl(shareableInvoice);
  const invoiceQrCorrectionLevel = invoiceUrl.length > 180 ? 'M' : 'Q';
  const paymentQrCorrectionLevel = paymentUrl.length > 180 ? 'L' : 'M';
  const currentAmountSats = invoice.amountSats || 0;
  const btcUsd = (currentAmountSats / 100_000_000 * 63012.5).toFixed(2);
  const isSettled = status === 'paid' || status === 'completed';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-6 duration-500">
      <div
        className={cn(
          'relative rounded-[2rem] bg-white p-4 shadow-2xl transition-all duration-700',
          isSettled
            ? 'scale-105 border-4 border-binance-green shadow-[0_0_50px_rgba(14,203,129,0.3)]'
            : status === 'expired'
              ? 'grayscale opacity-50'
              : 'border-4 border-brand-yellow shadow-[0_0_50px_rgba(252,213,53,0.15)]',
        )}
      >
        {isSettled && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.75rem] bg-binance-green/90 backdrop-blur-sm">
            <div className="text-center text-binance-black">
              <CheckCircle2 size={64} className="mx-auto mb-3 animate-bounce" />
              <p className="text-2xl font-black tracking-tight">PAID</p>
            </div>
          </div>
        )}

        {status === 'expired' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.75rem] bg-binance-gray/90 backdrop-blur-sm">
            <div className="text-center text-binance-muted">
              <XCircle size={56} className="mx-auto mb-3" />
              <p className="text-xl font-black">EXPIRED</p>
            </div>
          </div>
        )}

        <div className="relative rounded-2xl border-4 border-binance-black bg-white p-4 shadow-inner">
          <QRCodeDisplay
            value={isSettled ? invoiceUrl : paymentUrl}
            alt={isSettled ? 'Invoice QR Code' : 'Payment QR Code'}
            width={320}
            errorCorrectionLevel={isSettled ? invoiceQrCorrectionLevel : paymentQrCorrectionLevel}
            className="shadow-sm"
            imageClassName="h-[min(72vw,280px)] w-[min(72vw,280px)] rounded-lg sm:h-[280px] sm:w-[280px]"
          />
        </div>
      </div>

      <div
        className={cn(
          'flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-widest shadow-lg transition-colors',
          cfg.bg,
          cfg.color,
        )}
      >
        {cfg.icon}
        {cfg.label}
      </div>

      <div className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <Zap size={24} className="text-brand-yellow" fill="currentColor" />
          <p className="text-4xl font-black tracking-tighter text-binance-text">
            {currentAmountSats.toLocaleString()} <span className="text-xl text-brand-yellow">SATS</span>
          </p>
        </div>
        <p className="text-sm font-medium text-binance-muted">
          ~ ${btcUsd} USD · 0.{String(currentAmountSats).padStart(8, '0').slice(-8)} BTC
        </p>
        {invoice.description && (
          <p className="mt-2 text-xs italic text-binance-muted opacity-80 underline decoration-dotted">
            "{invoice.description}"
          </p>
        )}
      </div>

      {status === 'pending' && (
        <div className="flex items-center gap-3 rounded-lg border border-binance-border bg-binance-gray px-4 py-2 text-sm">
          <span className="font-medium text-binance-muted">Expires in</span>
          <span
            className={cn(
              'font-mono text-lg font-black',
              timeLeft < 60 ? 'animate-pulse text-binance-red' : 'text-binance-text',
            )}
          >
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      )}

      <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
        {isSettled ? (
          <button
            onClick={() => window.open(invoiceUrl, '_blank', 'noopener,noreferrer')}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-brand-yellow bg-brand-yellow py-4 text-sm font-black text-binance-black shadow-md transition-all hover:bg-yellow-400 active:scale-95"
          >
            <CheckCircle2 size={18} /> VER FACTURA / PDF
          </button>
        ) : (
          <>
            <button
              onClick={handleCopy}
              disabled={status !== 'pending'}
              className="flex-1 rounded-xl border border-binance-border bg-binance-gray py-4 text-sm font-black text-binance-text shadow-md transition-all hover:bg-white/5 active:scale-95 disabled:opacity-30"
            >
              <span className="flex items-center justify-center gap-3">
                {copied ? <CheckCircle2 size={18} className="text-binance-green" /> : <Copy size={18} />}
                {copied ? 'COPIED' : 'COPY INVOICE'}
              </span>
            </button>
            <button
              onClick={onRegenerate}
              disabled={status !== 'pending'}
              className="flex-1 rounded-xl border border-brand-yellow/30 bg-binance-black py-4 text-sm font-black text-brand-yellow shadow-md transition-all hover:bg-brand-yellow hover:text-binance-black active:scale-95 disabled:opacity-30"
            >
              <span className="flex items-center justify-center gap-3">
                <RefreshCw size={18} /> NEW QR
              </span>
            </button>
          </>
        )}
      </div>

      {status === 'pending' && (
        <button
          onClick={() => paymentService.simulatePayment(invoice.id)}
          className="mt-2 w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-500 transition-all hover:bg-emerald-500 hover:text-slate-950"
        >
          Simular Pago (Testing)
        </button>
      )}

      <p className="max-w-xs text-center text-[11px] font-medium leading-5 text-binance-muted">
        El QR usa un enlace publico compatible con camaras moviles y abre el pago o la factura correcta segun el estado.
      </p>
    </div>
  );
}
