import { useState } from 'react';
import { Cpu, Loader2, CheckCircle2, Terminal } from '../components/Icons';
import { mockTransactions } from '../data/mockTransactions';
import { cn } from '../utils/cn';

const AGENT_STEPS = [
  { prefix: '[SYSTEM]', msg: 'Initializing GenLayer Virtual Arbitrator v2.1...' },
  { prefix: '[FETCH]', msg: 'Consensus Node retrieving transaction data...' },
  { prefix: '[AGENT: RISK]', msg: 'Analyzing velocity pattern for target node...' },
  { prefix: '[AGENT: RISK]', msg: "Found high correlation with peer 'Web Store' node." },
  { prefix: '[AGENT: KYT]', msg: 'Pulling ZK-Proof from Merchant Vault...' },
  { prefix: '[AGENT: KYT]', msg: 'CALIBRATION: Proof verified. 98% delivery confidence.' },
  { prefix: '[AGENT: RISK]', msg: 'Scanning global dark-market activity logs...' },
  { prefix: '[AGENT: RISK]', msg: 'CLEAN: No malicious peer engagement detected.' },
  { prefix: '[GOVERNANCE]', msg: 'Multi-Agent Consensus Threshold Reached (100%).' },
  { prefix: '[EXECUTOR]', msg: 'Triggering releaseFunds(0.0018_BTC).' },
  { prefix: '[SYSTEM]', msg: 'Smart Contract execution successful. Dispute cleared.' },
];

const PREFIX_COLORS: Record<string, string> = {
  '[SYSTEM]': 'text-[#6B8CAE]',
  '[FETCH]': 'text-[#FCD535]',
  '[AGENT: RISK]': 'text-[#F6465D]',
  '[AGENT: KYT]': 'text-[#0ECB81]',
  '[GOVERNANCE]': 'text-[#9B59B6]',
  '[EXECUTOR]': 'text-[#3498DB]',
};

const NETWORK_NODES = [
  { id: 'N-001', type: 'Validator', latency: '12ms', stake: '100 BTC', status: 'active' },
  { id: 'N-002', type: 'Consensus', latency: '8ms', stake: '250 BTC', status: 'active' },
  { id: 'N-003', type: 'Risk Agent', latency: '23ms', stake: '75 BTC', status: 'active' },
  { id: 'N-004', type: 'KYT Oracle', latency: '15ms', stake: '120 BTC', status: 'active' },
  { id: 'N-005', type: 'Arbitrator', latency: '9ms', stake: '500 BTC', status: 'standby' },
];

export function GenLayer() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'resolving' | 'resolved'>('idle');
  const disputedTx = mockTransactions.find(t => t.compliance?.disputed);

  const startResolution = () => {
    setIsResolving(true);
    setStatus('resolving');
    setLogs([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < AGENT_STEPS.length) {
        const step = AGENT_STEPS[i];
        setLogs(prev => [...prev, `${step.prefix} ${step.msg}`]);
        i++;
      } else {
        clearInterval(interval);
        setIsResolving(false);
        setStatus('resolved');
      }
    }, 600);
  };

  return (
    <div className="min-h-full bg-[#060E1E] text-[#EAECEF]">
      {/* Page Header */}
      <div className="border-b border-[#1a2d4a] px-5 py-3 flex items-center gap-2">
        <Cpu size={14} className="text-[#FCD535]" />
        <h1 className="text-[14px] font-bold text-[#EAECEF]">GenLayer AI Consensus</h1>
        <span className="text-[11px] text-[#6B8CAE]">— Multi-agent dispute resolution & smart contract execution</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" />
          <span className="text-[10px] text-[#0ECB81] font-medium">Network Online</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-3 gap-4">
        {/* Left: Network Status */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active Nodes', value: '4', color: '#0ECB81' },
              { label: 'Consensus %', value: '100%', color: '#FCD535' },
              { label: 'Avg Latency', value: '13ms', color: '#EAECEF' },
              { label: 'Total Stake', value: '1,045 BTC', color: '#EAECEF' },
            ].map(s => (
              <div key={s.label} className="bg-[#0D1F3C] border border-[#1a2d4a] rounded p-3">
                <div className="text-[10px] text-[#6B8CAE] mb-0.5">{s.label}</div>
                <div className="text-[14px] font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Network Nodes Table */}
          <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden flex-1">
            <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
              <span className="text-[12px] font-bold text-[#EAECEF]">Network Nodes</span>
            </div>
            <div className="divide-y divide-[#1a2d4a]">
              {NETWORK_NODES.map(node => (
                <div key={node.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/3 transition-colors">
                  <div className={cn("w-2 h-2 rounded-full shrink-0", node.status === 'active' ? 'bg-[#0ECB81]' : 'bg-[#6B8CAE]')} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-[#EAECEF]">{node.id} · {node.type}</div>
                    <div className="text-[10px] text-[#6B8CAE]">{node.latency} · {node.stake} staked</div>
                  </div>
                  <span className={cn("text-[9px] uppercase font-black px-1.5 py-0.5 rounded",
                    node.status === 'active' ? 'text-[#0ECB81] bg-[#0ECB81]/10' : 'text-[#6B8CAE] bg-[#6B8CAE]/10'
                  )}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center + Right: Dispute Panel + Terminal */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Disputed Transaction */}
          {disputedTx ? (
            <div className="bg-[#0D1F3C] border border-[#F6465D]/30 rounded overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F6465D] animate-pulse" />
                <span className="text-[12px] font-bold text-[#F6465D]">Active Dispute</span>
                <span className="text-[11px] text-[#6B8CAE]">— Awaiting multi-agent consensus</span>
              </div>
              <div className="p-4 grid grid-cols-4 gap-4">
                {[
                  { label: 'Transaction ID', value: `#${disputedTx.id}`, mono: true },
                  { label: 'Amount', value: `${disputedTx.amountBTC} BTC`, color: '#FCD535' },
                  { label: 'Merchant', value: disputedTx.store },
                  { label: 'Status', value: 'DISPUTED', color: '#F6465D' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="text-[10px] text-[#6B8CAE] mb-1">{item.label}</div>
                    <div className={cn("text-[13px] font-bold", item.mono ? 'font-mono text-[#6B8CAE]' : 'text-[#EAECEF]')}
                      style={item.color ? { color: item.color } : {}}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3 flex items-center gap-3">
                <button
                  onClick={startResolution}
                  disabled={isResolving || status === 'resolved'}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded text-[12px] font-bold transition-colors",
                    status === 'resolved'
                      ? 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/30 cursor-default'
                      : 'bg-[#FCD535] text-[#060E1E] hover:bg-[#f0c90a] disabled:opacity-50'
                  )}
                >
                  {isResolving ? <Loader2 size={14} className="animate-spin" /> :
                   status === 'resolved' ? <CheckCircle2 size={14} /> :
                   <Cpu size={14} />}
                  {isResolving ? 'Resolving...' : status === 'resolved' ? 'Resolved' : 'Start AI Resolution'}
                </button>
                {status === 'resolved' && (
                  <span className="text-[11px] text-[#0ECB81]">Funds released successfully</span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded p-4 text-center text-[#6B8CAE] text-[12px]">
              No active disputes
            </div>
          )}

          {/* Terminal Output */}
          <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden flex-1">
            <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
              <Terminal size={13} className="text-[#FCD535]" />
              <span className="text-[12px] font-bold text-[#EAECEF]">Agent Output</span>
              <span className="font-mono text-[10px] text-[#6B8CAE] ml-auto">v2.1.0 / GenLayer Runtime</span>
            </div>
            <div className="p-4 font-mono text-[11px] space-y-1 min-h-[200px] max-h-[340px] overflow-y-auto no-scrollbar bg-[#060E1E]">
              {logs.length === 0 ? (
                <div className="text-[#3D4D5C] flex items-center gap-2">
                  <span className="text-[#FCD535]">$</span>
                  <span className="animate-pulse">_</span>
                  <span>Awaiting resolution trigger...</span>
                </div>
              ) : (
                logs.map((log, i) => {
                  const prefix = Object.keys(PREFIX_COLORS).find(k => log.startsWith(k)) ?? '';
                  const rest = log.slice(prefix.length);
                  return (
                    <div key={i} className="leading-relaxed">
                      <span className={PREFIX_COLORS[prefix] ?? 'text-[#EAECEF]'}>{prefix}</span>
                      <span className="text-[#EAECEF]">{rest}</span>
                    </div>
                  );
                })
              )}
              {isResolving && (
                <div className="text-[#FCD535] flex items-center gap-1">
                  <span>$</span>
                  <span className="animate-pulse">█</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
