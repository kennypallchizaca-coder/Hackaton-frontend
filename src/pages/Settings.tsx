import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Wallet, Gift, ChevronRight, Check } from 'lucide-react';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS = [
    { id: 'profile' as SettingsTab, label: 'Perfil', icon: <User size={16} /> },
    { id: 'notifications' as SettingsTab, label: 'Notificaciones', icon: <Bell size={16} /> },
    { id: 'security' as SettingsTab, label: 'Seguridad', icon: <Shield size={16} /> },
    { id: 'billing' as SettingsTab, label: 'Plan & Facturación', icon: <Wallet size={16} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A192F] flex items-center gap-3">
          <SettingsIcon size={26} className="text-[#F4B41A]" /> Configuración
        </h1>
        <p className="text-gray-500 mt-1">Gestiona tu cuenta, seguridad y preferencias del sistema.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <nav className="lg:w-52 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0A192F] text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#0A192F]'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#F4B41A]' : ''}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 glass p-8 space-y-6">
          {activeTab === 'profile' && (
            <>
              <h2 className="text-lg font-bold text-[#0A192F]">Información del Comercio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre del Comercio', value: 'KuriPay EC Demo', id: 'biz-name' },
                  { label: 'RUC / Identificación Tributaria', value: '1792345678001', id: 'ruc' },
                  { label: 'Ciudad', value: 'Quito', id: 'city' },
                  { label: 'Provincia', value: 'Pichincha', id: 'province' },
                ].map(field => (
                  <div key={field.id}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">{field.label}</label>
                    <input
                      id={field.id}
                      defaultValue={field.value}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email de Contacto</label>
                  <input
                    defaultValue="merchant@kuripay.ec"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-[#0A192F] mb-4">Configuración Lightning</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Nodo Lightning (URL)</label>
                    <input
                      defaultValue="https://node.kuripay.ec:8080"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Dirección BTC On-Chain</label>
                    <input
                      defaultValue="bc1q9f8a2d3ec4d5e6f7g8h9i0j1k2l3m4n5o6p7q8"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Tiempo de expiración invoice (minutos)</label>
                    <input
                      type="number" defaultValue="15"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0A192F] focus:outline-none focus:border-[#F4B41A] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h2 className="text-lg font-bold text-[#0A192F]">Preferencias de Notificación</h2>
              <div className="space-y-4">
                {[
                  { label: 'Pago recibido', desc: 'Recibe una notificación cada vez que se confirme un pago.', defaultChecked: true },
                  { label: 'Alerta KYT de riesgo alto', desc: 'Notificación inmediata cuando se detecta una transacción de riesgo alto.', defaultChecked: true },
                  { label: 'Factura expirada', desc: 'Aviso cuando una factura Lightning expira sin ser pagada.', defaultChecked: false },
                  { label: 'Resumen diario por email', desc: 'Recibirás un email con el resumen de ventas cada día a las 20:00.', defaultChecked: true },
                  { label: 'Actualizaciones del sistema', desc: 'Novedades de KuriPay y actualizaciones de la plataforma.', defaultChecked: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" defaultChecked={item.defaultChecked}
                      className="mt-0.5 w-4 h-4 accent-[#F4B41A] rounded flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#0A192F] text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h2 className="text-lg font-bold text-[#0A192F]">Seguridad de Cuenta</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-emerald-50">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold text-[#0A192F] text-sm">Autenticación 2FA</p>
                      <p className="text-xs text-gray-400">Activa y configurada con app TOTP</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Activo</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div>
                    <p className="font-semibold text-[#0A192F] text-sm">Cambiar contraseña</p>
                    <p className="text-xs text-gray-400">Última actualización: hace 30 días</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0A192F] transition-colors" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div>
                    <p className="font-semibold text-[#0A192F] text-sm">API Keys</p>
                    <p className="text-xs text-gray-400">Gestiona claves para integraciones</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#0A192F] transition-colors" />
                </div>

                <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl hover:bg-red-50/50 cursor-pointer transition-colors group">
                  <div>
                    <p className="font-semibold text-red-600 text-sm">Cerrar todas las sesiones</p>
                    <p className="text-xs text-gray-400">Desconecta todos los dispositivos vinculados</p>
                  </div>
                  <ChevronRight size={16} className="text-red-300 group-hover:text-red-600 transition-colors" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'billing' && (
            <>
              <h2 className="text-lg font-bold text-[#0A192F]">Plan Activo</h2>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0A192F] to-[#1A2C49] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B41A]/10 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Gift size={16} className="text-[#F4B41A]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#F4B41A]">Hackathon Pro</span>
                    </div>
                    <h3 className="text-2xl font-black">$0 / mes</h3>
                    <p className="text-sm text-gray-400 mt-1">Trial gratuito activo hasta el 31 de Marzo, 2025</p>
                  </div>
                  <span className="bg-[#F4B41A] text-[#0A192F] text-xs font-black px-3 py-1 rounded-full">ACTIVO</span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[['Transacciones', 'Ilimitadas'], ['KYT / Alertas', 'Incluido'], ['GenLayer AI', 'Incluido']].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-gray-400">{k}</p>
                      <p className="font-bold text-sm text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#0A192F]">Historial de Facturas</h3>
                {[
                  { date: 'Mar 2025', desc: 'Hackathon Pro Plan', amount: '$0.00', status: 'Pagado' },
                  { date: 'Feb 2025', desc: 'Prueba gratuita', amount: '$0.00', status: 'Pagado' },
                ].map(inv => (
                  <div key={inv.date} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-[#0A192F] text-sm">{inv.desc}</p>
                      <p className="text-xs text-gray-400">{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#0A192F]">{inv.amount}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#F4B41A] text-[#0A192F] hover:bg-[#FFC13B]'
              }`}
            >
              {saved ? <><Check size={16} /> Guardado</> : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
