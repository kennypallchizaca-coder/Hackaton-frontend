import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './features/auth/store/authStore';
import './App.css';

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-blue-500 selection:text-white font-sans text-slate-50">
      <AppRoutes />
    </div>
  );
}

export default App;
