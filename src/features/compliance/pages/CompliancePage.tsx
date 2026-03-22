import { useState, useEffect } from 'react';
import { ShieldAlert, EyeOff, FileText, CheckCircle2, Loader2, Sparkles, History, Fingerprint, AlertTriangle } from '../../../components/common/Icons';
import { type Transaction, type AuditEntry, type KYTAlert } from '../../../types';
import { complianceService } from '../api/complianceService';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { cn } from '../../../utils/cn';
import { SEO } from '../../../components/common/SEO';

type ComplianceTab = 'kyt' | 'poi' | 'audit';

const TABS: { id: ComplianceTab; label: string }[] = [
  { id: 'kyt', label: 'Safety · KYT' },
  { id: 'poi', label: 'Proof of Innocence' },
  { id: 'audit', label: 'Audit Trail' },
];

const RISK_COLOR: Record<string, string> = {
  High: 'text-red-500 bg-red-500/10',
  Medium: 'text-blue-500 bg-blue-500/10',
  Low: 'text-emerald-500 bg-emerald-500/10',
};

export function Compliance() {
  const [atRiskTxs, setAtRiskTxs] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<KYTAlert[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ComplianceTab>('kyt');
  const [generating, setGenerating] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<string | null>(null);
  const [selectedTxId, setSelectedTxId] = useState('tx_3a1b9c');

  useEffect(() => {
    Promise.all([
      complianceService.getAtRiskTransactions(),
      complianceService.getAllAlerts(),
      complianceService.getAuditLog()
    ]).then(([txs, als, audit]) => {
      setAtRiskTxs(txs);
      setAlerts(als);
      setAuditLog(audit);
      setIsLoading(false);
    });
  }, []);

  const handleGeneratePoI = async () => {
    if (!selectedTxId) return;
    setGenerating(true);
    setGeneratedPayload(null);
    const payload = await complianceService.generateSelectiveDisclosure(selectedTxId);
    setGeneratedPayload(JSON.stringify(payload, null, 2));
    setGenerating(false);
  };

  const [prevAtRiskTxs, setPrevAtRiskTxs] = useState<Transaction[]>([]);

  if (atRiskTxs !== prevAtRiskTxs) {
    setPrevAtRiskTxs(atRiskTxs);
    if (atRiskTxs.length > 0 && selectedTxId === 'tx_3a1b9c') {
      setSelectedTxId(atRiskTxs[0].id);
    }
  }

  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      <SEO 
        title="Transaction Ledger" 
        description="Monitor and audit the complete history of transactions and settlements for your KuriPay enterprise account." 
      />
      {/* Page Header - Binance style */}
      <div className="border-b border-slate-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-blue-500" />
          <h1 className="text-[14px] font-bold text-slate-50">Enterprise Compliance</h1>
          <span className="text-[11px] text-slate-400">— Automated KYT, Selective Disclosure & Proof of Innocence</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Last sync:</span>
          <span className="text-[10px] text-emerald-500 font-medium">Live</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Tab Bar - Binance style */}
      <div className="flex items-center gap-0 border-b border-slate-800 bg-slate-950 px-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-3 text-[12px] font-medium transition-colors border-b-2 -mb-px uppercase tracking-wider",
              activeTab === tab.id
                ? "text-slate-50 border-blue-500"
                : "text-slate-400 border-transparent hover:text-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="text-[12px] text-slate-400">Synchronizing ledger states...</span>
          </div>
        ) : (
          <>
            {/* KYT Tab */}
            {activeTab === 'kyt' && (
              <div className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total Alerts', value: alerts.length, color: '#3b82f6' },
                    { label: 'High Risk', value: alerts.filter(a => a.riskLevel === 'High').length, color: '#ef4444' },
                    { label: 'Medium Risk', value: alerts.filter(a => a.riskLevel === 'Medium').length, color: '#3b82f6' },
                    { label: 'Resolved', value: alerts.filter(a => a.resolved).length, color: '#10b981' },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-800 border border-slate-800 rounded p-3">
                      <div className="text-[11px] text-slate-400 mb-1">{s.label}</div>
                      <div className="text-[20px] font-black" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Flagged Transactions */}
                  <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                      <AlertTriangle size={13} className="text-red-500" />
                      <span className="text-[12px] font-bold text-slate-50">Flagged Activities</span>
                    </div>
                    <div className="divide-y divide-slate-800">
                      {atRiskTxs.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-[12px]">No flagged activities</div>
                      ) : atRiskTxs.map(tx => (
                        <div key={tx.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[11px] text-slate-400">#{tx.id}</span>
                            <RiskBadge risk={tx.compliance.riskLevel} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-slate-50">{tx.amountBTC} BTC</span>
                            <span className="text-[11px] text-slate-400 uppercase">{tx.senderRole}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alert Feed */}
                  <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                      <ShieldAlert size={13} className="text-blue-500" />
                      <span className="text-[12px] font-bold text-slate-50">Discovery Logs</span>
                    </div>
                    <div className="divide-y divide-slate-800">
                      {alerts.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-[12px]">No alerts</div>
                      ) : alerts.map(alert => (
                        <div key={alert.id} className={cn("px-4 py-3 hover:bg-white/3 transition-colors", alert.resolved ? 'opacity-50' : '')}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[11px] text-slate-400">#{alert.txId}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded", RISK_COLOR[alert.riskLevel])}>
                                {alert.riskLevel}
                              </span>
                              {alert.resolved && <CheckCircle2 size={11} className="text-emerald-500" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-50">{alert.reason}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{alert.walletAddress}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PoI Tab */}
            {activeTab === 'poi' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Generator */}
                <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                    <Fingerprint size={13} className="text-blue-500" />
                    <span className="text-[12px] font-bold text-slate-50">ZK-Proof Generator</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {atRiskTxs.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-[11px] border border-dashed border-slate-700 rounded bg-slate-900/50">
                        No flagged transactions available for Proof generation.
                      </div>
                    ) : (
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1.5">Target Transaction ID</label>
                        <select
                          value={selectedTxId}
                          onChange={e => setSelectedTxId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-[13px] text-slate-50 outline-none focus:border-blue-500 transition-colors"
                        >
                          {atRiskTxs.map(tx => (
                            <option key={tx.id} value={tx.id}>#{tx.id} — {tx.amountBTC} BTC</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      {[
                        { label: 'Status', value: 'KYC Verified', ok: true },
                        { label: 'AML Score', value: '98/100', ok: true },
                        { label: 'Hidden Fields', value: 'Name, DOB', ok: false },
                        { label: 'Signature', value: 'RSA-4096', ok: true },
                      ].map(item => (
                        <div key={item.label} className="bg-slate-950 rounded p-2.5 border border-slate-800">
                          <div className="text-slate-400 mb-0.5">{item.label}</div>
                          <div className={item.ok ? 'text-emerald-500 font-bold' : 'text-blue-500 font-bold'}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleGeneratePoI}
                      disabled={generating || atRiskTxs.length === 0}
                      className="w-full py-2.5 bg-blue-600 text-slate-950 text-[12px] font-black rounded hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {generating ? 'Generating Proof...' : 'Generate ZK-Proof'}
                    </button>
                  </div>
                </div>

                {/* Output */}
                <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                    <FileText size={13} className="text-slate-400" />
                    <span className="text-[12px] font-bold text-slate-50">Disclosure Payload</span>
                  </div>
                  <div className="p-4 h-[360px] overflow-auto no-scrollbar">
                    {generatedPayload ? (
                      <pre className="text-[10px] text-emerald-500 font-mono leading-relaxed whitespace-pre-wrap">{generatedPayload}</pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                        <EyeOff size={28} className="opacity-30" />
                        <p className="text-[11px]">Generate a proof to reveal the payload</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Audit Trail Tab */}
            {activeTab === 'audit' && (
              <div className="bg-slate-800 border border-slate-800 rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                  <History size={13} className="text-slate-400" />
                  <span className="text-[12px] font-bold text-slate-50">Immutable Audit Log</span>
                  <span className="ml-auto text-[10px] text-slate-400">{auditLog.length} entries</span>
                </div>
                {/* Table Header */}
                <div className="grid grid-cols-5 px-4 py-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider border-b border-slate-800">
                  <span>Timestamp</span>
                  <span>Actor</span>
                  <span>Action</span>
                  <span>Result</span>
                  <span>Metadata</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {auditLog.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-[12px]">No audit entries</div>
                  ) : auditLog.map(entry => (
                    <div key={entry.id} className="grid grid-cols-5 px-4 py-2.5 text-[12px] hover:bg-white/3 transition-colors">
                      <span className="text-slate-400 font-mono text-[10px]">{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="text-slate-50 font-medium">{entry.actor}</span>
                      <span className="text-slate-400">{entry.action}</span>
                      <span className={cn("font-bold",
                        entry.result === 'success' ? 'text-emerald-500' :
                        entry.result === 'warning' ? 'text-blue-500' : 'text-red-500'
                      )}>
                        {entry.result.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono truncate">
                        {JSON.stringify(entry.metadata).slice(0, 40)}...
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
