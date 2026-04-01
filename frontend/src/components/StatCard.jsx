import React from 'react';

const GRADIENTS = {
  '#10b981': 'linear-gradient(135deg, #10b981, #14b8a6)',
  '#f43f5e': 'linear-gradient(135deg, #f43f5e, #fb923c)',
  '#6366f1': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  '#f59e0b': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  '#0d9488': 'linear-gradient(135deg, #0d9488, #06b6d4)',
  '#059669': 'linear-gradient(135deg, #059669, #10b981)',
};

export default function StatCard({ title, value, icon, color, subtitle, trend }) {
  const grad = GRADIENTS[color] || `linear-gradient(135deg, ${color}, ${color}cc)`;

  return (
    <div className="stat-card anim-fade-up" style={{ '--accent-color': grad }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 140, height: 140,
        borderRadius: '50%', background: `${color}12`, filter: 'blur(35px)',
        pointerEvents: 'none', transition: 'all 0.3s',
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
              {trend === 'down' && <span style={{ color: '#f43f5e', fontSize: 10, fontWeight: 700 }}>▼</span>}
              <span className="t-small">{subtitle}</span>
            </div>
          )}
        </div>

        <div style={{
          width: 46, height: 46, borderRadius: 13, flexShrink: 0,
          background: grad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 16px ${color}35`,
          transition: 'transform 0.25s, box-shadow 0.25s',
        }}>
          <i className={icon} style={{ color: '#fff', fontSize: 18 }} />
        </div>
      </div>
    </div>
  );
}
