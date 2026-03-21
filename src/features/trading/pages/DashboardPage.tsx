import { useAuthStore } from '../../auth/store/authStore';
import { ConsumerDashboard } from '../../consumer/pages/ConsumerDashboard';
import { AgentDashboard } from '../../liquidity/pages/AgentDashboard';
import { MerchantDashboard } from '../../merchant/pages/MerchantDashboard';
import { SEO } from '../../../components/common/SEO';

export function Dashboard() {
  const user = useAuthStore(state => state.user);

  if (user?.role === 'consumer') return <ConsumerDashboard />;
  if (user?.role === 'liquidity_agent') return <AgentDashboard />;
  if (user?.role === 'merchant') return <MerchantDashboard />;

  // Default fallback for admin or unknown roles
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <SEO title="KuriPay Dashboard" description="Enterprise crypto platform with multi-role support." />
      <div className="p-10 text-center">
        <h1 className="text-3xl font-black text-white">System Administration</h1>
        <p className="text-slate-400 mt-4">Welcome, internal operator. Select a module from the sidebar to begin.</p>
      </div>
    </div>
  );
}
