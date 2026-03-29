import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',             icon: 'fas fa-tachometer-alt', label: 'Dashboard'    },
  { to: '/transactions', icon: 'fas fa-exchange-alt',   label: 'Transactions' },
  { to: '/budget',       icon: 'fas fa-wallet',         label: 'Budget'       },
  { to: '/insights',     icon: 'fas fa-robot',          label: 'AI Insights'  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{
      width: '250px', position: 'fixed', top: 0, left: 0, height: '100vh',
      background: 'linear-gradient(180deg, #0f3460 0%, #16213e 100%)',
      display: 'flex', flexDirection: 'column', padding: '0',
      borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: '18px' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px', lineHeight: 1 }}>FinSmart</div>
            <div style={{ color: '#4cc9f0', fontSize: '11px', letterSpacing: '1px' }}>AI FINANCE</div>
          </div>
        </div>
      </div>

      {/* User Badge */}
      {user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4361ee, #7209b7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '14px',
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px' }}>{user.name}</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '10px', marginBottom: '4px',
              textDecoration: 'none', transition: 'all 0.2s',
              background: isActive ? 'rgba(67,97,238,0.3)' : 'transparent',
              color: isActive ? '#4cc9f0' : '#94a3b8',
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? '3px solid #4361ee' : '3px solid transparent',
            })}
          >
            <i className={icon} style={{ width: 18, textAlign: 'center' }} />
            <span style={{ fontSize: '14px' }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '11px 16px', borderRadius: '10px',
            background: 'rgba(239,35,60,0.1)', border: '1px solid rgba(239,35,60,0.3)',
            color: '#ef233c', cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '10px', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,35,60,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239,35,60,0.1)'}
        >
          <i className="fas fa-sign-out-alt" />
          Logout
        </button>
      </div>
    </div>
  );
}
