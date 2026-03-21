import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { paymentService } from './../api/paymentService';
import { type Invoice } from '../../../types';
import { CheckCircle2, Copy, Download, Zap, XCircle } from '../../../components/common/Icons';
import { cn } from '../../../utils/cn';

export function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        setInvoice(decoded);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Invalid invoice data in URL', err);
      }
    }

    if (id) {
      paymentService.getInvoiceById(id).then(data => {
        setInvoice(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  // Auto-trigger print when loaded from QR
  useEffect(() => {
    if (!loading && invoice) {
      setTimeout(() => {
        window.print();
      }, 1000); // 1 sec delay to ensure styles are fully rendered
    }
  }, [loading, invoice]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
          <p>Cargando Factura...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4 max-w-sm mx-auto p-6 bg-slate-900 rounded-2xl border border-slate-800">
          <XCircle size={48} className="mx-auto text-binance-red" />
          <h1 className="text-2xl font-black text-slate-100">Factura no encontrada</h1>
          <p className="text-slate-400 text-sm">El comprobante que buscas no existe o ha expirado.</p>
          <Link to="/" className="inline-block mt-4 px-6 py-2 bg-brand-yellow text-slate-950 font-black rounded-lg hover:bg-brand-yellow/90">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'paid' || invoice.status === 'completed';
  const subtotal = invoice.amountUsd || 0;
  const tax = 0; // Crypto payments often don't have standard VAT calculated here, or are tax-inclusive
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:p-8 flex justify-center text-slate-900 font-sans print:bg-white print:p-0">
      <div className="w-full max-w-2xl">

        {/* Action Bar - Hidden in Print */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            &larr; Volver
          </Link>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Enlace copiado al portapapeles");
              }}
              className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Copy size={16} /> Compartir Enlace
            </button>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-brand-yellow text-binance-black hover:bg-yellow-400 rounded-lg text-sm font-black flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(252,213,53,0.3)]"
            >
              <Download size={16} /> Descargar PDF
            </button>
          </div>
        </div>

        {/* Invoice Paper Document */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl print:shadow-none print:rounded-none mx-auto relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-100 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-binance-black rounded-xl flex items-center justify-center shadow-lg">
                  <Zap size={24} className="text-brand-yellow fill-current" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kero</h1>
              </div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-4">Comprobante de Pago Electrónico</p>
              <p className="text-2xl font-black text-slate-800 mb-1 mt-1">Factura #{invoice.id.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="text-left sm:text-right flex flex-col gap-1 items-start sm:items-end">
               <div className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border",
                  isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-200" : 
                           "bg-amber-50 text-amber-600 border-amber-200"
               )}>
                 {isPaid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                 {isPaid ? "PAGADO" : "PENDIENTE"}
               </div>
               <p className="text-slate-500 text-sm font-medium mt-3">Fecha de Emisión</p>
               <p className="text-slate-800 font-bold">{new Date(invoice.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Comerciante / Local</p>
              <p className="text-lg font-black text-slate-800">{invoice.store || 'Comercio Afiliado Kero'}</p>
              <p className="text-sm text-slate-600 font-medium">ID Local: {invoice.store || 'N/A'}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cliente / Autorizado a</p>
              <p className="text-lg font-black text-slate-800">Consumidor Final</p>
              <p className="text-sm text-slate-600 font-medium">Pagado vía Lightning Network</p>
            </div>
          </div>

          {/* Table / Items */}
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Productos / Servicios</p>
            <div className="w-full">
              <div className="flex justify-between border-b-2 border-slate-900 pb-3 mb-3 text-sm font-black text-slate-900">
                <div className="flex-1">Descripción</div>
                <div className="text-right">Total (USD)</div>
              </div>
              <div className="flex justify-between py-3 text-slate-700 font-medium border-b border-slate-100 items-start gap-4">
                <div className="flex-1 leading-relaxed">{invoice.description || 'Compra en establecimiento comercial'}</div>
                <div className="text-right font-bold text-slate-900">${subtotal.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Summaries & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-8 pt-4">
            
            {/* Payment Info */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full sm:w-1/2">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Información de Pago</p>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500 font-medium">Método</span>
                   <span className="font-bold text-slate-800 flex items-center gap-1"><Zap size={14} className="text-brand-yellow fill-current" /> Bitcoin Lightning</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500 font-medium">Red</span>
                   <span className="font-bold text-slate-800">Lightning Network</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500 font-medium">TxID (Ref)</span>
                   <span className="font-mono text-xs font-bold text-slate-600 break-all">{invoice.id}</span>
                 </div>
               </div>
            </div>

            {/* Totals */}
            <div className="w-full sm:w-1/3 min-w-[200px] space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Impuestos (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3 mt-3">
                <span className="font-black text-slate-900 text-lg uppercase tracking-tight">Total USD</span>
                <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Monto SATS</span>
                <span className="font-black text-brand-yellow bg-slate-900 px-2 py-0.5 rounded flex items-center gap-1"><Zap size={12} className="fill-current" /> {invoice.amountSats?.toLocaleString() || 0}</span>
              </div>
            </div>
            
          </div>

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">¡Gracias por usar Kero!</p>
            <p className="text-xs text-slate-500 font-medium">Documento generado automáticamente por el sistema de pagos.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
