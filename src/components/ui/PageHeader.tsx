import React from 'react';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 rounded-2xl bg-brand-yellow/10 text-brand-yellow shadow-inner">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-binance-text">{title}</h1>
          {description && <p className="text-sm text-binance-muted font-bold tracking-tight">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
