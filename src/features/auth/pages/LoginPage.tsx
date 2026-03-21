import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from '../../../components/common/Icons';
import { useAuthStore } from '../store/authStore';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('merchant@kuripay.ec');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
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

              <form onSubmit={handleLogin} className="space-y-8">
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

              <div className="flex items-center justify-center gap-6">
                <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all shadow-xl">
                  <GoogleIcon />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
