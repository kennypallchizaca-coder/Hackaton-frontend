import { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Send, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { InsightCard } from '../components/ui/InsightCard';
import { aiService, dashboardService } from '../services/dashboardService';
import { type AIInsight, type DailySummary } from '../types';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Hola 👋 Soy tu asistente de inteligencia de negocios. Puedo analizar tus transacciones, detectar anomalías y darte recomendaciones. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      aiService.getInsights(),
      dashboardService.getDailySummary()
    ]).then(([ins, sum]) => {
      setInsights(ins);
      setSummary(sum);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = async () => {
    const msg = inputValue.trim();
    if (!msg || isTyping) return;
    setInputValue('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsTyping(true);
    try {
      const response = await aiService.askQuestion(msg);
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestionQuestions = [
    '¿Cuál fue mi mejor día de ventas?',
    'Explícame las alertas de hoy',
    '¿Mis ingresos van bien?',
  ];

  const summaryStats = [
    { label: 'Transacciones hoy', value: summary?.totalTransactions ?? '--', icon: <TrendingUp size={16} /> },
    { label: 'Tasa de éxito', value: summary ? `${summary.successRate.toFixed(0)}%` : '--', icon: <Sparkles size={16} /> },
    { label: 'Ticket promedio', value: summary ? `$${summary.avgTicketUSD.toFixed(0)}` : '--', icon: <Lightbulb size={16} /> },
    { label: 'Alertas activas', value: insights.filter(i => i.type === 'anomaly').length, icon: <AlertTriangle size={16} /> },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-[#0A192F] flex items-center gap-3">
          <Sparkles className="text-[#F4B41A]" size={28} />
          IA &amp; Análisis
        </h1>
        <p className="text-gray-500 mt-1">Resumen inteligente de tu negocio impulsado por IA.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map(stat => (
          <div key={stat.label} className="glass p-5">
            <div className="flex items-center gap-2 text-[#F4B41A] mb-2">{stat.icon}</div>
            <p className="text-2xl font-black text-[#0A192F]">{stat.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Insights Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
            <Bot size={20} className="text-[#F4B41A]" />
            Análisis del día
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#F4B41A]" size={32} />
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          )}
        </div>

        {/* AI Chat */}
        <div className="glass p-6 flex flex-col h-[550px]">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-[#F4B41A] flex items-center justify-center">
              <Bot size={18} className="text-[#0A192F]" />
            </div>
            <div>
              <p className="font-bold text-[#0A192F] text-sm">Asistente KuriPay IA</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-gray-400">En línea</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-[#F4B41A] flex items-center justify-center mr-2 shrink-0 self-end">
                    <Bot size={14} className="text-[#0A192F]" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0A192F] text-white rounded-tr-sm'
                    : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F4B41A] flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-[#0A192F]" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-50 border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {chatMessages.length <= 2 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestionQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => { setInputValue(q); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium hover:bg-amber-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Pregunta algo sobre tus ventas..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 bg-[#F4B41A] rounded-xl flex items-center justify-center hover:bg-[#FFC13B] disabled:opacity-40 transition-colors"
            >
              <Send size={16} className="text-[#0A192F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
