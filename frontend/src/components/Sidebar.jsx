import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { to: '/',             icon: 'fas fa-chart-pie',    label: 'Dashboard'    },
  { to: '/transactions', icon: 'fas fa-arrows-alt-h', label: 'Transactions' },
  { to: '/budget',       icon: 'fas fa-wallet',       label: 'Budget'       },
  { to: '/insights',     icon: 'fas fa-robot',        label: 'AI Insights'  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside style={{
      width: 260, position: 'fixed', top: 0, left: 0, height: '100vh',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--sidebar-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(5,150,105,0.45)',
          }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 15 }} />
          </div>
          <div>
            <div style={{ color: '#ecfdf5', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1 }}>FinSmart</div>
            <div style={{ color: '#059669', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', marginTop: 2 }}>AI FINANCE</div>
          </div>
        </div>
      </div>

      {/* User */}
      {user && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, #059669, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 12,
              boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ color: '#ecfdf5', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ color: 'rgba(110,231,183,0.4)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', flexShrink: 0, boxShadow: '0 0 6px #10b981' }} />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <p style={{ color: 'rgba(110,231,183,0.25)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px 10px' }}>Menu</p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none',
              background: isActive ? 'rgba(5,150,105,0.18)' : 'transparent',
              color: isActive ? '#6ee7b7' : 'rgba(110,231,183,0.35)',
              fontWeight: isActive ? 600 : 400, fontSize: 13.5,
              border: `1px solid ${isActive ? 'rgba(5,150,105,0.3)' : 'transparent'}`,
              transition: 'all 0.15s',
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'rgba(5,150,105,0.25)' : 'rgba(255,255,255,0.04)',
                  transition: 'all 0.15s',
                }}>
                  <i className={icon} style={{ fontSize: 12, color: isActive ? '#34d399' : 'rgba(110,231,183,0.3)' }} />
                </div>
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#059669', boxShadow: '0 0 6px #059669' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--sidebar-border)' }}>
        <button onClick={toggle} className="theme-toggle">
          <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`} style={{ fontSize: 12 }} />
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="btn btn-ghost btn-full"
          style={{ fontSize: 13, color: 'rgba(110,231,183,0.3)', borderColor: 'rgba(5,150,105,0.15)', justifyContent: 'flex-start', gap: 10 }}>
          <i className="fas fa-sign-out-alt" style={{ fontSize: 12 }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
