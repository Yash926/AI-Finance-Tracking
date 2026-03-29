import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
      });
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)',
    color: '#e2e8f0', fontSize: '14px', outline: 'none',
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
          <h2 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '4px' }}>Create Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Join FinSmart AI today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
            { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Re-enter password' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>{label}</label>
              <input
                type={type} placeholder={placeholder} required
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={inputStyle}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginTop: '8px',
          }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4cc9f0', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
