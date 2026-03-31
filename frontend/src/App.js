import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
    <Sidebar />
    <main style={{
      flex: 1, marginLeft: 260, padding: '36px 40px',
      minHeight: '100vh', background: 'var(--page-bg)',
      transition: 'background 0.25s ease',
      maxWidth: 'calc(100vw - 260px)',
    }}>
      {children}
    </main>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><AppLayout><Transactions /></AppLayout></PrivateRoute>} />
      <Route path="/budget"   element={<PrivateRoute><AppLayout><Budget /></AppLayout></PrivateRoute>} />
      <Route path="/insights" element={<PrivateRoute><AppLayout><Insights /></AppLayout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
