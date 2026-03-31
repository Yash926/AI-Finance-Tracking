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
      navigate('/');
    } catch (err) {
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email already registered' : err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--auth-bg)', padding: 24 }}>
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 18px',
            background: 'linear-gradient(135deg, #635bff, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,91,255,0.35)',
          }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <h1 className="t-display" style={{ fontSize: '1.75rem', marginBottom: 6 }}>Create account</h1>
          <p className="t-body">Start your financial journey with FinSmart AI</p>
        </div>

        <div className="card card-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ label, key, type, placeholder, icon }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label className="field-label">{label}</label>
                <div style={{ position: 'relative' }}>
                  <i className={icon} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 12, pointerEvents: 'none' }} />
                  <input type={type} placeholder={placeholder} required value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="fin-input" style={{ paddingLeft: 40 }} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ marginTop: 12 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Creating...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="t-body" style={{ textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
