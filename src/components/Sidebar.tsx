import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, Store, Settings, ShieldAlert, Cpu, Sparkles, LogOut, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
  { name: 'Cobrar (POS)', path: '/payments', icon: <Wallet size={18} /> },
  { name: 'Transacciones', path: '/transactions', icon: <ArrowLeftRight size={18} /> },
  { name: 'Sucursales', path: '/stores', icon: <Store size={18} /> },
];

const hackathonItems = [
  { name: 'Compliance KYT', path: '/compliance', icon: <ShieldAlert size={18} /> },
  { name: 'GenLayer IA', path: '/genlayer', icon: <Cpu size={18} /> },
  { name: 'IA & Análisis', path: '/ai-insights', icon: <Sparkles size={18} /> },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ item, accentColor = 'accent-gold' }: { item: typeof navItems[0]; accentColor?: string }) => {
    const isActive = location.pathname === item.path;
    const goldActive = accentColor === 'accent-gold';
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group",
          isActive
            ? "bg-white/10 text-white"
            : "text-[#8892B0] hover:bg-white/5 hover:text-white"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
          isActive
            ? goldActive ? "bg-[#F4B41A] text-[#0A192F]" : "bg-[#A31621] text-white"
            : "bg-white/5 text-[#8892B0] group-hover:bg-white/10 group-hover:text-white"
        )}>
          {item.icon}
        </div>
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-[#0A192F] flex flex-col pb-4 z-40 hidden lg:flex border-r border-white/5">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 mb-2">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F4B41A] flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-[#0A192F]" />
          </div>
          <div>
            <p className="text-white font-black text-lg tracking-widest leading-none">KURIPAY</p>
            <p className="text-[10px] text-gray-500 tracking-widest">BTC · Lightning · EC</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[9px] font-black text-[#4A5568] uppercase tracking-[0.15em] mb-2">Plataforma</p>
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} accentColor="accent-gold" />
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[9px] font-black text-[#4A5568] uppercase tracking-[0.15em] mb-2">Hackathon Modules</p>
          {hackathonItems.map((item) => (
            <NavLink key={item.path} item={item} accentColor="accent-red" />
          ))}
        </div>
      </div>

      {/* User Footer */}
      <div className="px-3 pt-3 border-t border-white/5 space-y-1">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group",
            location.pathname === '/settings'
              ? "bg-white/10 text-white"
              : "text-[#8892B0] hover:bg-white/5 hover:text-white"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            location.pathname === '/settings' ? "bg-[#F4B41A] text-[#0A192F]" : "bg-white/5 text-[#8892B0] group-hover:bg-white/10 group-hover:text-white"
          )}>
            <Settings size={18} />
          </div>
          <span>Configuración</span>
        </Link>

        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4B41A] to-[#FFC13B] flex items-center justify-center text-[#0A192F] font-black text-sm shrink-0">
            {user?.name?.[0] ?? 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">{user?.name ?? 'Merchant'}</p>
            <p className="text-gray-500 text-[10px] truncate">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
