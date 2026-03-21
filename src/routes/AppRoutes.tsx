import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Dashboard, Transactions } from '../features/trading';
import { Login, Register } from '../features/auth';
import { Payments } from '../features/payments';
import { Settings } from '../features/settings';
import { Compliance } from '../features/compliance';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import LandingPage from '../features/landing/pages/LandingPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected app routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

