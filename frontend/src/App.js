import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
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

const TopBar = ({ onMenuClick }) => {
  const location = useLocation();
  const info = PAGE_TITLES[location.pathname] || PAGE_TITLES['/dashboard'];
  return (
    <div style={{
      height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', borderBottom: '1px solid var(--border-2)',
      background: 'var(--bg-base)', position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(16px)', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger — only on mobile */}
        <button onClick={onMenuClick} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 4, fontSize: 18 }} className="menu-btn">
          <i className="fas fa-bars" />
        </button>
        <div>
          <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{info.title}</span>
          <span style={{ color: 'var(--text-3)', fontSize: 13, marginLeft: 8 }} className="hide-xs">· {info.sub}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 3s infinite' }} />
        <span style={{ color: '#10b981', fontSize: 12, fontWeight: 500 }}>Live</span>
      </div>
    </div>
  );
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <style>{`
        @media(max-width:768px){
          .app-sidebar { transform: translateX(-100%) !important; }
          .app-sidebar.open { transform: translateX(0) !important; }
          .app-main { margin-left: 0 !important; }
          .app-main-content { padding: 16px !important; }
          .menu-btn { display: flex !important; }
          .hide-xs { display: none !important; }
        }
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, backdropFilter: 'blur(2px)' }} />
        )}
        <div className={`app-sidebar${sidebarOpen ? ' open' : ''}`} style={{ transition: 'transform 0.25s ease' }}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="app-main" style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="app-main-content" style={{ flex: 1, padding: '24px 32px', background: 'var(--page-bg)', transition: 'background 0.3s' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

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
