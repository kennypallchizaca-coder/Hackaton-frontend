import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("binance-card p-5 group hover:border-brand-yellow/30 transition-all cursor-default", className)}>
      {icon && (
        <div className="flex items-center gap-2 text-brand-yellow mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      )}
      <p className="text-2xl font-black text-binance-text leading-tight">{value}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[10px] font-black text-binance-muted uppercase tracking-[0.2em]">{label}</p>
        {trend && (
          <span className={cn(
            "text-[10px] font-black uppercase tracking-wider",
            trend.isPositive ? "text-binance-green" : "text-binance-red"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
