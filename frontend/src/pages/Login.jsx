import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    }}>
      <div style={{
        background: 'rgba(22,33,62,0.9)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
        padding: '40px', width: '100%', maxWidth: '420px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: '26px' }} />
          </div>
          <h2 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '4px' }}>FinSmart AI</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Intelligent Personal Finance Assistant</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••" required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4cc9f0', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
