import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('merchant@kuripay.ec');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col lg:flex-row relative overflow-hidden">
      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#F4B41A]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#F4B41A] flex items-center justify-center">
              <Zap size={20} className="text-[#0A192F]" />
            </div>
            <span className="text-2xl font-black tracking-widest text-white">KURIPAY</span>
          </div>
          <p className="text-gray-500 text-sm">Pagos BTC & Lightning para Ecuador</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight">
              El futuro del<br />
              <span className="text-[#F4B41A]">comercio digital</span><br />
              ya llegó.
            </h1>
            <p className="text-gray-400 mt-4 text-lg leading-relaxed max-w-sm">
              Acepta Bitcoin y Lightning Network en tu negocio con compliance KYT, auditoría trazable y resolución de disputas por IA.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Transacciones', value: '2.4K+' },
              { label: 'Vol. BTC mensual', value: '1.8 BTC' },
              { label: 'Tasa de éxito', value: '99.2%' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield size={14} className="text-[#F4B41A]" />
            <span>Cumplimiento SRI Ecuador · KYT · AML · SOC2</span>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Términos de Uso</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Soporte</a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-[#F5F8FC] lg:rounded-l-[40px]" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#F4B41A] flex items-center justify-center">
              <Zap size={16} className="text-[#0A192F]" />
            </div>
            <span className="text-xl font-black text-[#0A192F]">KURIPAY</span>
          </div>

          <h2 className="text-3xl font-black text-[#0A192F] mb-1">Bienvenido</h2>
          <p className="text-gray-400 mb-8 text-sm">Accede a tu panel de pagos Bitcoin.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[#0A192F] font-medium focus:outline-none focus:border-[#F4B41A] transition-colors shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-[#0A192F] font-medium focus:outline-none focus:border-[#F4B41A] transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="#" className="text-sm font-medium text-gray-400 hover:text-[#0A192F] transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 bg-[#0A192F] text-white font-bold rounded-xl hover:bg-[#1A2C49] disabled:opacity-60 transition-all duration-300 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <>Entrar al Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#F5F8FC] text-gray-400 font-medium">o continuar con</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex justify-center items-center gap-2 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#0A192F] hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Zap size={16} className="text-[#F4B41A]" />
              Hardware Wallet (WebLN)
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 font-medium text-center">
              💡 <strong>Demo Mode:</strong> Los campos están pre-llenados con datos de prueba. Solo presiona "Entrar".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
