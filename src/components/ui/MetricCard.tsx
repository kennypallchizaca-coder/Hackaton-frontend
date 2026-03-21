import { type ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | ReactNode;
  subTitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: ReactNode;
  color?: string; // e.g #627EEA for ETH
}

export function MetricCard({ title, value, subTitle, trend, icon, color = "#627EEA" }: MetricCardProps) {
  const isPositive = trend?.isPositive !== false;
  const trendColor = isPositive ? '#01c0aa' : '#FF3D71';

  return (
    <div className="bg-white border-[#dfe5f9] border-[1px] md:border-[0.7px] rounded-[12px] relative w-full h-[110px] overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,10,18,0.03)] transition-shadow">
      
      {/* Icon Area */}
      <div 
        className="absolute left-[9px] top-[11px] w-[22px] h-[22px] rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      {/* Top Left Texts */}
      <p 
        className="absolute left-[44px] top-[9px] text-[#000a12] text-[15px] leading-none"
        style={{ fontFamily: "'Oxygen', sans-serif", fontWeight: 300 }}
      >
        {title}
      </p>
      
      {subTitle && (
        <p 
          className="absolute left-[44px] top-[26px] text-black/40 text-[11px] leading-none"
          style={{ fontFamily: "'Oxygen', sans-serif", fontWeight: 300 }}
        >
          {subTitle}
        </p>
      )}

      {/* Top Right Texts */}
      <p 
        className="absolute right-[10px] top-[8px] text-[#000a12] text-[15px] leading-none text-right"
        style={{ fontFamily: "'Oxygen', sans-serif", fontWeight: 400 }}
      >
        {value}
      </p>

      {trend && (
        <p 
          className="absolute right-[24px] top-[28px] text-[11px] leading-none text-right"
          style={{ color: trendColor, fontFamily: "'Oxygen', Noto Sans, sans-serif", fontWeight: 300 }}
        >
          {trend.value}
        </p>
      )}

      {/* Up/Down Arrow */}
      {trend && (
        <div className="absolute right-[10px] top-[28px] w-[11px] h-[11px] flex items-center justify-center">
          {isPositive ? (
            <svg viewBox="0 0 11 11" fill="none" className="w-[11px] h-[11px]" style={{ color: trendColor }}>
               <path d="M5.5 8.5V2.5M2.5 5.5L5.5 2.5L8.5 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 11 11" fill="none" className="w-[11px] h-[11px]" style={{ color: trendColor }}>
               <path d="M5.5 2.5V8.5M2.5 5.5L5.5 8.5L8.5 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      )}

      {/* Sparkline Area (Approximate inset: left 12px, right 11px, bottom 19.6px, top 53px) */}
      <div className="absolute left-[12px] right-[11px] bottom-[19.6px] top-[53px] pointer-events-none">
         <svg w-full h-full viewBox="0 0 247 38" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
                <stop offset="100%" stopColor={color} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Filled background curve */}
            <path 
              d={isPositive 
                  ? "M 0 32 C 15 32, 25 15, 38 12 C 55 8, 55 28, 70 28 C 90 28, 105 5, 120 5 C 135 5, 140 18, 155 18 C 170 18, 185 30, 205 32 C 225 34, 235 5, 247 5 L 247 38 L 0 38 Z"
                  : "M 0 5 C 15 5, 25 25, 38 28 C 55 30, 55 12, 70 12 C 90 12, 105 32, 120 32 C 135 32, 140 20, 155 20 C 170 20, 185 8, 205 5 C 225 2, 235 32, 247 35 L 247 38 L 0 38 Z"} 
              fill={`url(#spark-${title})`} 
            />
            {/* Stroke curve */}
            <path 
              d={isPositive 
                  ? "M 0 32 C 15 32, 25 15, 38 12 C 55 8, 55 28, 70 28 C 90 28, 105 5, 120 5 C 135 5, 140 18, 155 18 C 170 18, 185 30, 205 32 C 225 34, 235 5, 247 5"
                  : "M 0 5 C 15 5, 25 25, 38 28 C 55 30, 55 12, 70 12 C 90 12, 105 32, 120 32 C 135 32, 140 20, 155 20 C 170 20, 185 8, 205 5 C 225 2, 235 32, 247 35"} 
              fill="none" 
              stroke={color} 
              strokeWidth="0.8" 
            />
         </svg>
      </div>

    </div>
  );
}
