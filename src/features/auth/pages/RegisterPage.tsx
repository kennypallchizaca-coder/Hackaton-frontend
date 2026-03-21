import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from '../../../components/common/Icons';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'CONSUMER'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      await register(formData.fullName, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Error al crear la cuenta. Intenta de nuevo.');
    }
  };

  const roles = [
    { id: 'CONSUMER', label: 'Consumidor', desc: 'Compre y venda cripto' },
    { id: 'AGENT', label: 'Agente', desc: 'Provee liquidez fiat' },
    { id: 'MERCHANT', label: 'Comercio', desc: 'Reciba pagos cripto' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans selection:bg-blue-600 selection:text-slate-950">
      <div className="absolute inset-0 z-0">
        <img src="/image.png" alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>
      </div>

      <div className="container mx-auto px-6 flex flex-col items-center relative z-10 py-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-[540px] bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[32px] p-10 shadow-2xl"
        >
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-4xl font-black text-white tracking-tight">Crea tu cuenta</h2>
            <p className="text-slate-400 font-medium">Únete al ecosistema KuriPay</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre Completo"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-transparent border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/30"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/30"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña (mín. 8 caracteres)"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-transparent border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest pl-1">Selecciona tu Rol</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                      formData.role === r.id 
                        ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[11px] font-black">{r.label}</span>
                    <span className="text-[9px] leading-tight opacity-70">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
                >
                  <p className="text-xs text-red-400 text-center font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg text-white shadow-xl active:scale-[0.98] transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Creando cuenta...
                </div>
              ) : 'Registrarme'}
            </button>

            <p className="text-center text-white/60 text-sm">
              ¿Ya tienes cuenta? <Link to="/login" className="text-blue-500 font-bold hover:underline">Inicia sesión</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
