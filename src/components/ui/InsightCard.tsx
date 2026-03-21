import { type AIInsight } from '../../types';
import { TrendingUp, AlertTriangle, Lightbulb } from '../Icons';

interface InsightCardProps {
  insight: AIInsight;
}

const typeConfig = {
  summary: {
    border: 'border-blue-100',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: <TrendingUp size={18} />
  },
  anomaly: {
    border: 'border-red-100',
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    icon: <AlertTriangle size={18} />
  },
  recommendation: {
    border: 'border-amber-100',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    icon: <Lightbulb size={18} />
  }
};

const impactDot: Record<string, string> = {
  positive: 'bg-emerald-500',
  negative: 'bg-red-500',
  neutral: 'bg-amber-500'
};

export function InsightCard({ insight }: InsightCardProps) {
  const cfg = typeConfig[insight.type];

  return (
    <div className={`rounded-2xl border p-5 ${cfg.border} ${cfg.bg} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${impactDot[insight.impact || 'neutral']}`} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {insight.type === 'summary' ? 'Resumen' : insight.type === 'anomaly' ? 'Anomalía' : 'Recomendación'}
            </p>
          </div>
          <h3 className="font-bold text-[#0A192F] text-sm mb-1">{insight.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{insight.content}</p>
        </div>
        {insight.icon && (
          <span className="text-2xl shrink-0">{insight.icon}</span>
        )}
      </div>
    </div>
  );
}
