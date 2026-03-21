import { Bell, Search, Menu, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/payments': 'Cobrar (POS)',
  '/transactions': 'Transacciones',
  '/stores': 'Sucursales',
  '/compliance': 'Compliance · KYT',
  '/genlayer': 'GenLayer · IA',
  '/ai-insights': 'IA & Análisis',
  '/settings': 'Configuración',
};

export function Topbar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const pageLabel = routeLabels[location.pathname] ?? 'Dashboard';

  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button className="p-2 -ml-2 text-gray-400 hover:text-[#0A192F] lg:hidden">
          <Menu size={22} />
        </button>

        {/* Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-1.5 text-gray-400">
            <div className="w-5 h-5 rounded bg-[#F4B41A] flex items-center justify-center">
              <Zap size={11} className="text-[#0A192F]" />
            </div>
            <span>KuriPay</span>
          </div>
          <span className="text-gray-300">/</span>
          <span className="text-[#0A192F] font-bold">{pageLabel}</span>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative group ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F4B41A] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Buscar tx, hash, dirección..."
            className="w-full bg-gray-50 border border-transparent rounded-lg py-2 pl-9 pr-4 text-sm text-[#0A192F] outline-none focus:border-[#F4B41A]/40 focus:bg-white transition-all placeholder:text-gray-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 text-gray-400 hover:text-[#0A192F] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A31621] rounded-full" />
        </button>

        <div className="h-5 w-px bg-gray-200" />

        {/* User chip */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4B41A] to-[#FFC13B] flex items-center justify-center text-[#0A192F] font-black text-sm shadow-sm">
            {user?.name?.[0] ?? 'M'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#0A192F] leading-none">{user?.name ?? 'Merchant'}</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">{user?.role ?? 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
