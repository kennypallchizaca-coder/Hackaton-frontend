import React from 'react';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabSystemProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function TabSystem({ tabs, activeTab, onChange, variant = 'horizontal', className }: TabSystemProps) {
  if (variant === 'vertical') {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id
                ? 'bg-brand-yellow text-binance-black shadow-lg shadow-brand-yellow/5'
                : 'text-binance-muted hover:bg-binance-gray hover:text-binance-text'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-6 border-b border-binance-border", className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
            activeTab === tab.id ? "text-brand-yellow" : "text-binance-muted hover:text-binance-text"
          )}
        >
          {tab.icon}
          {tab.label}
          {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow" />}
        </button>
      ))}
    </div>
  );
}
