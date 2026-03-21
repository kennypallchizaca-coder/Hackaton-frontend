import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'accent' | 'cyber';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    success: 'bg-binance-green/10 text-binance-green border-transparent',
    warning: 'bg-brand-yellow/10 text-brand-yellow border-transparent',
    error: 'bg-binance-red/10 text-binance-red border-transparent',
    neutral: 'bg-binance-gray text-binance-muted border-transparent',
    accent: "bg-brand-yellow/20 text-brand-yellow border-transparent",
    cyber: 'bg-binance-black text-white border-binance-border'
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
