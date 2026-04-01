import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const FIELDS = [
  { label: 'Full Name',        key: 'name',     type: 'text',     placeholder: 'John Doe',          icon: 'fas fa-user' },
  { label: 'Email Address',    key: 'email',    type: 'email',    placeholder: 'you@example.com',   icon: 'fas fa-envelope' },
  { label: 'Password',         key: 'password', type: 'password', placeholder: 'Min. 6 characters', icon: 'fas fa-lock' },
  { label: 'Confirm Password', key: 'confirm',  type: 'password', placeholder: 'Re-enter password', icon: 'fas fa-check' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email already registered' : err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--auth-bg)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '10%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, margin: '0 auto 18px', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(99,102,241,0.45)' }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <h1 style={{ color: 'var(--text-1)', fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 8 }}>Create account</h1>
          <p className="t-body">Start your financial journey with FinSmart AI</p>
        </div>

        <div className="card card-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ label, key, type, placeholder, icon }) => (
              <div key={key} style={{ marginBottom: 18 }}>
                <label className="field-label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <i className={icon} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 12, pointerEvents: 'none' }} />
                  <input type={type} placeholder={placeholder} required value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="fin-input" style={{ paddingLeft: 42 }} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 12, borderRadius: 12 }}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Creating...</>
                : 'Create Account'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span className="t-body">Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </div>
      </div>
    </div>
  );
}
