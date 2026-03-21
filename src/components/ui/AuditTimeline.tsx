import { CheckCircle2, AlertTriangle, XCircle } from '../Icons';
import { type AuditEntry } from '../../types';

interface AuditTimelineProps {
  entries: AuditEntry[];
}

const resultConfig = {
  success: {
    icon: <CheckCircle2 size={16} />,
    iconColor: 'text-emerald-600',
    dot: 'bg-emerald-500',
    line: 'border-emerald-200'
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    iconColor: 'text-amber-600',
    dot: 'bg-amber-500',
    line: 'border-amber-200'
  },
  error: {
    icon: <XCircle size={16} />,
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    line: 'border-red-200'
  }
};

export function AuditTimeline({ entries }: AuditTimelineProps) {
  return (
    <div className="relative">
      {entries.map((entry, i) => {
        const cfg = resultConfig[entry.result];
        const isLast = i === entries.length - 1;

        return (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.dot} text-white shrink-0`}>
                {cfg.icon}
              </div>
              {!isLast && (
                <div className={`w-px flex-1 border-l-2 border-dashed my-1 ${cfg.line}`} style={{ minHeight: '24px' }} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${isLast ? '' : ''}`}>
              <p className="text-[11px] font-bold text-text-gray uppercase tracking-widest mb-0.5">
                {new Date(entry.timestamp).toLocaleString('es-EC', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                })} · {entry.actor}
              </p>
              <p className="text-sm font-semibold text-[#0A192F] mb-2">{entry.action}</p>
              {entry.metadata && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(entry.metadata).map(([k, v]) => (
                    <span key={k} className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
