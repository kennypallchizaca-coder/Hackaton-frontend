import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { paymentService } from './../api/paymentService';
import { type Invoice } from '../../../types';
import { CheckCircle2, Copy, Download, ExternalLink, Zap, XCircle } from '../../../components/common/Icons';
import { SEO } from '../../../components/common/SEO';
import { cn } from '../../../utils/cn';
import {
  decodeInvoiceSnapshot,
  decodeLegacyInvoiceHash,
  mergeInvoices,
} from '../utils/paymentLinks';

export function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const snapshotInvoice = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return decodeInvoiceSnapshot(params.get('s')) ?? decodeLegacyInvoiceHash(location.hash);
  }, [location.hash, location.search]);
  const [invoice, setInvoice] = useState<Invoice | null>(() => snapshotInvoice);
  const [loading, setLoading] = useState(() => Boolean(id) && !snapshotInvoice);
  const [errorMsg, setErrorMsg] = useState('');
  const [shareNotice, setShareNotice] = useState('');
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

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
          setErrorMsg('The receipt does not exist or is no longer available.');
        } else {
          setErrorMsg('');
        }
      })
      .catch((error) => {
        console.error('Failed to load invoice page', error);
        if (!cancelled && !snapshotInvoice) {
          setErrorMsg('We could not retrieve the invoice from the public API.');
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    try {
      if (canShare) {
        await navigator.share({
          title: `Factura ${invoice?.id ?? ''}`,
          text: 'Factura generada por KuriPay',
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareNotice('Enlace copiado al portapapeles');
      window.setTimeout(() => setShareNotice(''), 2500);
    } catch (error) {
      console.error('Failed to share invoice', error);
      setShareNotice('No se pudo compartir este enlace');
      window.setTimeout(() => setShareNotice(''), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex animate-pulse flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-yellow border-t-transparent" />
          <p>Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="mx-auto max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <XCircle size={48} className="mx-auto text-binance-red" />
          <h1 className="text-2xl font-black text-slate-100">Factura no encontrada</h1>
          <p className="text-sm text-slate-400">El comprobante que buscas no existe o ya no esta disponible.</p>
          {errorMsg && (
            <p className="break-words rounded border border-red-500/20 bg-red-900/20 p-2 text-xs text-red-400">
              {errorMsg}
            </p>
          )}
          {!id && !errorMsg && (
            <p className="break-words rounded border border-red-500/20 bg-red-900/20 p-2 text-xs text-red-400">
              No invoice identifier was provided.
            </p>
          )}
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-brand-yellow px-6 py-2 font-black text-slate-950 transition-colors hover:bg-brand-yellow/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid' || invoice.status === 'completed';
  const subtotal = invoice.amountUsd || invoice.amount || 0;
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 font-sans text-slate-900 print:bg-white print:p-0 sm:px-6 sm:py-10">
      <SEO
        title={`Factura ${invoice.id.slice(0, 8).toUpperCase()}`}
        description="Factura publica y compatible con moviles generada por KuriPay."
        canonical={typeof window !== 'undefined' ? window.location.href : undefined}
      />

      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
            &larr; Volver
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-700"
            >
              {canShare ? <ExternalLink size={16} /> : <Copy size={16} />}
              Compartir enlace
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-black text-binance-black shadow-[0_0_15px_rgba(252,213,53,0.3)] transition-colors hover:bg-yellow-400"
            >
              <Download size={16} /> Descargar PDF
            </button>
          </div>
        </div>

        {shareNotice && (
          <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 print:hidden">
            {shareNotice}
          </div>
        )}

        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl print:rounded-none print:shadow-none sm:p-10 lg:p-12">
          <div className="mb-8 flex flex-col gap-6 border-b-2 border-slate-100 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-binance-black shadow-lg">
                  <Zap size={24} className="fill-current text-brand-yellow" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Kero</h1>
              </div>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
                Comprobante de pago electronico
              </p>
              <p className="mt-1 text-2xl font-black text-slate-800">
                Factura #{invoice.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1 sm:items-end sm:text-right">
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm',
                  isPaid
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-amber-200 bg-amber-50 text-amber-600',
                )}
              >
                {isPaid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {isPaid ? 'Pagado' : 'Pendiente'}
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">Fecha de emision</p>
              <p className="font-bold text-slate-800">{new Date(invoice.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-8 border-b-2 border-slate-100 pb-8 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Comerciante / Local</p>
              <p className="text-lg font-black text-slate-800">{invoice.store || 'Comercio Afiliado Kero'}</p>
              <p className="text-sm font-medium text-slate-600">ID Local: {invoice.store || 'N/A'}</p>
            </div>
            <div className="sm:text-right">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Cliente</p>
              <p className="text-lg font-black text-slate-800">Consumidor Final</p>
              <p className="text-sm font-medium text-slate-600">Pagado via Lightning Network</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Productos / Servicios</p>
            <div className="w-full">
              <div className="mb-3 flex justify-between border-b-2 border-slate-900 pb-3 text-sm font-black text-slate-900">
                <div className="flex-1">Descripcion</div>
                <div className="text-right">Total (USD)</div>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 font-medium text-slate-700">
                <div className="flex-1 leading-relaxed">
                  {invoice.description || 'Compra en establecimiento comercial'}
                </div>
                <div className="text-right font-bold text-slate-900">${subtotal.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:w-1/2">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Informacion de pago</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">Metodo</span>
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Zap size={14} className="fill-current text-brand-yellow" /> Bitcoin Lightning
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">Red</span>
                  <span className="font-bold text-slate-800">Lightning Network</span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="font-medium text-slate-500">TxID (Ref)</span>
                  <span className="break-all font-mono text-xs font-bold text-slate-600">{invoice.id}</span>
                </div>
              </div>
            </div>

            <div className="w-full min-w-[200px] space-y-3 sm:w-1/3">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Impuestos (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t-2 border-slate-900 pt-3">
                <span className="text-lg font-black uppercase tracking-tight text-slate-900">Total USD</span>
                <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500">Monto SATS</span>
                <span className="flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 font-black text-brand-yellow">
                  <Zap size={12} className="fill-current" /> {invoice.amountSats?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 print:hidden">
            En movil, usa "Compartir enlace" para enviar la factura o "Descargar PDF" para abrir el dialogo nativo del navegador. No se fuerza la impresion al escanear para evitar errores en Safari y Chrome movil.
          </div>

          <div className="mt-16 border-t border-slate-100 pt-8 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Gracias por usar Kero</p>
            <p className="text-xs font-medium text-slate-500">
              Documento generado automaticamente por el sistema de pagos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
