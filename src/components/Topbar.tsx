import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Globe, Download } from './Icons';
import { useAuthStore } from '../store/authStore';

const NAV_ITEMS = [
  { label: 'Buy Crypto', hasArrow: true },
  { label: 'Markets', hasArrow: false },
  { label: 'Trade', hasArrow: true },
  { label: 'Derivatives', hasArrow: true },
  { label: 'Earn', hasArrow: true },
  { label: 'Finance', hasArrow: true },
  { label: 'NFT', hasArrow: false },
];

const ANNOUNCEMENT = "KuriPay Merchant Program: Earn 0% fees on BTC/USDT spot trading pairs for verified merchants!";

export function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col sticky top-0 z-30">
      {/* Main Header - 64px */}
      <header className="h-16 bg-[#0A1628] border-b border-[#1a2d4a] flex items-center justify-between px-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {/* Binance-style logo text */}
          <Link to="/" className="mr-4 flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded overflow-hidden">
              <img src="/logo.png" alt="KuriPay" className="w-full h-full object-contain" />
            </div>
            <span className="text-[#FCD535] font-black text-[15px] tracking-tight hidden md:block">KuriPay</span>
          </Link>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-0.5 px-3 py-2 text-[13px] text-[#EAECEF] hover:text-[#FCD535] font-medium transition-colors whitespace-nowrap group"
            >
              {item.label}
              {item.hasArrow && (
                <ChevronDown size={12} className="text-[#848E9C] group-hover:text-[#FCD535] transition-colors ml-0.5" />
              )}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Deposit Button */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCD535] text-[#181A20] text-[12px] font-bold rounded hover:bg-[#f0c90a] transition-colors">
            <Download size={13} />
            Deposit
          </button>

          <div className="w-px h-5 bg-[#1a2d4a] mx-1" />

          {/* Wallet / Orders */}
          <button className="flex items-center gap-1 px-2 py-2 text-[13px] text-[#EAECEF] hover:text-[#FCD535] font-medium transition-colors">
            Wallet
            <ChevronDown size={12} className="text-[#848E9C]" />
          </button>

          <button className="flex items-center gap-1 px-2 py-2 text-[13px] text-[#EAECEF] hover:text-[#FCD535] font-medium transition-colors">
            Orders
            <ChevronDown size={12} className="text-[#848E9C]" />
          </button>

          <div className="w-px h-5 bg-[#1a2d4a] mx-1" />

          {/* User Avatar */}
          <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1a2d4a] transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#FCD535] flex items-center justify-center text-[#181A20] text-[11px] font-black">
              {user?.name?.[0]?.toUpperCase() ?? 'M'}
            </div>
            <span className="text-[12px] text-[#EAECEF] font-medium hidden lg:block">{user?.name ?? 'Merchant'}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-[#848E9C] hover:text-[#EAECEF] transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#F6465D] rounded-full text-white text-[8px] font-black flex items-center justify-center">8</span>
          </button>

          {/* Language */}
          <button className="p-2 text-[#848E9C] hover:text-[#EAECEF] transition-colors">
            <Globe size={17} />
          </button>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-[11px] text-[#6B8CAE] font-bold uppercase tracking-wider px-2 py-1 hover:text-[#F6465D] transition-colors border-l border-[#1a2d4a] ml-1 pl-3"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Announcement/Ticker Bar - 48px */}
      <div className="h-10 bg-[#060E1E] border-b border-[#1a2d4a] flex items-center px-4 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee-slow whitespace-nowrap flex gap-16">
            {[ANNOUNCEMENT, "Binance Simple Earn: Enjoy Exclusive APR & Get 10 BNB in Rewards!", "New Margin Pairs: TRU & More — Zero fee promotion"].map((msg, i) => (
              <span key={i} className="text-[12px] text-[#848E9C]">
                <span className="text-[#FCD535] font-bold mr-2">#{i + 1}</span>
                {msg}
                <span className="text-[#FCD535] ml-2 font-bold">(03-10)</span>
              </span>
            ))}
          </div>
        </div>
        <button className="text-[#848E9C] hover:text-[#EAECEF] ml-4 shrink-0">
          <span className="text-[11px]">✕</span>
        </button>
      </div>
    </div>
  );
}
