import { cn } from '../../../utils/cn';
import { useAuthStore } from '../../auth/store/authStore';

export function SystemFlowMap() {
  const user = useAuthStore(state => state.user);
  
  const roles = [
    { 
      id: 'consumer', 
      label: 'Consumidor', 
      icon: (
        <svg xmlns="http://www.w3.org/.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      color: '#3b82f6',
      desc: 'Compra/Vende Cripto con Transaccionadores. Gasta en Locales.',
      active: user?.role === 'consumer'
    },
    { 
      id: 'transaccionador', 
      label: 'Transaccionador', 
      icon: (
        <svg xmlns="http://www.w3.org/.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18"></path>
          <path d="M3 10h18"></path>
          <path d="M5 6l7-3 7 3"></path>
          <path d="M4 10v11"></path>
          <path d="M20 10v11"></path>
          <path d="M8 14v3"></path>
          <path d="M12 14v3"></path>
          <path d="M16 14v3"></path>
        </svg>
      ),
      color: '#10b981',
      desc: 'Puente Fiat <> Crypto. Transacciona con todos los roles.',
      active: user?.role === 'transaccionador'
    },
    { 
      id: 'merchant', 
      label: 'Local (Comercio)', 
      icon: (
        <svg xmlns="http://www.w3.org/.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),

      color: '#94a3b8',
      desc: 'Gasta Cripto en otros Locales. Vende Cripto por Fiat a Transaccionadores.',
      active: user?.role === 'merchant'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-[12px] font-black text-slate-50 uppercase tracking-widest flex items-center gap-2">
            Enterprise Routing Protocol (v1.0)
            <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">SECURE</span>
          </h3>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">Verified transaction path between Fiat and Crypto ecosystems</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fiat Flow</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Crypto Flow</span>
           </div>
        </div>
      </div>

      <div className="relative mt-4">
        {/* Connection Arcs (Simplified Technical UI) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
        </div>

        <div className="grid grid-cols-3 gap-8 relative z-10">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className={cn(
                "flex flex-col items-center text-center p-4 border transition-all duration-300 relative",
                role.active 
                  ? "bg-slate-800 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.05)]" 
                  : "bg-slate-950 border-slate-800 opacity-60 hover:opacity-100"
              )}
            >
              {role.active && (
                <div className="absolute -top-2 px-2 bg-blue-600 text-slate-950 text-[8px] font-black uppercase tracking-tighter">
                  Current Role Intent
                </div>
              )}
              <div className="text-2xl mb-2">{role.icon}</div>
              <h4 className="text-[11px] font-black text-slate-50 uppercase tracking-widest mb-1" style={{ color: role.active ? role.color : '#f8fafc' }}>
                {role.label}
              </h4>
              <p className="text-[10px] text-slate-400 leading-tight font-bold tracking-tighter max-w-[120px]">
                {role.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Directional Flow technical info */}
        <div className="mt-8 grid grid-cols-2 gap-4">
           <div className="bg-slate-800 border border-l-2 border-slate-800 border-l-blue-500 p-3">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Circulation Matrix</span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
               Consumers <span className="text-slate-50 font-bold">MUST</span> use Transaccionadores for fiat on/off-boarding. Merchants earn from Consumers and can only off-ramp via Transaccionadores.
            </p>
         </div>
         <div className="bg-slate-800 border border-l-2 border-slate-800 border-l-emerald-500 p-3">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">P2P Liquidity Protocol</span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
               Transaccionadores act as the <span className="text-slate-50 font-bold">Economic Engine</span>, facilitating fiat flow across all roles while maintaining deep system liquidity.
            </p>
         </div>
        </div>
      </div>
    </div>
  );
}
