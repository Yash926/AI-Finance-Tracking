import React from 'react';

export default function StatCard({ title, value, icon, color, subtitle, trend }) {
  return (
    <div className="card card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100, borderRadius: '50%',
        background: `${color}14`, filter: 'blur(24px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="t-label" style={{ marginBottom: 10 }}>{title}</p>
          <div style={{
            fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-1)',
            letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8,
          }}>
            {value}
          </div>
          {subtitle && (
            <p className="t-small" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {trend === 'up'   && <span style={{ color: 'var(--success)', fontSize: 9 }}>▲</span>}
              {trend === 'down' && <span style={{ color: 'var(--danger)',  fontSize: 9 }}>▼</span>}
              {subtitle}
            </p>
          )}
        </div>

        <div className="icon-box icon-box-md" style={{ background: `${color}14`, border: `1px solid ${color}28`, flexShrink: 0 }}>
          <i className={icon} style={{ color, fontSize: 17 }} />
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2, borderRadius: '0 0 16px 16px',
        background: `linear-gradient(90deg, ${color}60, transparent)`,
      }} />
    </div>
  );
}
