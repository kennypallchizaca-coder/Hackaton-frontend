import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Store, Shield } from '../../../components/common/Icons';
import { useAuthStore } from '../store/authStore';

const DEMO_ACCOUNTS = [
  { role: 'Consumidor', email: 'consumer@demo.com', password: 'password123', icon: User, color: 'hover:border-blue-500 hover:text-blue-400' },
  { role: 'Transaccionador', email: 'agent@demo.com', password: 'Agent1234', icon: Shield, color: 'hover:border-purple-500 hover:text-purple-400' },
  { role: 'Local', email: 'owner@demo.ec', password: 'Owner1234', icon: Store, color: 'hover:border-emerald-500 hover:text-emerald-400' }
];


export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/app');
    } catch {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans selection:bg-blue-600 selection:text-slate-950">
      <div className="absolute inset-0 z-0">
        <img src="/image.png" alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>
      </div>

      <div className="absolute top-[10%] left-[45%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse z-1"></div>
      <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700 z-1"></div>
      
      <div className="container mx-auto px-12 h-screen flex flex-col lg:flex-row items-center relative z-10">
        <div className="hidden lg:flex lg:w-3/5 flex-col items-start gap-12">
          <div className="space-y-4">
             <motion.div 
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="w-28 h-28 bg-slate-800/90 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.15)] mb-12"
             >
                <img src="/logo.png" alt="KuriPay" className="w-full h-full object-cover rounded-full scale-110" />
             </motion.div>
             <motion.h1 
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="text-[120px] font-black text-white leading-[0.9] tracking-tighter"
             >
               Welcome<br />Back .!
             </motion.h1>
          </div>
        </div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-2/5 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-[480px] bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[32px] p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tight">Login</h2>
                <p className="text-slate-400 font-medium">Glad you’re back.!</p>
              </div>

              {/* DEMO QUICK LOGIN */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 border-b border-white/10 pb-2">Demo Quick Login</p>
                <div className="flex gap-2">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                          setEmail(acc.email);
                          setPassword(acc.password);
                          setError('');
                          try {
                            await login(acc.email, acc.password);
                            navigate('/app');
                          } catch {
                            setError('Error en cuenta demo');
                          }
                        }}
                        className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10 bg-white/5 transition-all outline-none ${acc.color} group disabled:opacity-50`}
                      >
                        <Icon size={18} className="text-slate-400 group-hover:text-inherit transition-colors" />
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-inherit transition-colors">{acc.role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900/50 text-[10px] font-medium text-slate-500 rounded backdrop-blur-sm tracking-widest uppercase">O ingresa manualmente</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-transparent border border-white/30 rounded-2xl px-6 py-5 text-lg text-white font-medium outline-none focus:border-white transition-all placeholder:text-white/30"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-transparent border border-white/30 rounded-2xl px-6 py-5 text-lg text-white font-medium outline-none focus:border-white transition-all placeholder:text-white/30"
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

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl overflow-hidden"
                    >
                      <p className="text-xs font-medium text-red-400 text-center">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[72px] bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xl text-white shadow-xl active:scale-[0.98] transition-all flex items-center justify-center overflow-hidden"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <p className="text-center text-white font-medium">
                    Don’t have an account ? <Link to="/register" className="text-blue-500 font-bold hover:underline">Signup</Link>
                  </p>
                </div>
              </form>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
