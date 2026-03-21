import { useState, useEffect } from 'react';
import { ShieldAlert, EyeOff, FileText, CheckCircle2, Loader2, Sparkles, History, Fingerprint, AlertTriangle } from '../components/Icons';
import { type Transaction, type AuditEntry, type KYTAlert } from '../types';
import { complianceService } from '../services/complianceService';
import { RiskBadge } from '../components/ui/RiskBadge';
import { cn } from '../utils/cn';

type ComplianceTab = 'kyt' | 'poi' | 'audit';

const TABS: { id: ComplianceTab; label: string }[] = [
  { id: 'kyt', label: 'Safety · KYT' },
  { id: 'poi', label: 'Proof of Innocence' },
  { id: 'audit', label: 'Audit Trail' },
];

const RISK_COLOR: Record<string, string> = {
  High: 'text-[#F6465D] bg-[#F6465D]/10',
  Medium: 'text-[#FCD535] bg-[#FCD535]/10',
  Low: 'text-[#0ECB81] bg-[#0ECB81]/10',
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
    setGenerating(true);
    setGeneratedPayload(null);
    const payload = await complianceService.generateSelectiveDisclosure(selectedTxId);
    setGeneratedPayload(JSON.stringify(payload, null, 2));
    setGenerating(false);
  };

  return (
    <div className="min-h-full bg-[#060E1E] text-[#EAECEF]">
      {/* Page Header - Binance style */}
      <div className="border-b border-[#1a2d4a] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-[#FCD535]" />
          <h1 className="text-[14px] font-bold text-[#EAECEF]">Enterprise Compliance</h1>
          <span className="text-[11px] text-[#6B8CAE]">— Automated KYT, Selective Disclosure & Proof of Innocence</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6B8CAE]">Last sync:</span>
          <span className="text-[10px] text-[#0ECB81] font-medium">Live</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" />
        </div>
      </div>

      {/* Tab Bar - Binance style */}
      <div className="flex items-center gap-0 border-b border-[#1a2d4a] bg-[#060E1E] px-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-3 text-[12px] font-medium transition-colors border-b-2 -mb-px uppercase tracking-wider",
              activeTab === tab.id
                ? "text-[#EAECEF] border-[#FCD535]"
                : "text-[#6B8CAE] border-transparent hover:text-[#EAECEF]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={24} className="animate-spin text-[#FCD535]" />
            <span className="text-[12px] text-[#6B8CAE]">Synchronizing ledger states...</span>
          </div>
        ) : (
          <>
            {/* KYT Tab */}
            {activeTab === 'kyt' && (
              <div className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total Alerts', value: alerts.length, color: '#FCD535' },
                    { label: 'High Risk', value: alerts.filter(a => a.riskLevel === 'High').length, color: '#F6465D' },
                    { label: 'Medium Risk', value: alerts.filter(a => a.riskLevel === 'Medium').length, color: '#FCD535' },
                    { label: 'Resolved', value: alerts.filter(a => a.resolved).length, color: '#0ECB81' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#0D1F3C] border border-[#1a2d4a] rounded p-3">
                      <div className="text-[11px] text-[#6B8CAE] mb-1">{s.label}</div>
                      <div className="text-[20px] font-black" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Flagged Transactions */}
                  <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
                      <AlertTriangle size={13} className="text-[#F6465D]" />
                      <span className="text-[12px] font-bold text-[#EAECEF]">Flagged Activities</span>
                    </div>
                    <div className="divide-y divide-[#1a2d4a]">
                      {atRiskTxs.length === 0 ? (
                        <div className="py-8 text-center text-[#6B8CAE] text-[12px]">No flagged activities</div>
                      ) : atRiskTxs.map(tx => (
                        <div key={tx.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[11px] text-[#6B8CAE]">#{tx.id}</span>
                            <RiskBadge risk={(tx.compliance?.kytRisk ?? 'Low') as 'Low' | 'Medium' | 'High'} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#EAECEF]">{tx.amountBTC} BTC</span>
                            <span className="text-[11px] text-[#6B8CAE]">{tx.store}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alert Feed */}
                  <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
                      <ShieldAlert size={13} className="text-[#FCD535]" />
                      <span className="text-[12px] font-bold text-[#EAECEF]">Detection Logs</span>
                    </div>
                    <div className="divide-y divide-[#1a2d4a]">
                      {alerts.length === 0 ? (
                        <div className="py-8 text-center text-[#6B8CAE] text-[12px]">No alerts</div>
                      ) : alerts.map(alert => (
                        <div key={alert.id} className={cn("px-4 py-3 hover:bg-white/3 transition-colors", alert.resolved ? 'opacity-50' : '')}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[11px] text-[#6B8CAE]">#{alert.txId}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={cn("text-[9px] font-black uppercase px-1.5 py-0.5 rounded", RISK_COLOR[alert.riskLevel])}>
                                {alert.riskLevel}
                              </span>
                              {alert.resolved && <CheckCircle2 size={11} className="text-[#0ECB81]" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#EAECEF]">{alert.reason}</p>
                          <p className="text-[10px] text-[#6B8CAE] mt-0.5 font-mono">{alert.walletAddress}</p>
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
                <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
                    <Fingerprint size={13} className="text-[#FCD535]" />
                    <span className="text-[12px] font-bold text-[#EAECEF]">ZK-Proof Generator</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-[11px] text-[#6B8CAE] block mb-1.5">Target Transaction ID</label>
                      <select
                        value={selectedTxId}
                        onChange={e => setSelectedTxId(e.target.value)}
                        className="w-full bg-[#060E1E] border border-[#1a2d4a] rounded px-3 py-2 text-[13px] text-[#EAECEF] outline-none focus:border-[#FCD535] transition-colors"
                      >
                        {atRiskTxs.map(tx => (
                          <option key={tx.id} value={tx.id}>#{tx.id} — {tx.amountBTC} BTC</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      {[
                        { label: 'Status', value: 'KYC Verified', ok: true },
                        { label: 'AML Score', value: '98/100', ok: true },
                        { label: 'Hidden Fields', value: 'Name, DOB', ok: false },
                        { label: 'Signature', value: 'RSA-4096', ok: true },
                      ].map(item => (
                        <div key={item.label} className="bg-[#060E1E] rounded p-2.5 border border-[#1a2d4a]">
                          <div className="text-[#6B8CAE] mb-0.5">{item.label}</div>
                          <div className={item.ok ? 'text-[#0ECB81] font-bold' : 'text-[#FCD535] font-bold'}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleGeneratePoI}
                      disabled={generating}
                      className="w-full py-2.5 bg-[#FCD535] text-[#060E1E] text-[12px] font-black rounded hover:bg-[#f0c90a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {generating ? 'Generating Proof...' : 'Generate ZK-Proof'}
                    </button>
                  </div>
                </div>

                {/* Output */}
                <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
                    <FileText size={13} className="text-[#6B8CAE]" />
                    <span className="text-[12px] font-bold text-[#EAECEF]">Disclosure Payload</span>
                  </div>
                  <div className="p-4 h-[360px] overflow-auto no-scrollbar">
                    {generatedPayload ? (
                      <pre className="text-[10px] text-[#0ECB81] font-mono leading-relaxed whitespace-pre-wrap">{generatedPayload}</pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center gap-2 text-[#6B8CAE]">
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
              <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
                  <History size={13} className="text-[#6B8CAE]" />
                  <span className="text-[12px] font-bold text-[#EAECEF]">Immutable Audit Log</span>
                  <span className="ml-auto text-[10px] text-[#6B8CAE]">{auditLog.length} entries</span>
                </div>
                {/* Table Header */}
                <div className="grid grid-cols-5 px-4 py-2 text-[10px] text-[#6B8CAE] font-medium uppercase tracking-wider border-b border-[#1a2d4a]">
                  <span>Timestamp</span>
                  <span>Actor</span>
                  <span>Action</span>
                  <span>Result</span>
                  <span>Metadata</span>
                </div>
                <div className="divide-y divide-[#1a2d4a]">
                  {auditLog.length === 0 ? (
                    <div className="py-12 text-center text-[#6B8CAE] text-[12px]">No audit entries</div>
                  ) : auditLog.map(entry => (
                    <div key={entry.id} className="grid grid-cols-5 px-4 py-2.5 text-[12px] hover:bg-white/3 transition-colors">
                      <span className="text-[#6B8CAE] font-mono text-[10px]">{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="text-[#EAECEF] font-medium">{entry.actor}</span>
                      <span className="text-[#6B8CAE]">{entry.action}</span>
                      <span className={cn("font-bold",
                        entry.result === 'success' ? 'text-[#0ECB81]' :
                        entry.result === 'warning' ? 'text-[#FCD535]' : 'text-[#F6465D]'
                      )}>
                        {entry.result.toUpperCase()}
                      </span>
                      <span className="text-[#6B8CAE] text-[10px] font-mono truncate">
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
