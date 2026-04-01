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
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.message);
    } finally { setLoading(false); }
  };

  const fields = [
    { label: 'Email address', key: 'email', type: 'email', placeholder: 'you@example.com', icon: 'fas fa-envelope' },
    { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', icon: 'fas fa-lock' },
  ];

  const features = [
    { icon: 'fas fa-chart-pie',   text: 'Real-time spending analytics' },
    { icon: 'fas fa-robot',       text: 'AI insights powered by Gemini' },
    { icon: 'fas fa-shield-alt',  text: 'Secured with Firebase Auth' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--auth-bg)' }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 64px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0f0f23 0%, #13132b 60%, #07080f 100%)',
        borderRight: '1px solid rgba(16,185,129,0.1)',
      }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99,102,241,0.45)' }}>
              <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <div>
              <div style={{ color: '#f0fdf4', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>FinSmart AI</div>
              <div style={{ color: 'rgba(52,211,153,0.5)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Personal Finance</div>
            </div>
          </div>
          <h2 style={{ color: '#f1f5f9', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 20 }}>
            Your finances,<br /><span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>intelligently</span> managed.
          </h2>
          <p style={{ color: 'rgba(167,243,208,0.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 360, marginBottom: 48 }}>
            Track income and expenses, set budgets, and get AI-powered insights to make smarter financial decisions.
          </p>
          {features.map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={icon} style={{ color: '#a5b4fc', fontSize: 13 }} />
              </div>
              <span style={{ color: 'rgba(203,213,225,0.65)', fontSize: 14 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ color: 'var(--text-1)', fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 8 }}>Welcome back</h1>
            <p className="t-body">Sign in to your FinSmart AI account</p>
          </div>
          <form onSubmit={handleSubmit}>
            {fields.map(({ label, key, type, placeholder, icon }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label className="field-label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <i className={icon} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 13, pointerEvents: 'none' }} />
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder} required className="fin-input" style={{ paddingLeft: 42 }} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8, borderRadius: 12 }}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Signing in...</>
                : <>Sign In <i className="fas fa-arrow-right" style={{ fontSize: 12 }} /></>}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <span className="t-body">Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one free →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
