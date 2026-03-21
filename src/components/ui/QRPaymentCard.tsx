import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, CheckCircle2, Clock, XCircle, Zap } from 'lucide-react';
import { type Invoice, type PaymentStatus } from '../../types';

interface QRPaymentCardProps {
  invoice: Invoice;
  onRegenerate: () => void;
  onPaymentConfirmed?: () => void;
}

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  pending: {
    label: 'Esperando pago...',
    color: 'text-amber-600',
    icon: <Clock size={16} className="animate-pulse" />,
    bg: 'bg-amber-50 border-amber-200'
  },
  paid: {
    label: '¡Pago recibido!',
    color: 'text-emerald-600',
    icon: <CheckCircle2 size={16} />,
    bg: 'bg-emerald-50 border-emerald-200'
  },
  failed: {
    label: 'Pago fallido',
    color: 'text-red-600',
    icon: <XCircle size={16} />,
    bg: 'bg-red-50 border-red-200'
  },
  expired: {
    label: 'Invoice expirado',
    color: 'text-gray-500',
    icon: <XCircle size={16} />,
    bg: 'bg-gray-50 border-gray-200'
  }
};

export function QRPaymentCard({ invoice, onRegenerate, onPaymentConfirmed }: QRPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<PaymentStatus>(invoice.status);

  useEffect(() => {
    setStatus(invoice.status);
  }, [invoice]);

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Math.floor((invoice.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0 && status === 'pending') {
        setStatus('expired');
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [invoice.expiresAt, status]);

  // Simulate payment detection after 8 seconds for demo
  useEffect(() => {
    if (status !== 'pending') return;
    const timeout = setTimeout(() => {
      setStatus('paid');
      onPaymentConfirmed?.();
    }, 8000);
    return () => clearTimeout(timeout);
  }, [invoice.id, status, onPaymentConfirmed]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(invoice.lightningInvoice).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [invoice.lightningInvoice]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const cfg = statusConfig[status];

  // Build QR SVG from invoice data (simplified grid mock)
  const btcUSD = (invoice.amountSats / 100_000_000 * 63012.50).toFixed(2);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* QR Code (styled SVG mock) */}
      <div className={`relative p-3 bg-white rounded-3xl shadow-lg border-2 transition-all duration-500 ${
        status === 'paid' ? 'border-emerald-400 shadow-emerald-100' :
        status === 'expired' ? 'border-gray-300' : 'border-[#F4B41A]/40'
      }`}>
        {status === 'paid' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-emerald-500/90 z-10">
            <div className="text-center text-white">
              <CheckCircle2 size={48} className="mx-auto mb-2" />
              <p className="font-bold text-lg">¡PAGADO!</p>
            </div>
          </div>
        )}
        {status === 'expired' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gray-200/90 z-10">
            <div className="text-center text-gray-500">
              <XCircle size={40} className="mx-auto mb-2" />
              <p className="font-bold">Expirado</p>
            </div>
          </div>
        )}
        {/* Pixel QR grid */}
        <svg width="196" height="196" viewBox="0 0 196 196" xmlns="http://www.w3.org/2000/svg">
          <rect width="196" height="196" fill="white"/>
          {/* Finder patterns */}
          <rect x="8" y="8" width="49" height="49" rx="4" fill="#0A192F"/>
          <rect x="13" y="13" width="39" height="39" rx="2" fill="white"/>
          <rect x="18" y="18" width="29" height="29" rx="1" fill="#0A192F"/>
          <rect x="139" y="8" width="49" height="49" rx="4" fill="#0A192F"/>
          <rect x="144" y="13" width="39" height="39" rx="2" fill="white"/>
          <rect x="149" y="18" width="29" height="29" rx="1" fill="#0A192F"/>
          <rect x="8" y="139" width="49" height="49" rx="4" fill="#0A192F"/>
          <rect x="13" y="144" width="39" height="39" rx="2" fill="white"/>
          <rect x="18" y="149" width="29" height="29" rx="1" fill="#0A192F"/>
          {/* Data modules (simplified) */}
          {[70,77,84,91,98,105,112,119,126].map((x) =>
            [70,77,84,91,98,105,112,119,126].map((y) => {
              const seed = (x * 13 + y * 7 + invoice.amountSats) % 3;
              return seed === 0 ? <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" rx="1" fill="#0A192F"/> : null;
            })
          )}
          {[8,15,22,29,36,43,50,57].map((x) =>
            [70,77,84,91,98,105,112,119,126].map((y) => {
              const seed = (x * 11 + y * 3) % 2;
              return seed === 0 ? <rect key={`b${x}${y}`} x={x} y={y} width="6" height="6" rx="1" fill="#0A192F"/> : null;
            })
          )}
          {[139,146,153,160,167,174,181].map((x) =>
            [70,77,84,91,98,105,112,119,126].map((y) => {
              const seed = (x * 7 + y * 5) % 2;
              return seed === 0 ? <rect key={`c${x}${y}`} x={x} y={y} width="6" height="6" rx="1" fill="#0A192F"/> : null;
            })
          )}
          <rect x="139" y="139" width="49" height="6" rx="1" fill="#0A192F"/>
          <rect x="139" y="151" width="49" height="6" rx="1" fill="#0A192F"/>
          <rect x="139" y="163" width="49" height="6" rx="1" fill="#0A192F"/>
          <rect x="139" y="175" width="49" height="6" rx="1" fill="#0A192F"/>
          {/* Lightning bolt center */}
          <circle cx="98" cy="98" r="14" fill="#F4B41A"/>
          <path d="M104 90 L95 100 L101 100 L92 108 L101 97 L95 97 Z" fill="white"/>
        </svg>
      </div>

      {/* Status indicator */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
        {cfg.label}
      </div>

      {/* Amount */}
      <div className="text-center">
        <p className="text-3xl font-black text-[#0A192F]">
          {invoice.amountSats.toLocaleString()} <span className="text-lg text-[#F4B41A]">SATS</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">≈ ${btcUSD} USD · 0.{String(invoice.amountSats).padStart(8, '0').slice(-8)} BTC</p>
        <p className="text-xs text-gray-400 mt-0.5">{invoice.description}</p>
      </div>

      {/* Timer */}
      {status === 'pending' && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap size={14} className="text-[#F4B41A]" />
          Expira en <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-[#0A192F]'}`}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleCopy}
          disabled={status !== 'pending'}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm text-gray-700 disabled:opacity-40"
        >
          {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        <button
          onClick={onRegenerate}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0A192F] text-white rounded-xl hover:bg-[#1A2C49] transition-colors font-semibold text-sm"
        >
          <RefreshCw size={16} />
          Nuevo QR
        </button>
      </div>

      {/* Invoice string */}
      <div className="w-full">
        <p className="text-[10px] font-mono bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-gray-400 truncate">
          {invoice.lightningInvoice}
        </p>
      </div>
    </div>
  );
}
