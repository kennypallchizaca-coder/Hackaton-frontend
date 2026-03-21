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
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all outline-none placeholder:text-muted/30 text-slate-50 disabled:opacity-50",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-wider">{error}</p>}
    </div>
  );
}
