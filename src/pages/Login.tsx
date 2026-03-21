import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from '../components/Icons';
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-inter selection:bg-[#FCD535] selection:text-[#060E1E]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/image.png" alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#060E1E]/85 backdrop-blur-sm"></div>
      </div>

      {/* Background Shapes */}
      <div className="absolute top-[10%] left-[45%] w-[400px] h-[400px] bg-[#FCD535]/10 rounded-full blur-[120px] animate-pulse z-1"></div>
      <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700 z-1"></div>
      
      {/* Decorative Line */}
      <div className="absolute left-[330px] top-[550px] w-[561px] h-[1px] bg-gradient-to-r from-white/20 to-transparent hidden lg:block z-1"></div>

      <div className="container mx-auto px-12 h-screen flex flex-col lg:flex-row items-center relative z-10">
        {/* Left Side - Welcome Text */}
        <div className="hidden lg:flex lg:w-3/5 flex-col items-start gap-12">
          <div className="space-y-4">
             <motion.div 
               initial={{ scale: 0, opacity: 0, rotate: -20 }}
               animate={{ scale: 1, opacity: 1, rotate: 0 }}
               transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
               className="w-28 h-28 bg-[#0D1F3C]/90 border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(252,213,53,0.2)] mb-12 relative group overflow-hidden"
             >
                <div className="absolute inset-0 bg-white/5 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src="/logo.png" alt="KuriPay" className="w-full h-full object-cover rounded-full relative z-10 scale-110" />
             </motion.div>
             <motion.h1 
               initial={{ x: -50, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
               className="text-[120px] font-black text-white leading-[0.9] tracking-tighter"
             >
               Welcome<br />Back .!
             </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="border-4 border-white px-8 py-5 group cursor-default"
          >
            <p className="text-4xl font-bold italic text-white tracking-widest uppercase transition-all group-hover:tracking-[0.1em]">
               Skip the lag ?
            </p>
          </motion.div>
        </div>

        {/* Right Side - Glassmorphic Login Card */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 80, delay: 0.6 }}
          className="w-full lg:w-2/5 flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-[480px] bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[32px] p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] relative overflow-hidden group">
            {/* Inner highlights */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tight">Login</h2>
                <p className="text-[#6B8CAE] font-medium">Glad you’re back.!</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-6">
                  {/* Custom Carey-style input */}
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-transparent border border-white/30 rounded-2xl px-6 py-5 text-lg text-white font-medium outline-none focus:border-white transition-all placeholder:text-white/30"
                    />
                  </div>

                  <div className="relative group/field">
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
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="flex items-center cursor-pointer group/check">
                      <div className="relative">
                        <input type="checkbox" className="peer hidden" />
                        <div className="w-5 h-5 border border-white/30 rounded bg-white/5 peer-checked:bg-white peer-checked:border-white flex items-center justify-center transition-all">
                          <svg className="w-3.5 h-3.5 text-[#060E1E] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-white/70 group-hover/check:text-white transition-colors">Remember me</span>
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
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
                    style={{ background: "linear-gradient(94.12deg, #628EFF 9.91%, #8740CD 53.29%, #580475 91.56%)" }}
                    className="w-full h-[72px] rounded-2xl font-black text-xl text-white shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center overflow-hidden relative group/btn"
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-colors"></div>
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                         Logging in...
                      </div>
                    ) : 'Login'}
                  </button>
                  <p className="text-center">
                    <Link to="#" className="text-sm font-medium text-white hover:underline underline-offset-4">
                      Forgot password ?
                    </Link>
                  </p>
                </div>
              </form>

              <div className="space-y-8">
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-medium">
                    <span className="px-6 bg-[#161a25]/0 text-[#4d4d4d] backdrop-blur-xl">Or</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  {/* Google */}
                  <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all group/social shadow-xl">
                    <GoogleIcon />
                  </button>
                  {/* Facebook - simplified SVG */}
                  <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all group/social shadow-xl">
                    <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  {/* Github */}
                  <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all group/social shadow-xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="pt-8 space-y-4 text-center">
                 <p className="text-white font-medium">
                   Don’t have an account ? <Link to="#" className="text-[#8740CD] font-bold hover:underline">Signup</Link>
                 </p>
                 <div className="flex items-center justify-center gap-6 text-[11px] font-medium text-white/40">
                   <Link to="#" className="hover:text-white">Terms & Conditions</Link>
                   <Link to="#" className="hover:text-white">Support</Link>
                   <Link to="#" className="hover:text-white">Customer Care</Link>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
      `}} />
    </div>
  );
}
