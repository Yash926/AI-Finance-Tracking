import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: 'fas fa-chart-line', label: 'Smart Analytics', color: '#059669' },
  { icon: 'fas fa-robot',      label: 'AI Insights',     color: '#0d9488' },
  { icon: 'fas fa-shield-alt', label: 'Bank-grade Security', color: '#0891b2' },
];

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
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--auth-bg)', padding: 24 }}>
      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: '5%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(5,150,105,0.4)',
          }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <h1 className="t-display" style={{ fontSize: '1.875rem', marginBottom: 8 }}>Welcome back</h1>
          <p className="t-body">Sign in to your FinSmart AI account</p>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {FEATURES.map(({ icon, label, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 99,
              background: 'var(--bg-card)', border: '1px solid var(--border-1)',
              fontSize: 12, fontWeight: 500, color: 'var(--text-2)',
            }}>
              <i className={icon} style={{ color, fontSize: 11 }} />
              {label}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card card-lg" style={{ boxShadow: 'var(--shadow-lg)', borderColor: 'var(--border-1)' }}>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com', icon: 'fas fa-envelope' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', icon: 'fas fa-lock' },
            ].map(({ label, key, type, placeholder, icon }) => (
              <div key={key} style={{ marginBottom: 18 }}>
                <label className="field-label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <i className={icon} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 13, pointerEvents: 'none' }} />
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder} required className="fin-input" style={{ paddingLeft: 40 }} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Signing in...</> : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="t-body" style={{ textAlign: 'center', marginTop: 20 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one free →</Link>
        </p>
      </div>
    </div>
  );
}
