import React from 'react';

export default function StatCard({ title, value, icon, color, subtitle, trend }) {
  return (
    <div className="stat-card anim-fade-up" style={{ '--accent-color': color }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 120, height: 120,
        borderRadius: '50%', background: `${color}10`, filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="t-label" style={{ marginBottom: 12 }}>{title}</p>
          <div style={{
            fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-1)',
            letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 10,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {trend === 'up'   && <span style={{ color: '#10b981', fontSize: 10, fontWeight: 700 }}>▲</span>}
              {trend === 'down' && <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 700 }}>▼</span>}
              <span className="t-small">{subtitle}</span>
            </div>
          )}
        </div>

        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${color}15`,
          border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${color}20`,
        }}>
          <i className={icon} style={{ color, fontSize: 18 }} />
        </div>
      </div>
    </div>
  );
}
