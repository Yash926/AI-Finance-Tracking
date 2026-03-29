import React from 'react';

export default function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '20px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
          <h3 style={{ color: '#e2e8f0', fontSize: '26px', fontWeight: 700, margin: 0 }}>{value}</h3>
          {subtitle && <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{subtitle}</p>}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '12px',
          background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className={icon} style={{ color, fontSize: '20px' }} />
        </div>
      </div>
    </div>
  );
}
