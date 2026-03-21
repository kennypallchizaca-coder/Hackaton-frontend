import type { ReactNode } from 'react';

interface TradingTerminalLayoutProps {
  ticker: ReactNode;
  orderbook: ReactNode;
  chart: ReactNode;
  tradePanel: ReactNode;
  history?: ReactNode;
}

export function TradingTerminalLayout({ 
  ticker, 
  orderbook, 
  chart, 
  tradePanel, 
  history 
}: TradingTerminalLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden text-slate-50 font-sans">
      {/* Top Ticker Bar */}
      <div className="flex-shrink-0 border-b border-slate-800">
        <div className="overflow-x-auto no-scrollbar pb-1">
           {ticker}
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Orderbook / Chart Group on Mobile */}
        <div className="flex-1 flex flex-col xl:flex-row min-w-0 lg:overflow-hidden relative">
          
          {/* Orderbook */}
          <aside className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-950 lg:overflow-hidden border-b lg:border-b-0">
            <div className="flex-1 lg:overflow-hidden">
              {orderbook}
            </div>
          </aside>

          {/* Center Column: Chart & History */}
          <main className="flex-1 flex flex-col min-w-0 border-r border-slate-800 border-b lg:border-b-0 overflow-hidden">
            <div className="h-[400px] lg:flex-1 bg-slate-950 overflow-hidden relative">
              {chart}
            </div>
            <div className="flex-shrink-0 min-h-[280px] border-t border-slate-800 bg-slate-950 lg:overflow-hidden">
              {history || (
                <div className="h-full flex flex-col">
                  {/* Empty state for history when not provided */}
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-[11px] font-bold py-12">
                    No records to display.
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Right Column: Trade Panel */}
        <aside className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 flex flex-col bg-slate-950 border-l border-slate-800">
          {tradePanel}
        </aside>

      </div>
    </div>
  );
}
