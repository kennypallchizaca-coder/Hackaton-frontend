import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, containerClassName, className, ...props }: InputProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-binance-muted">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-[#0D1F3C] border border-[#1a2d4a] rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-brand-yellow transition-all outline-none placeholder:text-muted/30 text-binance-text disabled:opacity-50",
          error && "border-binance-red focus:border-binance-red",
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-black text-binance-red uppercase tracking-wider">{error}</p>}
    </div>
  );
}
