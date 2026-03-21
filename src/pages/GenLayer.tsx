import { useState } from 'react';
import { Cpu, Gavel, FileCheck, Loader2 } from 'lucide-react';
import { mockTransactions } from '../data/mockTransactions';

export function GenLayer() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState<'idle' | 'resolving' | 'resolved'>('idle');
  const disputedTx = mockTransactions.find(t => t.compliance?.disputed);

  const startDemoResolution = () => {
    setIsResolving(true);
    setResolutionStatus('resolving');
    setLogs([]);
    
    const steps = [
      "[SYSTEM] Initializing GenLayer Smart Contract Arbitrator...",
      "[AGENT A - RISK] Retrieving transaction tx_3a1b9c...",
      "[AGENT A - RISK] Flag detected: Unusual volume for 'Web Store' node.",
      "[AGENT B - KYT] Extracting Zero-Knowledge Proof from Merchant Profile...",
      "[AGENT B - KYT] Proof verified. Merchant has 98% positive delivery record.",
      "[AGENT A - RISK] Correlating with on-chain wallet history...",
      "[AGENT A - RISK] No dark-market interaction found. Activity is clean.",
      "[SYSTEM] Multi-Agent Consensus Reached.",
      "[CONTRACT] Executing function: releaseFunds(merchant_id).",
      "[SYSTEM] Disbursement successful. Disputed status cleared."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsResolving(false);
        setResolutionStatus('resolved');
      }
    }, 1200); // 1.2s per log for dramatic effect
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
         <div>
           <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center gap-3 tracking-tighter">
              <Cpu className="text-accent-gold" size={40} /> 
              GenLayer <span className="text-bg-dark">Dispute Resolution</span>
           </h1>
           <p className="text-gray-500 text-lg">AI-driven Smart Contracts to automatically parse compliance rules and resolve frozen transactions.</p>
         </div>
         {resolutionStatus === 'idle' && (
           <button 
             onClick={startDemoResolution}
             className="btn-web3 flex items-center gap-2"
           >
              <Gavel size={20} /> Initiate AI Arbitration
           </button>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Transaction Focus View */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold tracking-tight">Target: Disputed Output</h2>
           <div className={`glass p-8 ${resolutionStatus === 'resolved' ? 'border-green-200 bg-green-50 shadow-sm' : 'border-red-100 bg-red-50 shadow-sm'} transition-all duration-1000`}>
              <div className="flex justify-between items-center mb-6">
                 <p className="text-lg font-bold text-bg-dark">TX: {disputedTx?.id}</p>
                 <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full border ${resolutionStatus === 'resolved' ? 'bg-[#00C853]/15 text-[#00C853] border-transparent' : 'bg-accent-red/10 text-accent-red border-transparent'}`}>
                    {resolutionStatus === 'resolved' ? 'CLEARED' : 'FROZEN'}
                 </span>
              </div>
              <div className="space-y-4 mb-8">
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Amount Held</span>
                    <span className="text-bg-dark font-bold">{disputedTx?.amountBTC} BTC</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Reason</span>
                    <span className="text-bg-dark font-medium">KYT High Risk Flag</span>
                 </div>
                 <div className="flex justify-between pb-2">
                    <span className="text-gray-500 font-medium">Merchant Node</span>
                    <span className="text-bg-dark font-medium">{disputedTx?.store}</span>
                 </div>
              </div>
              
              {resolutionStatus === 'resolved' && (
                 <div className="flex items-center gap-4 p-4 bg-[#00C853]/10 border border-[#00C853]/20 rounded-xl text-[#00C853] animate-fade-in">
                    <FileCheck size={24} />
                    <p className="font-bold text-sm">Funds Released to Merchant.</p>
                 </div>
              )}
           </div>
        </div>

        {/* Console / Log Terminal */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Agents Consensus Terminal</h2>
              {isResolving && <Loader2 size={20} className="text-accent-gold animate-spin" />}
           </div>
           
           <div className="bg-[#0A192F] rounded-2xl p-6 h-[400px] overflow-y-auto font-mono text-sm relative shadow-soft">
              <div className="absolute top-0 right-0 p-4">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-red/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-status-blue/50"></div>
                 </div>
              </div>
              
              <div className="pt-6 space-y-3">
                 {logs.length === 0 && resolutionStatus === 'idle' && (
                    <p className="text-text-gray/50 italic">Waiting for execution trigger...</p>
                 )}
                 {logs.map((log, i) => (
                    <p 
                      key={i} 
                      className={`animate-fade-in-up ${
                          log.includes('SYSTEM') ? 'text-accent-gold' : 
                          log.includes('RISK') ? 'text-status-red' : 
                          log.includes('KYT') ? 'text-status-blue' : 
                          log.includes('CONTRACT') ? 'text-green-400 font-bold' : 
                          'text-text-smoke'
                      }`}
                    >
                      {log}
                    </p>
                 ))}
                 <div className="h-4"></div> {/* Spacer for scroll */}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
