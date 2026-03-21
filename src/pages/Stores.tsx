import { Store as StoreIcon, MapPin, Activity } from '../components/Icons';

const mockStores = [
  { id: 1, name: "Downtown Cafe", location: "New York, NY", status: "Active", volume: "0.45", terminals: 2 },
  { id: 2, name: "Web Store", location: "Online", status: "Active", volume: "3.20", terminals: 1 },
  { id: 3, name: "Main Branch", location: "Austin, TX", status: "Maintenance", volume: "0.12", terminals: 4 },
];

export function Stores() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Stores & Terminals</h1>
          <p className="text-text-gray">Manage your physical and online point of sales.</p>
        </div>
        <button className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-accent-blue transition-colors">
          + Add New Store
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStores.map(store => (
          <div key={store.id} className="glass p-6 rounded-[24px] border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors">
                <StoreIcon size={24} />
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${store.status === 'Active' ? 'bg-status-blue/10 text-status-blue border-status-blue/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                {store.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{store.name}</h3>
            <div className="flex items-center text-text-gray text-sm mb-6">
               <MapPin size={14} className="mr-1" /> {store.location}
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
               <div>
                 <p className="text-xs text-text-gray mb-1 uppercase tracking-wider">Volume (30d)</p>
                 <p className="font-bold flex items-center gap-1.5"><Activity size={14} className="text-accent-blue"/> {store.volume} BTC</p>
               </div>
               <div>
                 <p className="text-xs text-text-gray mb-1 uppercase tracking-wider">Terminals</p>
                 <p className="font-bold">{store.terminals} Active</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
