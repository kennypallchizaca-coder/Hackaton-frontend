import { useState, useEffect } from 'react';
import { ShieldAlert, EyeOff, FileText, CheckCircle2, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { type Transaction, type AuditEntry, type KYTAlert } from '../types';
import { complianceService } from '../services/complianceService';
import { RiskBadge } from '../components/ui/RiskBadge';
import { AuditTimeline } from '../components/ui/AuditTimeline';
import { Badge } from '../components/ui/Badge';

type ComplianceTab = 'kyt' | 'poi' | 'audit';

export function Compliance() {
  const [atRiskTransactions, setAtRiskTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<KYTAlert[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ComplianceTab>('kyt');
  const [generating, setGenerating] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<string | null>(null);
  const [selectedTxId, setSelectedTxId] = useState<string>('tx_3a1b9c');

  useEffect(() => {
    Promise.all([
      complianceService.getAtRiskTransactions(),
      complianceService.getAllAlerts(),
      complianceService.getAuditLog()
    ]).then(([txs, als, audit]) => {
      setAtRiskTransactions(txs);
      setAlerts(als);
      setAuditLog(audit);
      setIsLoading(false);
    });
  }, []);

  const handleGeneratePoI = async () => {
    setGenerating(true);
    setGeneratedPayload(null);
    const payload = await complianceService.generateSelectiveDisclosure(selectedTxId);
    setGeneratedPayload(JSON.stringify(payload, null, 2));
    setGenerating(false);
  };

  const TABS: { id: ComplianceTab; label: string }[] = [
    { id: 'kyt', label: 'KYT · Alertas' },
    { id: 'poi', label: 'Proof of Innocence' },
    { id: 'audit', label: 'Registro de Auditoría' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#0A192F] flex items-center gap-3">
          <ShieldAlert className="text-[#F4B41A]" size={28} />
          Compliance &amp; Seguridad
        </h1>
        <p className="text-gray-500 mt-1">KYT, Proof of Innocence y Selective Disclosure para comercios regulados.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-white text-[#0A192F] shadow-sm' : 'text-gray-500 hover:text-[#0A192F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KYT TAB */}
      {activeTab === 'kyt' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-bold text-[#0A192F]">Transacciones Flaggeadas</h2>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#F4B41A]" size={28} /></div>
            ) : (
              <div className="space-y-3">
                {atRiskTransactions.map(tx => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTxId(tx.id)}
                    className={`glass p-5 cursor-pointer border transition-all hover:shadow-md ${
                      selectedTxId === tx.id ? 'border-[#F4B41A] bg-amber-50/50' : 'border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-mono font-bold text-sm text-[#0A192F]">{tx.id}</p>
                      <RiskBadge risk={tx.compliance!.kytRisk} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xl font-black text-[#0A192F]">{tx.amountBTC} BTC</p>
                        <p className="text-xs text-gray-500">{tx.amountUSD}</p>
                      </div>
                      <p className="text-xs text-gray-400">{tx.store}</p>
                    </div>
                    {tx.compliance?.disputed && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 font-bold">
                        <AlertTriangle size={12} /> En disputa — Ver GenLayer
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-[#0A192F]">Alertas KYT Activas</h2>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#F4B41A]" size={28} /></div>
            ) : (
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className={`glass p-5 border ${alert.resolved ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <RiskBadge risk={alert.riskLevel} showLabel />
                        <span className="font-mono text-xs text-gray-500">{alert.txId}</span>
                      </div>
                      {alert.resolved ? (
                        <Badge variant="success">Resuelto</Badge>
                      ) : (
                        <Badge variant="error">Pendiente</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-2">{alert.reason}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-mono text-xs text-gray-400 truncate max-w-[200px]">{alert.walletAddress}</p>
                      <p className="text-xs text-gray-400">{new Date(alert.detectedAt).toLocaleString('es-EC')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROOF OF INNOCENCE TAB */}
      {activeTab === 'poi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-8 relative">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5">
              <Sparkles size={28} className="text-[#F4B41A]" />
            </div>
            <h3 className="text-xl font-bold text-[#0A192F] mb-2">Selective Disclosure</h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Genera una prueba criptográfica redactada de la legitimidad de tu negocio, sin exponer wallets de clientes a auditores o bancos adquirentes.
            </p>

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-500 mb-2">ID de Transacción</label>
              <select
                value={selectedTxId}
                onChange={(e) => setSelectedTxId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[#0A192F] font-mono text-sm focus:outline-none focus:border-[#F4B41A]"
              >
                {atRiskTransactions.map(tx => (
                  <option key={tx.id} value={tx.id}>{tx.id} · {tx.amountBTC} BTC</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGeneratePoI}
                disabled={generating}
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-[#F4B41A] text-[#0A192F] font-bold rounded-xl hover:bg-[#FFC13B] disabled:opacity-50 transition-colors"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generar Prueba
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                <EyeOff size={16} /> Ocultar Datos
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
              <p className="text-sm text-gray-600">
                <strong className="text-[#0A192F]">Conforme:</strong> El payload satisface requerimientos del SRI Ecuador y principios de privacidad Web3.
              </p>
            </div>
          </div>

          <div className="glass p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#0A192F]">Payload Generado</h3>
              {generatedPayload && (
                <button
                  onClick={() => navigator.clipboard.writeText(generatedPayload)}
                  className="text-xs font-bold text-[#F4B41A] border border-amber-200 px-3 py-1 rounded-lg hover:bg-amber-50"
                >
                  <FileText size={12} className="inline mr-1" />Exportar
                </button>
              )}
            </div>
            <div className="bg-[#0A192F] rounded-2xl p-5 font-mono text-xs text-emerald-400 min-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {generating ? (
                <div className="flex items-center gap-2 text-amber-400">
                  <Loader2 size={14} className="animate-spin" /> Generando prueba criptográfica...
                </div>
              ) : generatedPayload ? (
                generatedPayload
              ) : (
                <span className="text-gray-600">// Presiona "Generar Prueba" para crear el payload de Selective Disclosure...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="glass p-8 max-w-3xl">
          <h2 className="font-bold text-[#0A192F] mb-6 flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#F4B41A]" />
            Registro de Auditoría Trazable
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#F4B41A]" size={32} /></div>
          ) : (
            <AuditTimeline entries={auditLog} />
          )}
        </div>
      )}
    </div>
  );
}
