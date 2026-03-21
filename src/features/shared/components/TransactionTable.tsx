import { type Transaction } from '../../../types';
import { cn } from '../../../utils/cn';

interface TransactionTableProps {
  transactions: Transaction[];
  hideHeader?: boolean;
}

export function TransactionTable({ transactions, hideHeader }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[12px]">
        {!hideHeader && (
          <thead className="text-slate-400 bg-slate-950/30 uppercase tracking-wider font-bold">
            <tr>
              <th className="px-5 py-3">ID / Date</th>
              <th className="px-5 py-3">Operation</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">KYT</th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-800">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
              <td className="px-5 py-4">
                <div className="text-slate-50 font-mono font-bold">#{tx.id}</div>
                <div className="text-slate-400 text-[10px] mt-0.5">{new Date(tx.date).toLocaleString()}</div>
              </td>
              <td className="px-5 py-4">
                <span className="text-slate-50 font-medium block capitalize">
                  {tx.type.replace(/_/g, ' ')}
                </span>
                <span className="text-slate-400 text-[10px]">
                  {tx.senderRole} → {tx.receiverRole}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="text-slate-50 font-bold">{tx.amountBTC} BTC</div>
                <div className="text-slate-400 text-[10px]">${tx.amountUSD.toFixed(2)} USD</div>
              </td>
              <td className="px-5 py-4">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                  tx.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                  tx.status === 'processing' ? "bg-blue-500/10 text-blue-500" :
                  "bg-red-500/10 text-red-500"
                )}>
                  {tx.status}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                  tx.compliance.riskLevel === 'Low' ? "border-emerald-500/30 text-emerald-500" :
                  tx.compliance.riskLevel === 'Medium' ? "border-blue-500/30 text-blue-500" :
                  "border-red-500/30 text-red-500"
                )}>
                  {tx.compliance.riskLevel} Risk
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
