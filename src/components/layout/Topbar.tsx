import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown } from '../common/Icons';
import { useAuthStore } from '../../features/auth/store/authStore';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { label: 'Buy Crypto', hasArrow: true },
    { label: 'Markets', hasArrow: false },
    { label: 'Trade', hasArrow: true },
    { label: 'Derivatives', hasArrow: true },
    { label: 'Earn', hasArrow: true },
    { label: 'Finance', hasArrow: true },
    { label: 'NFT', hasArrow: false },
  ];

  const ANNOUNCEMENTS = [
    'KuriPay Merchant Program: Earn 0% fees on BTC/USDT spot trading pairs for verified merchants!',
    'KuriPay Staking: Advanced APR on USDT & Node Operations Rewards',
  ];

  return (
    <div className="w-full flex flex-col sticky top-0 z-30">
      {/* Main Header - 64px */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {/* Binance-style logo text */}
          <Link to="/" className="mr-4 flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded overflow-hidden">
              <img src="/logo.png" alt="KuriPay" className="w-full h-full object-contain" />
            </div>
            <span className="text-blue-500 font-black text-[15px] tracking-tight hidden md:block">KuriPay</span>
          </Link>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-0.5 px-3 py-2 text-[13px] text-slate-50 hover:text-blue-500 font-medium transition-colors whitespace-nowrap group"
            >
              {item.label}
              {item.hasArrow && (
                <ChevronDown size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors ml-0.5" />
              )}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">

          <div className="w-px h-5 bg-slate-800 mx-1" />

          {/* User Avatar */}
          <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-700 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-slate-900 text-[11px] font-black">
              {user?.name?.[0]?.toUpperCase() ?? 'M'}
            </div>
            <span className="text-[12px] text-slate-50 font-medium hidden lg:block">{user?.name ?? 'Merchant'}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-50 transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] font-black flex items-center justify-center">8</span>
          </button>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-[11px] text-slate-400 font-bold uppercase tracking-wider px-2 py-1 hover:text-red-500 transition-colors border-l border-slate-800 ml-1 pl-3"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Announcement/Ticker Bar - 48px */}
      <div className="h-10 bg-slate-950 border-b border-slate-800 flex items-center px-4 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee-slow whitespace-nowrap flex gap-16">
            {ANNOUNCEMENTS.map((msg, i) => (
              <span key={i} className="text-[12px] text-slate-400">
                <span className="text-blue-500 font-bold mr-2">#{i + 1}</span>
                {msg}
                <span className="text-blue-500 ml-2 font-bold">(03-10)</span>
              </span>
            ))}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-50 ml-4 shrink-0">
          <span className="text-[11px]">✕</span>
        </button>
      </div>
    </div>
  );
}
