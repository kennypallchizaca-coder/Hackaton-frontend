import { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, TrendingUp, AlertTriangle, Lightbulb, Loader2, Send } from '../components/Icons';
import { aiService, dashboardService } from '../services/dashboardService';
import { type AIInsight, type DailySummary } from '../types';
import { cn } from '../utils/cn';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  summary: <TrendingUp size={13} className="text-[#0ECB81]" />,
  anomaly: <AlertTriangle size={13} className="text-[#F6465D]" />,
  recommendation: <Lightbulb size={13} className="text-[#FCD535]" />,
};

const INSIGHT_COLORS: Record<string, string> = {
  positive: 'border-l-[#0ECB81]',
  negative: 'border-l-[#F6465D]',
  neutral: 'border-l-[#FCD535]',
};

const SUGGESTIONS = ['Analyze my sales peaks', 'Detect anomalies', 'Revenue forecast', 'Best performing store'];

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Merchant intelligence ready. Ask me anything about your sales data.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([aiService.getInsights(), dashboardService.getDailySummary()])
      .then(([ins, sum]) => {
        setInsights(ins);
        setSummary(sum);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = async (msg?: string) => {
    const text = (msg ?? inputValue).trim();
    if (!text || isTyping) return;
    setInputValue('');
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);
    try {
      const response = await aiService.askQuestion(text);
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-full bg-[#060E1E] text-[#EAECEF]">
      {/* Page Header */}
      <div className="border-b border-[#1a2d4a] px-5 py-3 flex items-center gap-2">
        <Sparkles size={14} className="text-[#FCD535]" />
        <h1 className="text-[14px] font-bold text-[#EAECEF]">AI Merchant Intelligence</h1>
        <span className="text-[11px] text-[#6B8CAE]">— Powered by GenLayer multi-agent network</span>
      </div>

      <div className="p-5 grid grid-cols-3 gap-4" style={{ minHeight: 'calc(100vh - 144px)' }}>
        {/* Left Column - Insights + Stats */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Daily Summary Stats */}
          {summary && (
            <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1a2d4a]">
                <span className="text-[12px] font-bold text-[#EAECEF]">Today's Overview</span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-[#1a2d4a]">
                {[
                  { label: 'Total Volume', value: `$${summary.totalVolume?.toFixed(2) ?? '0.00'}` },
                  { label: 'Transactions', value: summary.transactionCount ?? 0 },
                  { label: 'Success Rate', value: `${summary.successRate ?? 99.8}%` },
                  { label: 'Top Branch', value: summary.topBranch },
                ].map(s => (
                  <div key={s.label} className="p-3">
                    <div className="text-[10px] text-[#6B8CAE] mb-0.5">{s.label}</div>
                    <div className="text-[13px] font-black text-[#EAECEF]">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insight Feed */}
          <div className="bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden flex-1">
            <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
              <Bot size={13} className="text-[#FCD535]" />
              <span className="text-[12px] font-bold text-[#EAECEF]">AI Insights</span>
            </div>
            {isLoading ? (
              <div className="py-8 flex items-center justify-center">
                <Loader2 size={18} className="animate-spin text-[#FCD535]" />
              </div>
            ) : (
              <div className="divide-y divide-[#1a2d4a]">
                {insights.map(insight => (
                  <div
                    key={insight.id}
                    className={cn(
                      "px-4 py-3 border-l-2 hover:bg-white/3 transition-colors",
                      INSIGHT_COLORS[insight.impact ?? 'neutral']
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {INSIGHT_ICONS[insight.type]}
                      <span className="text-[11px] font-bold text-[#EAECEF]">{insight.title}</span>
                    </div>
                    <p className="text-[11px] text-[#6B8CAE] leading-relaxed">{insight.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Chat Interface */}
        <div className="col-span-2 bg-[#0D1F3C] border border-[#1a2d4a] rounded overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-[#1a2d4a] flex items-center gap-2">
            <Bot size={13} className="text-[#FCD535]" />
            <span className="text-[12px] font-bold text-[#EAECEF]">AI Assistant</span>
            <span className="ml-auto text-[10px] text-[#0ECB81] flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" />
              Online
            </span>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#FCD535]/15 border border-[#FCD535]/30 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-[#FCD535]" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[75%] px-3 py-2 rounded text-[12px] leading-relaxed",
                  msg.role === 'user'
                    ? "bg-[#FCD535]/10 border border-[#FCD535]/20 text-[#EAECEF]"
                    : "bg-[#060E1E] border border-[#1a2d4a] text-[#EAECEF]"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FCD535]/15 border border-[#FCD535]/30 flex items-center justify-center shrink-0">
                  <Bot size={12} className="text-[#FCD535]" />
                </div>
                <div className="bg-[#060E1E] border border-[#1a2d4a] px-3 py-2 rounded flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#6B8CAE] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 border-t border-[#1a2d4a] flex gap-2 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 px-3 py-1 border border-[#1a2d4a] rounded text-[10px] text-[#6B8CAE] hover:text-[#FCD535] hover:border-[#FCD535]/30 transition-colors whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#1a2d4a] flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your merchant data..."
              className="flex-1 bg-[#060E1E] border border-[#1a2d4a] rounded px-3 py-2 text-[12px] text-[#EAECEF] placeholder-[#3D4D5C] outline-none focus:border-[#FCD535] transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-[#FCD535] text-[#060E1E] rounded font-bold text-[11px] hover:bg-[#f0c90a] transition-colors disabled:opacity-40"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
