import { Activity, Wallet, Bitcoin, Loader2, MessageSquare } from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { DataTable, type Column } from '../components/ui/DataTable';
import { type Transaction } from '../data/mockTransactions';
import { useTransactions } from '../hooks/useTransactions';

export function Dashboard() {
  const { data: transactions, isLoading } = useTransactions();
  const recentTransactions = transactions.slice(0, 5); // Take 5 for the latest activities table

  const columns: Column<Transaction>[] = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (item) => <span className="text-gray-500 font-medium">{new Date(item.date).toLocaleString()}</span>
    },
    {
      header: 'Detail',
      accessorKey: 'store',
      cell: (item) => <span className="font-bold text-bg-dark">{item.store} P2P Transfer</span>
    },
    {
      header: 'Price',
      accessorKey: 'amountBTC',
      cell: (item) => <span className="font-bold text-accent-blue">{parseFloat(item.amountBTC) > 0 ? '+' : ''}{item.amountBTC} BTC</span>
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 pt-6">
      
      {/* Top Row: Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="BTC" 
          subTitle="Bitcoin"
          value="¥ 721,882" 
          trend={{ value: "-4.44%", isPositive: false }}
          icon={<Bitcoin size={13} strokeWidth={2.5} />} 
          color="#F7931A"
        />
        <MetricCard 
          title="ETH" 
          subTitle="Ethereum"
          value="¥ 32,370" 
          trend={{ value: "+0.45%", isPositive: true }}
          icon={<Activity size={13} strokeWidth={2.5} />} 
          color="#627EEA"
        />
        <MetricCard 
          title="XLM" 
          subTitle="Stellar"
          value="¥ 10,604" 
          trend={{ value: "-4.07%", isPositive: false }}
          icon={<Wallet size={13} strokeWidth={2.5} />} 
          color="#000000"
        />
        <MetricCard 
          title="XRP" 
          subTitle="Ripple"
          value="¥ 50,839" 
          trend={{ value: "+4.48%", isPositive: true }}
          icon={<Activity size={13} strokeWidth={2.5} />} 
          color="#23292F"
        />
      </section>

      {/* Middle Row: Large Chart */}
      <section className="glass p-6 min-h-[440px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-bg-dark">BTC <span className="text-gray-400 text-sm font-medium ml-1">JPY v</span></h2>
             <div className="flex items-center gap-6 ml-4">
                <div className="text-sm">
                   <span className="text-gray-400 mr-2">High</span>
                   <span className="font-bold text-bg-dark">732,474</span>
                </div>
                <div className="text-sm">
                   <span className="text-gray-400 mr-2">Low</span>
                   <span className="font-bold text-bg-dark">708,806</span>
                </div>
                <div className="text-sm">
                   <span className="text-gray-400 mr-2">24H Vol</span>
                   <span className="font-bold text-bg-dark">871.7 BTC</span>
                </div>
             </div>
          </div>
          <button className="bg-[#4CA5FF] text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors shadow-sm">
             BUY
          </button>
        </div>
        
        {/* Fake Time Selectors */}
        <div className="flex gap-6 border-b border-gray-100 pb-4 mb-4 text-sm font-bold text-gray-400">
           <span className="hover:text-bg-dark cursor-pointer transition-colors">1 min</span>
           <span className="hover:text-bg-dark cursor-pointer transition-colors">5 min</span>
           <span className="hover:text-bg-dark cursor-pointer transition-colors">15 min</span>
           <span className="hover:text-bg-dark cursor-pointer transition-colors">30 min</span>
           <span className="text-accent-blue border-b-2 border-accent-blue pb-4 -mb-[18px]">1 Hr</span>
           <span className="hover:text-bg-dark cursor-pointer transition-colors">1 Day</span>
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex items-center justify-center relative w-full overflow-hidden mt-4">
           {/* Mock Grid Lines */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_40px]"></div>
           <p className="text-gray-300 font-bold tracking-widest uppercase z-10 text-xl">Interactive Chart Layout Area</p>
        </div>
      </section>

      {/* Bottom Row: Tables & News */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Activities */}
        <div className="lg:col-span-2 glass pt-6 pb-2">
          <div className="px-6 flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-bg-dark flex items-center gap-2">
                <Activity size={20} className="text-accent-blue" /> Latest Activities
             </h2>
             <select className="bg-transparent text-sm font-medium text-gray-500 outline-none cursor-pointer">
                <option>ALL</option>
                <option>BTC</option>
                <option>ETH</option>
             </select>
          </div>
          {isLoading ? (
             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent-gold" size={32} /></div>
          ) : (
             <DataTable data={recentTransactions} columns={columns} keyExtractor={(item) => item.id} />
          )}
        </div>

        {/* Crypto Newsfeed */}
        <div className="glass p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-bg-dark flex items-center gap-2">
                <MessageSquare size={20} className="text-[#0A192F]" /> Crypto Newsfeed
             </h2>
             <button className="text-xs font-bold text-gray-400 border border-gray-200 rounded px-2 py-1">View All</button>
          </div>

          <div className="space-y-6 flex-1 z-10">
             <div className="cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-1 block">Today 11:36</span>
                <h3 className="text-sm font-bold text-bg-dark mb-1 group-hover:text-accent-blue transition-colors">Beyond Bad Trades: Cybersecurity Risks for Cryptocurrency Exchange Users</h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">Cryptocurrency mining malware is not the only type of cryptocurrency related threat — cybercriminals have created...</p>
             </div>
             <div className="cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-1 block">Yesterday</span>
                <h3 className="text-sm font-bold text-bg-dark mb-1 group-hover:text-accent-blue transition-colors">Ripple News Today: Ripple is planning to upgrade the technology</h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">While crypto markets sell off, Ripple remains committed to continuous development of its core technology...</p>
             </div>
          </div>
          
          {/* Decorative Corner vector */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50 rotate-12 -z-0"></div>
          <div className="absolute bottom-4 right-4 bg-bg-dark text-white p-2 rounded-lg cursor-pointer shadow-soft hover:shadow-soft-hover transition-shadow z-10">
             <MessageSquare size={20} />
          </div>
        </div>
      </section>

    </div>
  );
}
