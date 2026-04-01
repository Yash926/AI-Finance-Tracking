import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: 'fas fa-chart-pie',
    color: '#6366f1',
    title: 'Smart Dashboard',
    desc: 'Real-time overview of your income, expenses, net balance, and savings rate with beautiful charts.',
  },
  {
    icon: 'fas fa-robot',
    color: '#8b5cf6',
    title: 'AI Financial Advisor',
    desc: 'Chat with Gemini AI about your finances. Get personalized advice based on your actual spending data.',
  },
  {
    icon: 'fas fa-chart-line',
    color: '#06b6d4',
    title: 'ML Predictions',
    desc: 'Linear regression on your past spending predicts next month\'s expenses per category automatically.',
  },
  {
    icon: 'fas fa-wallet',
    color: '#10b981',
    title: 'Budget Manager',
    desc: 'Set monthly limits per category. Get alerts at 80% and 100% so you never overspend.',
  },
  {
    icon: 'fas fa-exchange-alt',
    color: '#f59e0b',
    title: 'Transaction Tracking',
    desc: 'Add, edit, and filter income & expenses across 15 categories with date-based filtering.',
  },
  {
    icon: 'fas fa-shield-alt',
    color: '#f43f5e',
    title: 'Secure by Default',
    desc: 'Firebase Authentication and Firestore security rules ensure only you can access your data.',
  },
];

const STATS = [
  { value: '15+', label: 'Categories' },
  { value: 'AI', label: 'Powered Insights' },
  { value: 'ML', label: 'Expense Predictions' },
  { value: '100%', label: 'Private & Secure' },
];

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up in seconds with your email. No credit card required.' },
  { num: '02', title: 'Add Transactions', desc: 'Log your income and expenses with categories and dates.' },
  { num: '03', title: 'Get AI Insights', desc: 'Let Gemini AI analyze your spending and give personalized advice.' },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#07080f', color: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,8,15,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.12)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 14 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>FinSmart <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{ color: 'rgba(241,245,249,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#f1f5f9'}
            onMouseLeave={e => e.target.style.color = 'rgba(241,245,249,0.6)'}>
            Sign In
          </Link>
          <Link to="/register" style={{
            padding: '9px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#a5b4fc' }}>Powered by Google Gemini 2.0 Flash</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 24 }}>
            Your Personal{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Finance
            </span>
            {' '}Assistant
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(148,163,184,0.8)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            Track income & expenses, set smart budgets, chat with an AI advisor, and get ML-powered predictions — all in one beautiful dashboard.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontSize: 16, fontWeight: 700,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}>
              Start for Free <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
            </Link>
            <Link to="/login" style={{
              padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontSize: 16, fontWeight: 600,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <i className="fas fa-sign-in-alt" style={{ fontSize: 13 }} /> Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                <div style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
            Features
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Everything you need to manage money
          </h2>
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            A complete personal finance toolkit with AI at its core.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon, color, title, desc }) => (
            <div key={title}
              style={{
                padding: '28px', borderRadius: 18,
                background: 'rgba(17,18,32,0.8)',
                border: '1px solid rgba(99,102,241,0.1)',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                cursor: 'default', position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `${color}10`, filter: 'blur(20px)', pointerEvents: 'none' }} />
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: `0 4px 14px ${color}20` }}>
                <i className={icon} style={{ color, fontSize: 18 }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.65)', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 12, fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
            How it works
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 64 }}>
            Up and running in 3 steps
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} style={{ position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 28, left: 'calc(50% + 40px)', right: 'calc(-50% + 40px)', height: 1, background: 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(99,102,241,0.1))', display: window.innerWidth > 768 ? 'block' : 'none' }} />
                )}
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', fontSize: 18, fontWeight: 800, color: '#fff' }}>
                  {num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.65)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 20 }}>
            Take control of your{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              finances today
            </span>
          </h2>
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
            Join FinSmart AI and start making smarter financial decisions with the power of AI.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 36px', borderRadius: 14, textDecoration: 'none',
            fontSize: 17, fontWeight: 700,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', boxShadow: '0 8px 30px rgba(99,102,241,0.45)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.45)'; }}>
            Create Free Account <i className="fas fa-arrow-right" style={{ fontSize: 14 }} />
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(148,163,184,0.4)' }}>No credit card required · Free forever</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0d1117', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        {/* Main footer grid */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48 }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 13 }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>FinSmart AI</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(148,163,184,0.65)', lineHeight: 1.65, marginBottom: 24, maxWidth: 220 }}>
              Empowering your financial journey with AI-powered insights and smart budgeting.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: 'fab fa-github',   href: 'https://github.com/Yash926' },
                { icon: 'fab fa-linkedin', href: 'https://linkedin.com/in/yashtripathi12' },
                { icon: 'fab fa-twitter',  href: '#' },
                { icon: 'fab fa-instagram',href: '#' },
              ].map(({ icon, href }) => (
                <a key={icon} href={href} target="_blank" rel="noreferrer"
                  style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.6)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = 'rgba(148,163,184,0.6)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.18)'; }}>
                  <i className={icon} style={{ fontSize: 13 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, letterSpacing: '-0.01em' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Features',     href: '#features' },
                { label: 'How it Works', href: '#how' },
                { label: 'Sign In',      href: '/login' },
                { label: 'Register',     href: '/register' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} style={{ fontSize: 14, color: 'rgba(148,163,184,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                    onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,0.6)'}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, letterSpacing: '-0.01em' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
                <li key={label}>
                  <a href="#" style={{ fontSize: 14, color: 'rgba(148,163,184,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                    onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,0.6)'}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 20, letterSpacing: '-0.01em' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: 'fas fa-envelope', text: 'support@finsmart.ai' },
                { icon: 'fas fa-phone',    text: '+91 98765 43210' },
                { icon: 'fas fa-map-marker-alt', text: 'Lovely Professional University, Punjab, India' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <i className={icon} style={{ color: '#6366f1', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: 'rgba(148,163,184,0.65)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(99,102,241,0.08)', padding: '20px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.4)' }}>
            © {new Date().getFullYear()} FinSmart AI. All rights reserved. Made with ❤️ by Yash Tripathi
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
