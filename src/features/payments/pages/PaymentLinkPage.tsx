import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { SEO } from '../../../components/common/SEO';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Smartphone,
  XCircle,
  Zap,
} from '../../../components/common/Icons';
import { paymentService } from '../api/paymentService';
import { type Invoice } from '../../../types';
import { cn } from '../../../utils/cn';
import {
  buildInvoiceUrl,
  buildLightningWalletHref,
  decodeInvoiceSnapshot,
  isDemoInvoice,
  mergeInvoices,
} from '../utils/paymentLinks';

export function PaymentLinkPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const snapshotInvoice = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return decodeInvoiceSnapshot(params.get('s'));
  }, [location.search]);
  const [invoice, setInvoice] = useState<Invoice | null>(() => snapshotInvoice);
  const [loading, setLoading] = useState(() => Boolean(id) && !snapshotInvoice);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const demoMode = isDemoInvoice(invoice ?? snapshotInvoice);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      return () => {
        cancelled = true;
      };
    }

    paymentService
      .getInvoiceById(id)
      .then((apiInvoice) => {
        if (cancelled) {
          return;
        }

        const resolved = mergeInvoices(apiInvoice, snapshotInvoice);
        setInvoice(resolved);
        if (!resolved) {
          setErrorMsg('This payment request is not available anymore.');
        } else {
          setErrorMsg('');
        }
      })
      .catch((error) => {
        console.error('Failed to resolve public payment link', error);
        if (!cancelled && !snapshotInvoice) {
          setErrorMsg('We could not load the payment request from the public API.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, snapshotInvoice]);

  useEffect(() => {
    if (!id || demoMode || !invoice || invoice.status === 'paid' || invoice.status === 'completed') {
      return;
    }

    let cancelled = false;
    const interval = window.setInterval(async () => {
      try {
        const status = await paymentService.checkPaymentStatus(id);
        if (cancelled || (status !== 'paid' && status !== 'completed')) {
          return;
        }

        setInvoice((current) => (current ? { ...current, status } : current));
      } catch (error) {
        console.error('Public payment status polling failed', error);
      }
    }, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [demoMode, id, invoice, invoice?.status, invoice?.lightningInvoice]);

  const paymentHref = buildLightningWalletHref(invoice?.lightningInvoice);
  const receiptHref = invoice ? buildInvoiceUrl(invoice) : '';
  const isPaid = invoice?.status === 'paid' || invoice?.status === 'completed';

  const handleCopyInvoice = async () => {
    if (!invoice?.lightningInvoice) {
      return;
    }

    try {
      await navigator.clipboard.writeText(invoice.lightningInvoice);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard copy failed', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-yellow border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">Preparing secure mobile payment...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl">
          <XCircle size={52} className="mx-auto mb-4 text-binance-red" />
          <h1 className="text-2xl font-black text-slate-50">Payment unavailable</h1>
          <p className="mt-3 text-sm text-slate-400">
            {errorMsg || 'The QR code is valid, but the payment details are no longer available.'}
          </p>
          {!id && !errorMsg && (
            <p className="mt-3 text-sm text-red-300">No payment identifier was provided.</p>
          )}
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-yellow-400"
          >
            Back to KuriPay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(252,213,53,0.16),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#020617_100%)] px-4 py-8 text-white sm:px-6">
      <SEO
        title="Mobile Lightning Payment"
        description="Open the KuriPay mobile checkout and complete a Lightning payment from any phone."
        canonical={typeof window !== 'undefined' ? window.location.href : undefined}
      />

      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-brand-yellow">
                <Smartphone size={14} />
                Mobile checkout
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-50">Complete Lightning payment</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                This QR opens a public, mobile-safe payment page so common phone cameras can resolve the link and hand off to a Lightning wallet.
              </p>
            </div>
            <div
              className={cn(
                'rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em]',
                isPaid
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300',
              )}
            >
              {isPaid ? 'Paid' : 'Pending'}
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Merchant</p>
              <p className="mt-2 text-lg font-black text-slate-100">{invoice.store || 'KuriPay Merchant'}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Amount</p>
              <p className="mt-2 text-3xl font-black text-brand-yellow">
                {invoice.amountSats?.toLocaleString() || 0}
                <span className="ml-2 text-sm text-slate-400">SATS</span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-400">${(invoice.amountUsd || invoice.amount || 0).toFixed(2)} USD</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Description</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {invoice.description || 'Lightning payment request generated by KuriPay.'}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href={paymentHref || undefined}
              className={cn(
                'inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-black transition-all',
                paymentHref
                  ? 'bg-brand-yellow text-slate-950 shadow-[0_0_30px_rgba(252,213,53,0.22)] hover:bg-yellow-400'
                  : 'cursor-not-allowed bg-slate-800 text-slate-500',
              )}
            >
              <Zap size={18} />
              Open Lightning wallet
              <ArrowRight size={18} />
            </a>

            <button
              type="button"
              onClick={handleCopyInvoice}
              disabled={!invoice.lightningInvoice}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-black text-slate-100 transition-colors hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
              {copied ? 'Lightning invoice copied' : 'Copy Lightning invoice'}
            </button>

            <a
              href={receiptHref || undefined}
              className={cn(
                'inline-flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-sm font-black transition-colors',
                isPaid
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800',
              )}
            >
              <ExternalLink size={18} />
              {isPaid ? 'Open receipt' : 'Open invoice preview'}
            </a>
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <Globe size={18} className="mt-0.5 shrink-0 text-brand-yellow" />
              <p>This page is reachable over HTTPS so QR scans work from external phones instead of resolving to localhost or a private laptop IP.</p>
            </div>
            {demoMode && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-100">
                <XCircle size={18} className="mt-0.5 shrink-0" />
                <p>This invoice is running in demo mode. The mobile flow is still shareable, but a real wallet payment requires a healthy backend invoice.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
