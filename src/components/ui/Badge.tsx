import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'accent' | 'cyber';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    success: 'bg-[#00C853]/15 text-[#00C853] border-transparent',
    warning: 'bg-[#FFC107]/15 text-[#FFC107] border-transparent',
    error: 'bg-accent-red/10 text-accent-red border-transparent',
    neutral: 'bg-gray-100 text-gray-500 border-transparent',
    accent: "bg-accent-gold/15 text-accent-gold border-transparent",
    cyber: 'bg-bg-dark text-white border-transparent'
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-bold tracking-wide border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
