import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Insights from './pages/Insights';

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Layout with sidebar
const AppLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <main style={{ flex: 1, marginLeft: '250px', padding: '24px', overflowY: 'auto' }}>
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
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout><Dashboard /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/transactions" element={
        <PrivateRoute>
          <AppLayout><Transactions /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/budget" element={
        <PrivateRoute>
          <AppLayout><Budget /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/insights" element={
        <PrivateRoute>
          <AppLayout><Insights /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </AuthProvider>
  );
}
