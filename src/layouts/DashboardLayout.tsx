import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

// The trading dashboard needs full-height overflow-hidden layout
// All other pages need overflow-y-auto (scrollable)
const TRADING_ROUTES = ['/app'];

export function DashboardLayout() {
  const location = useLocation();
  const isTrading = TRADING_ROUTES.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-14 min-w-0 overflow-hidden">
        <Topbar />
        <main className={`flex-1 ${isTrading ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
