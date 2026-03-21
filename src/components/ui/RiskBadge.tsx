import { type RiskLevel } from '../../types';
import { cn } from '../../utils/cn';

interface RiskBadgeProps {
  risk: RiskLevel;
  showLabel?: boolean;
}

const riskConfig: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  Low:    { bg: 'bg-binance-green/10', text: 'text-binance-green', dot: 'bg-binance-green', label: 'Verified Safe' },
  Medium: { bg: 'bg-brand-yellow/10',   text: 'text-brand-yellow',   dot: 'bg-brand-yellow',   label: 'Review Required' },
  High:   { bg: 'bg-binance-red/10',     text: 'text-binance-red',     dot: 'bg-binance-red',     label: 'Critical Alert' },
};

export function RiskBadge({ risk, showLabel = false }: RiskBadgeProps) {
  const cfg = riskConfig[risk];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest border border-transparent transition-all", cfg.bg, cfg.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", cfg.dot)} />
      {showLabel ? cfg.label : risk}
    </span>
  );
}
