import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

const NAV = [
  { to: '/dashboard',    icon: 'fas fa-chart-pie',    label: 'Dashboard',    sub: 'Overview' },
  { to: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transactions', sub: 'History' },
  { to: '/budget',       icon: 'fas fa-wallet',       label: 'Budget',       sub: 'Limits' },
  { to: '/insights',     icon: 'fas fa-robot',        label: 'AI Insights',  sub: 'Gemini' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside style={{
      width: 260, position: 'fixed', top: 0, left: 0, height: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      overflowY: 'auto',
    }}>

      {/* Logo */}
      <div style={{ padding: '22px 20px 18px' }}>
        <Logo size={38} showText textColor="#f1f5f9" />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '0 16px' }} />

      {/* User card */}
      {user && (
        <div style={{ margin: '16px 14px', padding: '12px 14px', borderRadius: 14, background: 'rgba(8,145,178,0.07)', border: '1px solid rgba(8,145,178,0.14)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #0891b2, #0e7490)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13,
              boxShadow: '0 2px 8px rgba(8,145,178,0.4)',
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ color: 'rgba(148,163,184,0.5)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{user.email}</div>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 3s infinite', flexShrink: 0 }} />
          </div>
        </div>
      )}

      {/* Nav section label */}
      <div style={{ padding: '8px 22px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(167,243,208,0.2)' }}>
        Navigation
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 10px 12px' }}>
        {NAV.map(({ to, icon, label, sub }) => {
          const isActive = to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} end={to === '/'}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 12, marginBottom: 3,
                textDecoration: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(8,145,178,0.18), rgba(14,116,144,0.1))' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(8,145,178,0.25)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? 'rgba(8,145,178,0.22)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(8,145,178,0.3)' : 'rgba(255,255,255,0.04)'}`,
                transition: 'all 0.2s',
              }}>
                <i className={icon} style={{ fontSize: 13, color: isActive ? '#7dd3fc' : 'rgba(148,163,184,0.35)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: isActive ? '#bae6fd' : 'rgba(148,163,184,0.5)', fontWeight: isActive ? 600 : 400, fontSize: 13.5, lineHeight: 1 }}>{label}</div>
                <div style={{ color: isActive ? 'rgba(125,211,252,0.5)' : 'rgba(148,163,184,0.2)', fontSize: 10.5, marginTop: 2 }}>{sub}</div>
              </div>
              {isActive && (
                <div style={{ width: 4, height: 20, borderRadius: 99, background: 'linear-gradient(180deg,#0891b2,#0e7490)', flexShrink: 0, boxShadow: '0 0 10px rgba(8,145,178,0.7)' }} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid var(--sidebar-border)' }}>
        <button onClick={toggle} className="theme-toggle" style={{ marginBottom: 6 }}>
          <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`} style={{ fontSize: 12 }} />
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)',
            background: 'rgba(239,68,68,0.05)', color: 'rgba(248,113,113,0.5)',
            cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.12)'; }}
        >
          <i className="fas fa-sign-out-alt" style={{ fontSize: 12 }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
