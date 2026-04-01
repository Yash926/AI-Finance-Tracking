import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Insights from './pages/Insights';
import Landing from './pages/Landing';

const PAGE_TITLES = {
  '/dashboard':    { title: 'Dashboard',    sub: 'Your financial overview' },
  '/transactions': { title: 'Transactions', sub: 'Manage income & expenses' },
  '/budget':       { title: 'Budget',       sub: 'Monthly spending limits' },
  '/insights':     { title: 'AI Insights',  sub: 'Powered by Gemini' },
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const TopBar = () => {
  const location = useLocation();
  const info = PAGE_TITLES[location.pathname] || PAGE_TITLES['/dashboard'];
  return (
    <div style={{
      height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', borderBottom: '1px solid var(--border-2)',
      background: 'var(--bg-base)', position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(16px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{info.title}</span>
        <span style={{ color: 'var(--text-3)', fontSize: 13 }}>·</span>
        <span style={{ color: 'var(--text-3)', fontSize: 13 }}>{info.sub}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 3s infinite' }} />
        <span style={{ color: '#10b981', fontSize: 12, fontWeight: 500 }}>Live</span>
      </div>
    </div>
  );
};

const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
    <Sidebar />
    <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <main style={{
        flex: 1, padding: '32px 40px',
        background: 'var(--page-bg)',
        transition: 'background 0.3s',
      }}>
        {children}
      </main>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"             element={<Landing />} />
      <Route path="/login"        element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register"     element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard"    element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><AppLayout><Transactions /></AppLayout></PrivateRoute>} />
      <Route path="/budget"       element={<PrivateRoute><AppLayout><Budget /></AppLayout></PrivateRoute>} />
      <Route path="/insights"     element={<PrivateRoute><AppLayout><Insights /></AppLayout></PrivateRoute>} />
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const ThemedApp = () => {
  const { theme } = useTheme();
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} theme={theme} />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
