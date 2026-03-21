import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';

const chartData = [
  { time: '00:00', price: 20100 }, { time: '02:00', price: 20250 }, { time: '04:00', price: 20180 },
  { time: '06:00', price: 20362 }, { time: '08:00', price: 20300 }, { time: '10:00', price: 20200 },
  { time: '12:00', price: 20150 }, { time: '14:00', price: 19900 }, { time: '16:00', price: 19750 },
  { time: '18:00', price: 19600 }, { time: '20:00', price: 19800 }, { time: '22:00', price: 19965 }
];

const TIME_PERIODS = ['1s', '15m', '1H', '4H', '1D', '1W'];
const CHART_VIEWS = ['Original', 'TradingView', 'Depth'];

export function TradingChart() {
  const [activePeriod, setActivePeriod] = useState('1D');
  const [activeView, setActiveView] = useState('TradingView');

  return (
    <div className="flex flex-col h-full bg-[#060E1E]">
      {/* Chart Toolbar - matches Figma exactly */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a2d4a] h-10 flex-shrink-0">
        {/* Left: Time intervals */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-[#6B8CAE] font-medium mr-2">Time</span>
          <div className="flex items-center gap-0.5">
            {TIME_PERIODS.map(t => (
              <button
                key={t}
                onClick={() => setActivePeriod(t)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                  activePeriod === t
                    ? 'text-[#FCD535] bg-[#FCD535]/10'
                    : 'text-[#6B8CAE] hover:text-[#EAECEF]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="w-px h-3 bg-[#1a2d4a] mx-2" />
          {/* Indicator icons */}
          <button className="w-5 h-5 flex items-center justify-center text-[#6B8CAE] hover:text-[#EAECEF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </button>
          <button className="w-5 h-5 flex items-center justify-center text-[#6B8CAE] hover:text-[#EAECEF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>
        </div>

        {/* Right: Chart view selector */}
        <div className="flex items-center gap-1">
          {CHART_VIEWS.map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                activeView === v
                  ? 'text-[#EAECEF] bg-[#1a2d4a]'
                  : 'text-[#6B8CAE] hover:text-[#EAECEF]'
              }`}
            >
              {v}
            </button>
          ))}
          <div className="w-px h-3 bg-[#1a2d4a] mx-1" />
          <button className="w-5 h-5 flex items-center justify-center text-[#6B8CAE] hover:text-[#EAECEF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
          <button className="w-5 h-5 flex items-center justify-center text-[#6B8CAE] hover:text-[#EAECEF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </div>

      {/* OHLC Info Bar */}
      <div className="flex items-center gap-6 px-5 py-1.5 text-[11px] border-b border-[#1a2d4a] bg-[#060E1E] flex-shrink-0">
        <span className="text-[#6B8CAE]">2023/03/10</span>
        <span className="text-[#6B8CAE]">Open: <span className="text-[#EAECEF] font-bold">20,362.21</span></span>
        <span className="text-[#6B8CAE]">High: <span className="text-[#0ECB81] font-bold">20,367.78</span></span>
        <span className="text-[#6B8CAE]">Low: <span className="text-[#F6465D] font-bold">19,549.09</span></span>
        <span className="text-[#6B8CAE]">Close: <span className="text-[#EAECEF] font-bold">19,965.74</span></span>
        <span className="text-[#F6465D] font-bold">-1.94%</span>
        <span className="text-[#6B8CAE]">MA(7): <span className="text-[#90CAF9]">21,631.17</span></span>
        <span className="text-[#6B8CAE]">MA(25): <span className="text-[#F48FB1]">23,133.19</span></span>
        <span className="text-[#6B8CAE]">MA(99): <span className="text-[#CE93D8]">20,290.29</span></span>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FCD535" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#FCD535" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 4" stroke="#0D1F3C" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B8CAE', fontSize: 10 }}
              minTickGap={40}
            />
            <YAxis
              domain={['dataMin - 200', 'dataMax + 200']}
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B8CAE', fontSize: 10 }}
              width={55}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1F3C', border: '1px solid #1a2d4a', borderRadius: '4px', fontSize: '11px' }}
              itemStyle={{ color: '#FCD535' }}
              labelStyle={{ color: '#6B8CAE' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#FCD535"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#priceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Current price tag (right side of chart) */}
        <div className="absolute right-[56px] top-[45%] bg-[#FCD535] text-[#060E1E] text-[10px] font-black px-1.5 py-0.5 rounded-sm shadow-lg pointer-events-none z-10 whitespace-nowrap">
          19,965.74
        </div>
      </div>

      {/* Volume Bar */}
      <div className="flex items-center gap-4 px-5 py-1.5 text-[11px] border-t border-[#1a2d4a] flex-shrink-0">
        <span className="text-[#6B8CAE]">Vol(BTC): <span className="text-[#EAECEF] font-bold">503.753K</span></span>
        <span className="text-[#6B8CAE]">Vol(USDT): <span className="text-[#EAECEF] font-bold">10.05B</span></span>
      </div>
    </div>
  );
}
