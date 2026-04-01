import React from 'react';

/**
 * FinSmart AI Logo
 * A professional SVG mark — rising chart line forming an "F" shape
 * with a circular gradient background
 */
export default function Logo({ size = 36, showText = false, textColor = '#fff', dark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      {/* SVG Mark */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          <linearGradient id="line-grad" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background rounded square */}
        <rect width="40" height="40" rx="10" fill="url(#bg-grad)" />

        {/* Subtle inner highlight */}
        <rect width="40" height="40" rx="10" fill="url(#bg-grad)" opacity="0.3" />
        <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />

        {/* Bar chart columns */}
        <rect x="7" y="22" width="4" height="11" rx="1.5" fill="rgba(255,255,255,0.25)" />
        <rect x="13" y="17" width="4" height="16" rx="1.5" fill="rgba(255,255,255,0.35)" />
        <rect x="19" y="13" width="4" height="20" rx="1.5" fill="rgba(255,255,255,0.45)" />
        <rect x="25" y="8" width="4" height="25" rx="1.5" fill="rgba(255,255,255,0.6)" />

        {/* Rising trend line on top */}
        <polyline
          points="7,24 13,19 19,15 25,10 33,6"
          stroke="url(#line-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        />

        {/* Arrow tip at end of line */}
        <circle cx="33" cy="6" r="2.5" fill="#f97316" filter="url(#glow)" />
      </svg>

      {/* Optional wordmark */}
      {showText && (
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em', lineHeight: 1, color: textColor }}>
            FinSmart <span style={{ color: '#f97316' }}>AI</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2, color: dark ? 'rgba(8,145,178,0.8)' : 'rgba(255,255,255,0.5)' }}>
            Finance
          </div>
        </div>
      )}
    </div>
  );
}
