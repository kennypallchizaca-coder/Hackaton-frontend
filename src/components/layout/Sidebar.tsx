import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../features/auth/store/authStore';

const Icons = {
  Trade: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  POS: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Orders: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 16l-4-4 4-4M17 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Compliance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Analytics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17l4-6 4 3 4-7 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

const navItems = [
  { name: 'Trade', tKey: 'sidebar.trade', path: '/app', icon: Icons.Trade },
  { name: 'POS Terminal', tKey: 'sidebar.pos_terminal', path: '/app/payments', icon: Icons.POS },
  { name: 'Orders', tKey: 'sidebar.orders', path: '/app/transactions', icon: Icons.Orders },
  { name: 'Compliance', tKey: 'sidebar.compliance', path: '/app/compliance', icon: Icons.Compliance },
  { name: 'Settings', tKey: 'sidebar.settings', path: '/app/settings', icon: Icons.Settings },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(item => {
    if (!user) return false;
    
    // Role-based visibility
    if (user.role === 'consumer') {
      return ['Trade', 'Orders', 'Settings'].includes(item.name);
    }
    if (user.role === 'transaccionador') {
      return ['Trade', 'Orders', 'Compliance', 'Settings'].includes(item.name);
    }
    if (user.role === 'merchant') {
      return ['Trade', 'POS Terminal', 'Orders', 'Settings'].includes(item.name);
    }
    return true; // Admin sees all
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-14 h-screen fixed top-0 left-0 bg-slate-900 flex flex-col items-center py-3 z-40 border-r border-slate-800">
      {/* Logo */}
      <Link to="/app" className="mb-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded overflow-hidden">
          <img src="/logo.png" alt="KuriPay" className="w-full h-full object-contain" />
        </div>
      </Link>

      {/* Nav */}
      <div className="flex-1 flex flex-col gap-0.5 w-full px-1">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path + item.name}
              to={item.path}
              title={item.name}
              className={cn(
                "flex items-center justify-center w-full h-10 rounded transition-all duration-150 relative group",
                isActive
                  ? "text-blue-500 bg-blue-500/10"
                  : "text-slate-400 hover:text-slate-50 hover:bg-slate-700"
              )}
            >
              {item.icon}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-600 rounded-r" />
              )}
              {/* Tooltip */}
              <span className="absolute left-14 bg-slate-950 text-slate-50 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-800 shadow-xl z-50">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Role Indicator */}
      <div className="mb-4 flex flex-col items-center gap-1 group relative">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-500 uppercase tracking-tighter">
          {user?.role === 'consumer' ? 'C' : user?.role === 'transaccionador' ? 'T' : 'L'}
        </div>
        <span className="absolute left-14 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 uppercase tracking-widest">
          {user?.role === 'consumer' ? 'Consumidor' : 
           user?.role === 'transaccionador' ? 'Transaccionador' : 
           'Local'}
        </span>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        title="Log Out"
        className="w-10 h-10 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-slate-700 transition-all font-bold"
      >
        {Icons.Logout}
      </button>
    </aside>
  );
}
