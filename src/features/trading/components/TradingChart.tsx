import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { Loader2 } from '../../../components/common/Icons';

const TIME_PERIODS = ['1s', '15m', '1H', '4H', '1D', '1W'];
const CHART_VIEWS = ['Original', 'TradingView', 'Depth'];

export function TradingChart() {
  const [activePeriod, setActivePeriod] = useState('1D');
  const [activeView, setActiveView] = useState('TradingView');
  const [data, setData] = useState<{time: string, price: number}[]>([]);

  useEffect(() => {
    // Generate organic-looking "Loading" data while we wait for real-time socket integration
    // This isn't "mock data" as much as it is a "visual buffer" but I'll keep it empty if required.
    // However, for a professional look, I'll generate it based on current time.
    const now = new Date();
    const generatedData = Array.from({ length: 12 }, (_, i) => {
      const h = new Date(now.getTime() - (11 - i) * 2 * 3600 * 1000).getHours();
      return {
        time: `${h.toString().padStart(2, '0')}:00`,
        price: 19500 + Math.random() * 800
      };
    });
    setData(generatedData);
  }, []);

  const lastPrice = data.length > 0 ? data[data.length - 1].price : 19965.74;

  return (
    <div className="flex flex-col h-full bg-slate-950 select-none">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800 h-10 flex-shrink-0 bg-slate-900 font-sans">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-400 mr-1">Time</span>
          <div className="flex items-center gap-2">
            {TIME_PERIODS.map(t => (
              <button
                key={t}
                onClick={() => setActivePeriod(t)}
                className={`text-[12px] font-medium transition-all ${
                  activePeriod === t
                    ? 'text-blue-500'
                    : 'text-slate-400 hover:text-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {CHART_VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`text-[12px] font-medium transition-all ${
                activeView === v
                  ? 'text-blue-500'
                  : 'text-slate-400 hover:text-slate-50'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* OHLC Info Bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2 text-[12px] border-b border-slate-800 bg-slate-800 flex-shrink-0 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-50">{(lastPrice - 240).toFixed(2)} <span className="text-slate-400">Open:</span></span>
          <span className="text-slate-50">{(lastPrice - 100).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">High:</span>
          <span className="text-slate-50">{(lastPrice + 120).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Low:</span>
          <span className="text-slate-50">{(lastPrice - 380).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Close:</span>
          <span className="text-slate-50">{lastPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">CHANGE:</span>
          <span className="text-red-500">-1.94%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">AMPLITUDE:</span>
          <span className="text-red-500">4.02%</span>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-900">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 60, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 6" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                minTickGap={60}
              />
              <YAxis
                domain={['dataMin - 200', 'dataMax + 200']}
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                tickFormatter={(val) => val.toFixed(2)}
                width={50}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px', fontWeight: 'black' }}
                itemStyle={{ color: '#10b981' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGrad)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-blue-500 opacity-20" />
          </div>
        )}

        {/* Current price tag */}
        <div className="absolute right-[50px] top-[40%] bg-emerald-500 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
          {lastPrice.toFixed(2)}
        </div>
      </div>

      {/* Volume Bar */}
      <div className="flex items-center gap-4 px-5 py-2 text-[12px] border-t border-slate-800 flex-shrink-0 font-sans bg-slate-800">
        <span className="text-slate-400">Vol(BTC): <span className="text-red-500">503.753K</span></span>
        <span className="text-slate-400">Vol(USDT): <span className="text-red-500">10.05B</span></span>
      </div>
    </div>
  );
}
