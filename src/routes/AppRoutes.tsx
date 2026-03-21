import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { Payments } from '../pages/Payments';
import { Transactions } from '../pages/Transactions';
import { Stores } from '../pages/Stores';
import { Settings } from '../pages/Settings';
import { Compliance } from '../pages/Compliance';
import { GenLayer } from '../pages/GenLayer';
import { AIInsights } from '../pages/AIInsights';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="stores" element={<Stores />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="genlayer" element={<GenLayer />} />
          {/* Fixed: analytics route now correctly maps to AIInsights */}
          <Route path="analytics" element={<AIInsights />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
