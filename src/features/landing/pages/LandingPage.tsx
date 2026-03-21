import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// ── Icon primitives ────────────────────────────────────────────────────────────
function IconTrade() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconBTC() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
    </svg>
  );
}
function IconEth() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  );
}

// ── Intersection Observer hook ─────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Data ───────────────────────────────────────────────────────────────────────
const MARKET_DATA = [
  { name: 'Bitcoin',  ticker: 'BTC', price: '$63,240.00', change: '+1.68%', positive: true,  icon: <IconBTC /> },
  { name: 'Ethereum', ticker: 'ETH', price: '$3,284.81',  change: '+4.36%', positive: true,  icon: <IconEth /> },
  { name: 'Cardano',  ticker: 'ADA', price: '$0.88',      change: '+3.43%', positive: true,  icon: null },
  { name: 'Polkadot', ticker: 'DOT', price: '$9.22',      change: '+7.56%', positive: true,  icon: null },
  { name: 'Wax',      ticker: 'WAXP', price: '$0.097',   change: '-2.62%', positive: false, icon: null },
];

const FEATURES = [
  {
    icon: <IconTrade />,
    label: 'Enterprise Trading',
    title: 'Spot Trading Engine',
    desc: 'Access deep liquidity pools with real-time order books. Set Limit, Market, or Stop-limit orders with institutional precision.',
    badge: 'Live',
    checks: ['Real-time order book', 'Limit / Market / Stop-limit', 'Multi-role dashboard'],
  },
  {
    icon: <IconZap />,
    label: 'Lightning POS',
    title: 'POS Terminal & QR',
    desc: 'Generate Lightning Network BOLT-11 invoices in seconds. Customers scan a QR code — settlement is instant and automatic.',
    badge: 'Live',
    checks: ['BOLT-11 Lightning invoices', 'Auto-polling payment status', 'Multi-currency (SATS/USD/BTC)'],
  },
  {
    icon: <IconShield />,
    label: 'Compliance',
    title: 'KYT & Audit Engine',
    desc: 'Every transaction passes through Know-Your-Transaction scoring. Zero-Knowledge proofs let you prove legitimacy without exposing private data.',
    badge: 'SOC-2',
    checks: ['KYT risk scoring', 'Zero-Knowledge proofs (ZK)', 'Immutable audit trail'],
  },
];


// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ positive }: { positive: boolean }) {
  const color = positive ? '#0dbb7c' : '#ff8282';
  const d = positive
    ? 'M0,28 C15,25 30,18 50,14 C68,9 85,6 100,10 C115,13 130,7 150,4'
    : 'M0,8 C15,10 30,20 50,24 C68,28 85,32 100,30 C115,28 130,34 150,36';
  return (
    <svg width="100" height="40" viewBox="0 0 150 44" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`grad-${positive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} stopOpacity="0.3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L150,44 L0,44 Z`} fill={`url(#grad-${positive ? 'pos' : 'neg'})`} />
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const featRef    = useReveal();
  const marketsRef = useReveal();

  // Parallax tilt for hero background orbs
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const move = (e: MouseEvent) => {
      const { clientX, clientY, currentTarget } = e as MouseEvent & { currentTarget: HTMLDivElement };
      const rect = currentTarget.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width  - 0.5) * 30;
      const y = ((clientY - rect.top)  / rect.height - 0.5) * 30;
      hero.style.setProperty('--ox', `${x}px`);
      hero.style.setProperty('--oy', `${y}px`);
    };
    document.addEventListener('mousemove', move as EventListener);
    return () => document.removeEventListener('mousemove', move as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl bg-[#0b0b0f]/75">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="KuriPay Logo" className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[17px] font-black tracking-tight text-white uppercase italic">KuriPay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Markets', 'Compliance', 'Security'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-[13px] font-bold text-slate-400 hover:text-white transition-colors duration-200 relative group uppercase tracking-widest"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 group-hover:w-full transition-all duration-300 rounded" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:flex h-10 px-6 items-center text-[13px] font-bold text-slate-300 hover:text-white border border-white/10 rounded-xl hover:border-teal-500/50 hover:bg-teal-500/5 transition-all duration-300 uppercase tracking-widest">
              Sign in
            </Link>
            <Link
              to="/login"
              className="h-10 px-6 flex items-center gap-2 text-[13px] font-black rounded-xl text-slate-950 transition-all duration-300 hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-teal-500/20 uppercase tracking-widest"
              style={{ background: 'linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%)' }}
            >
              Get Started
              <IconArrow />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ '--ox': '0px', '--oy': '0px' } as React.CSSProperties}
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full animate-glow-pulse"
            style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)', transform: 'translate(var(--ox), var(--oy))' }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full animate-glow-pulse delay-300"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)', transform: 'translate(calc(var(--ox) * -1), calc(var(--oy) * -1))' }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        {/* Badge */}
        <div className="animate-fade-up opacity-0 mb-8" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-teal-500/20 bg-teal-500/5 text-teal-400 text-[11px] font-black tracking-widest uppercase shadow-inner">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Institutional Liquidity & Global Payments
          </div>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up opacity-0 text-[56px] sm:text-[76px] lg:text-[96px] font-black leading-[0.95] tracking-tighter max-w-5xl mx-auto"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <span className="block text-white">THE FUTURE OF</span>
          <span
            className="block animate-gradient-shift"
            style={{ backgroundImage: 'linear-gradient(270deg, #2dd4bf, #22d3ee, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            CRYPTO BANKING
          </span>
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-up opacity-0 mt-8 text-[17px] sm:text-[19px] text-slate-400 max-w-[620px] mx-auto leading-relaxed"
          style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
        >
          Institutional-grade trading, instant Lightning Network settlements, and automated compliance. One platform, total control.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up opacity-0 mt-12 flex items-center justify-center gap-5 flex-wrap"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-3 h-14 px-10 rounded-2xl text-[15px] font-black text-slate-950 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.03] transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%)' }}
          >
            LAUNCH APP
            <IconArrow />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl text-[14px] font-bold text-slate-300 border border-white/10 hover:border-teal-500/50 hover:text-white hover:bg-teal-500/5 transition-all duration-300 uppercase tracking-widest"
          >
            EXPLORE ECOSYSTEM
          </a>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-32 px-6 lg:px-10">
        <div ref={featRef} className="reveal max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-500">Core Infrastructure</span>
            <h2 className="text-[44px] sm:text-[56px] font-black text-white leading-tight">
              BATTLE-TESTED <br/> TECHNOLOGY
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="spotlight-card h-full"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="spotlight-card-content p-8 flex flex-col gap-8 group">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-all duration-500">
                      {feat.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-teal-500/30 text-teal-400 bg-teal-500/5">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[24px] font-black text-white">{feat.title}</h3>
                    <p className="text-[15px] text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {feat.checks.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors">
                        <span className="text-teal-500"><IconCheck /></span>
                        {c}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-[14px] font-black text-teal-400 hover:text-white transition-all uppercase tracking-widest"
                  >
                    LEARN MORE <IconArrow />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKET TABLE ────────────────────────────────────────────────────── */}
      <section id="markets" className="py-32 px-6 lg:px-10 bg-[#08080c]/50">
        <div ref={marketsRef} className="reveal max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-500">Market Dynamics</span>
              <h2 className="text-[44px] sm:text-[56px] font-black text-white leading-tight">
                REAL-TIME <br/> LIQUIDITY
              </h2>
            </div>
            <p className="text-[15px] text-slate-400 max-w-sm leading-relaxed border-l-2 border-teal-500/30 pl-6">
              Access institutional-grade markets with sub-millisecond execution and the lowest spreads in the industry.
            </p>
          </div>

          <div className="bg-[#0f0f14] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-[1fr_80px_120px_80px_100px_100px] gap-4 px-8 py-5 border-b border-white/[0.05] text-[11px] font-black uppercase tracking-[0.15em] text-slate-600">
              <span>Market</span>
              <span>Pair</span>
              <span className="text-right">Price</span>
              <span className="text-right">24H Change</span>
              <span className="hidden sm:block">Volume</span>
              <span className="text-right">Trade</span>
            </div>
            {MARKET_DATA.map((coin, i) => (
              <div key={coin.ticker} className="group cursor-pointer">
                {i > 0 && <div className="h-px bg-white/[0.03] mx-8" />}
                <div className="grid grid-cols-[1fr_80px_120px_80px_100px_100px] gap-4 px-8 py-6 items-center hover:bg-white/[0.02] transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner ${coin.positive ? 'bg-teal-500/10 text-teal-400' : 'bg-slate-700/20 text-slate-500'}`}>
                      {coin.icon ?? <span className="text-[10px] font-black">{coin.ticker.slice(0,3)}</span>}
                    </div>
                    <p className="text-[15px] font-black text-white">{coin.name}</p>
                  </div>
                  <p className="text-[13px] font-bold text-teal-500 italic">/{coin.ticker}</p>
                  <p className="text-[15px] font-black text-white text-right tabular-nums">{coin.price}</p>
                  <div className={`text-[13px] font-black text-right tabular-nums px-3 py-1 rounded-lg self-center justify-self-end ${coin.positive ? 'text-teal-400 bg-teal-400/5' : 'text-red-400 bg-red-400/5'}`}>
                    {coin.change}
                  </div>
                  <div className="hidden sm:block"><Sparkline positive={coin.positive} /></div>
                  <div className="flex justify-end">
                    <Link
                      to="/login"
                      className="h-10 px-5 rounded-xl text-[12px] font-black border border-white/10 text-slate-400 group-hover:border-teal-400 group-hover:text-teal-400 transition-all uppercase tracking-widest flex items-center gap-2"
                    >
                      TRADE
                      <IconArrow />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ───────────────────────────────────────────────────────── */}
      <section id="security" className="py-32 px-6 lg:px-10 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(45,212,191,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-500">Security Layer</span>
              <h2 className="text-[44px] sm:text-[56px] font-black text-white leading-[1.1]">
                MILITARY GRADE <br/> ENCRYPTION
              </h2>
            </div>
            <p className="text-[16px] text-slate-400 leading-relaxed max-w-lg">
              Our proprietary compliance engine scores every transaction in real-time. With Zero-Knowledge (ZK) technology, we guarantee total privacy while maintaining full regulatory alignment.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'ZK Proofs', desc: 'Proof without exposure' },
                { title: 'KYT Engine', desc: 'Real-time risk scoring' },
                { title: 'Immutable', desc: 'On-chain audit trails' },
                { title: 'Non-Custodial', desc: 'You own the keys' },
              ].map(s => (
                <div key={s.title} className="flex flex-col gap-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-teal-500/30 transition-all group">
                  <span className="text-teal-500 mb-2 group-hover:scale-110 transition-transform"><IconCheck /></span>
                  <p className="text-[15px] font-black text-white uppercase">{s.title}</p>
                  <p className="text-[12px] text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             <div className="spotlight-card transform lg:rotate-3">
                <div className="spotlight-card-content p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <IconShield />
                       <span className="text-[14px] font-black uppercase tracking-widest">Compliance Active</span>
                    </div>
                    <span className="text-[10px] font-black bg-teal-500 text-slate-950 px-3 py-1 rounded-full uppercase">Verified</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-3/4 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                       <span>ZK Integrity</span>
                       <span>99.99%</span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/[0.05] flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500"><IconZap /></div>
                    <div className="space-y-1">
                       <p className="text-[13px] font-black text-white uppercase">KYT Score: Low</p>
                       <p className="text-[11px] text-slate-500 uppercase">Transaction Cleared</p>
                    </div>
                  </div>
                </div>
             </div>
             {/* Floating elements */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/20 blur-[60px] rounded-full animate-float-slow" />
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/20 blur-[60px] rounded-full animate-float" />
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
          <div className="inline-block px-5 py-2 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400 text-[11px] font-black tracking-[0.3em] uppercase">
            Limited Availability
          </div>
          <h2 className="text-[52px] sm:text-[76px] font-black text-white leading-tight tracking-tighter">
            READY TO SCALE <br/> YOUR WEALTH?
          </h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Link
              to="/login"
              className="h-16 px-12 flex items-center gap-3 rounded-2xl text-[16px] font-black text-slate-950 shadow-2xl shadow-teal-500/30 hover:scale-[1.05] transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%)' }}
            >
              GET STARTED NOW
              <IconArrow />
            </Link>
          </div>
        </div>
        {/* Decorative background logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-[0.02] pointer-events-none scale-[5]">
           <img src="/logo.png" alt="" className="w-64 h-64 grayscale" />
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] bg-[#050507] py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 lg:gap-24">
          <div className="md:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-[20px] font-black tracking-tight text-white uppercase italic">KuriPay</span>
            </Link>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-sm font-medium">
              We bridge the gap between traditional banking and the crypto economy. Secure, compliant, and insanely fast.
            </p>
          </div>

          {[
            { title: 'Ecosystem', links: ['Trading', 'Payments', 'Liquidity', 'Compliance'] },
            { title: 'Support', links: ['Documentation', 'API Reference', 'Status', 'Security'] },
          ].map((col) => (
            <div key={col.title} className="space-y-6">
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white underline decoration-teal-500 decoration-2 underline-offset-8">
                {col.title}
              </p>
              <ul className="space-y-4">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[14px] font-bold text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-widest">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            © 2025 KURIPAY INFRASTRUCTURE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
             <a href="#" className="text-[11px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Privacy</a>
             <a href="#" className="text-[11px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
