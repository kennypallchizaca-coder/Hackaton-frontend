import { type RiskLevel } from '../../types';

interface RiskBadgeProps {
  risk: RiskLevel;
  showLabel?: boolean;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  Low:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Riesgo Bajo' },
  Medium: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Riesgo Medio' },
  High:   { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Riesgo Alto' },
};

export function RiskBadge({ risk, showLabel = false }: RiskBadgeProps) {
  const cfg = riskConfig[risk];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {showLabel ? cfg.label : risk}
    </span>
  );
}
