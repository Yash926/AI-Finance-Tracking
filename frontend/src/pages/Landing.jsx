import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Scroll animation hook ─────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Section({ children, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease', ...style }}>
      {children}
    </div>
  );
}

/* ── Data ──────────────────────────────────────────────── */
const FEATURES = [
  { icon: 'fas fa-robot',        color: '#6366f1', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', title: 'AI Financial Insights',  desc: 'Gemini 2.0 Flash analyzes your spending patterns and delivers personalized, actionable financial advice every month.' },
  { icon: 'fas fa-exchange-alt', color: '#06b6d4', grad: 'linear-gradient(135deg,#06b6d4,#6366f1)', title: 'Expense Tracking',        desc: 'Log income and expenses across 15 categories. Filter by date, type, and category with instant totals.' },
  { icon: 'fas fa-bell',         color: '#f59e0b', grad: 'linear-gradient(135deg,#f59e0b,#f43f5e)', title: 'Smart Budget Alerts',     desc: 'Set monthly limits per category. Get warned at 80% and alerted at 100% before you overspend.' },
  { icon: 'fas fa-chart-pie',    color: '#10b981', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', title: 'Smart Dashboard',         desc: 'Beautiful doughnut and line charts give you a real-time snapshot of your financial health at a glance.' },
  { icon: 'fas fa-chart-line',   color: '#a855f7', grad: 'linear-gradient(135deg,#a855f7,#6366f1)', title: 'ML Predictions',          desc: 'Linear regression on your past data predicts next month\'s expenses per category automatically.' },
  { icon: 'fas fa-shield-alt',   color: '#f43f5e', grad: 'linear-gradient(135deg,#f43f5e,#a855f7)', title: 'Secure Authentication',   desc: 'Firebase Auth with email/password. Firestore security rules ensure only you can access your data.' },
];

const STEPS = [
  { num: '01', icon: 'fas fa-plus-circle',  color: '#6366f1', title: 'Add Your Expenses',    desc: 'Log transactions in seconds. Choose from 15 categories, add notes, and pick the date.' },
  { num: '02', icon: 'fas fa-brain',        color: '#8b5cf6', title: 'Analyze with AI',       desc: 'Our Gemini-powered engine reads your data and identifies trends, risks, and opportunities.' },
  { num: '03', icon: 'fas fa-lightbulb',    color: '#a855f7', title: 'Get Smart Insights',    desc: 'Receive personalized advice, budget alerts, and ML predictions tailored to your habits.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',   role: 'Software Engineer',    avatar: 'PS', text: 'FinSmart AI helped me cut my food expenses by 30% in just two months. The AI insights are incredibly accurate.' },
  { name: 'Rahul Verma',    role: 'Freelance Designer',   avatar: 'RV', text: 'The budget alerts saved me from overspending three times last month. Best finance app I\'ve used.' },
  { name: 'Ananya Gupta',   role: 'MBA Student',          avatar: 'AG', text: 'The ML predictions are surprisingly accurate. It predicted my rent spike before I even remembered it was due.' },
];

const TECH = [
  { icon: 'fab fa-react',  label: 'React 19' },
  { icon: 'fas fa-fire',   label: 'Firebase' },
  { icon: 'fas fa-robot',  label: 'Gemini AI' },
  { icon: 'fas fa-server', label: 'Node.js' },
  { icon: 'fas fa-chart-bar', label: 'Chart.js' },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const S = { color: 'rgba(148,163,184,0.65)', fontSize: 14, lineHeight: 1.7 };
  const H4 = { fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 18, letterSpacing: '-0.01em' };
  const pill = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', fontSize: 12, fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 };

  return (
    <div style={{ background: '#07080f', color: '#f1f5f9', fontFamily: "'Inter',-apple-system,sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        *{box-sizing:border-box}
        a{transition:all .2s}
        @media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr!important}.hero-btns{flex-direction:column;align-items:center}.steps-grid{grid-template-columns:1fr!important}.feat-grid{grid-template-columns:1fr!important}.testi-grid{grid-template-columns:1fr!important}}
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, padding: '0 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(7,8,15,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(99,102,241,0.1)' : 'none', transition: 'all .3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,.45)' }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 14 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>FinSmart <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/login" style={{ padding: '8px 18px', borderRadius: 9, color: 'rgba(241,245,249,.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
            onMouseEnter={e => e.target.style.color = '#f1f5f9'} onMouseLeave={e => e.target.style.color = 'rgba(241,245,249,.65)'}>Sign In</Link>
          <Link to="/register" style={{ padding: '9px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 4px 14px rgba(99,102,241,.35)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,.35)'; }}>Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 5% 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Animated gradient mesh */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)', pointerEvents: 'none', animation: 'float 10s ease-in-out infinite reverse' }} />

        <div style={{ maxWidth: 800, position: 'relative' }}>
          <div style={{ ...pill }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'pulse 2s infinite' }} />
            Powered by Google Gemini 2.0 Flash
          </div>

          <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: 24 }}>
            AI-Powered Smart<br />
            <span style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 40%,#a855f7 70%,#06b6d4 100%)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradShift 4s ease infinite' }}>
              Finance Management
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(148,163,184,0.8)', lineHeight: 1.75, maxWidth: 580, margin: '0 auto 44px' }}>
            Track every rupee, set smart budgets, chat with an AI advisor, and get ML-powered predictions — all in one beautiful, secure dashboard.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/register" style={{ padding: '15px 36px', borderRadius: 13, textDecoration: 'none', fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 6px 24px rgba(99,102,241,.45)', display: 'inline-flex', alignItems: 'center', gap: 9 }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(99,102,241,.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,.45)'; }}>
              Get Started Free <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
            </Link>
            <Link to="/login" style={{ padding: '15px 36px', borderRadius: 13, textDecoration: 'none', fontSize: 16, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#f1f5f9', display: 'inline-flex', alignItems: 'center', gap: 9 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              <i className="fas fa-sign-in-alt" style={{ fontSize: 13 }} /> View Demo
            </Link>
          </div>

          {/* Mock dashboard preview */}
          <div style={{ background: 'rgba(17,18,32,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)', backdropFilter: 'blur(20px)', maxWidth: 720, margin: '0 auto' }}>
            {/* Fake browser bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
              {['#f43f5e','#f59e0b','#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <div style={{ flex: 1, height: 24, borderRadius: 6, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)' }}>app.finsmart.ai/dashboard</span>
              </div>
            </div>
            {/* Fake stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Income', val: '₹52,000', color: '#10b981' },
                { label: 'Expenses', val: '₹31,400', color: '#f43f5e' },
                { label: 'Balance', val: '₹20,600', color: '#6366f1' },
                { label: 'Savings', val: '39.6%', color: '#f59e0b' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{val}</div>
                </div>
              ))}
            </div>
            {/* Fake chart bars */}
            <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
              {[40,65,45,80,55,70,90,60,75,50,85,95].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i % 2 === 0 ? 'linear-gradient(180deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,0.2)', transition: 'height .3s' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 5%', background: 'rgba(99,102,241,0.02)', borderTop: '1px solid rgba(99,102,241,0.07)' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={pill}>Features</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16 }}>Everything you need to master money</h2>
            <p style={{ ...S, maxWidth: 480, margin: '0 auto', fontSize: 16 }}>A complete AI-powered finance toolkit built for modern users.</p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
            {FEATURES.map(({ icon, color, grad, title, desc }) => (
              <div key={title} style={{ padding: 28, borderRadius: 18, background: 'rgba(17,18,32,0.8)', border: '1px solid rgba(99,102,241,0.1)', position: 'relative', overflow: 'hidden', transition: 'all .25s cubic-bezier(.34,1.56,.64,1)', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = `${color}45`; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,.4), 0 0 0 1px ${color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${color}12`, filter: 'blur(24px)', pointerEvents: 'none' }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: `0 6px 18px ${color}30` }}>
                  <i className={icon} style={{ color: '#fff', fontSize: 19 }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ ...S }}>{desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how" style={{ padding: '100px 5%' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={pill}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16 }}>Up and running in 3 simple steps</h2>
            <p style={{ ...S, maxWidth: 440, margin: '0 auto', fontSize: 16 }}>No complex setup. Start tracking your finances in minutes.</p>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, maxWidth: 900, margin: '0 auto', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 36, left: '16.5%', right: '16.5%', height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)', opacity: 0.3, borderRadius: 99 }} />
            {STEPS.map(({ num, icon, color, title, desc }) => (
              <div key={num} style={{ textAlign: 'center', padding: '32px 24px', borderRadius: 20, background: 'rgba(17,18,32,0.7)', border: '1px solid rgba(99,102,241,0.12)', position: 'relative', transition: 'all .25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg,${color},${color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 24px ${color}35` }}>
                  <i className={icon} style={{ color: '#fff', fontSize: 24 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Step {num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ ...S, fontSize: 14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── AI HIGHLIGHT ───────────────────────────────────── */}
      <section style={{ padding: '100px 5%', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid rgba(99,102,241,0.07)', borderBottom: '1px solid rgba(99,102,241,0.07)' }}>
        <Section>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={pill}>AI Intelligence</div>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 1.2 }}>
                Your personal AI<br />financial advisor
              </h2>
              <p style={{ ...S, fontSize: 16, marginBottom: 32 }}>
                Ask anything about your finances. FinSmart AI has full context of your transactions, budgets, and spending patterns — and responds with specific, data-driven advice.
              </p>
              {[
                'Month-over-month spending analysis',
                'Category-wise budget recommendations',
                'ML-powered next month predictions',
                'Conversational chat with memory',
              ].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fas fa-check" style={{ color: '#6366f1', fontSize: 10 }} />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(203,213,225,0.8)' }}>{f}</span>
                </div>
              ))}
            </div>
            {/* AI chat mockup */}
            <div style={{ background: 'rgba(17,18,32,0.9)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 20, padding: 24, boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-robot" style={{ color: '#fff', fontSize: 14 }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>FinSmart AI Advisor</div>
                  <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} /> Online
                  </div>
                </div>
              </div>
              {[
                { role: 'user', text: "How did I do this month?" },
                { role: 'ai',   text: "You spent ₹31,400 this month — 20% more on Food (₹8,200) compared to last month. Your savings rate is 39.6%, which is excellent! I'd suggest reducing dining out by ₹2,000 to hit your 45% savings goal." },
                { role: 'user', text: "What will my expenses be next month?" },
                { role: 'ai',   text: "Based on your 4-month trend, I predict ₹33,100 in expenses next month. Food and Transport are trending upward. Consider setting a ₹7,500 food budget." },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(99,102,241,0.08)', border: m.role === 'ai' ? '1px solid rgba(99,102,241,0.15)' : 'none', fontSize: 13, lineHeight: 1.6, color: m.role === 'user' ? '#fff' : 'rgba(203,213,225,0.85)' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', paddingLeft: 14 }}>
                  <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.4)' }}>Ask about your finances...</span>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-paper-plane" style={{ color: '#fff', fontSize: 13 }} />
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section style={{ padding: '100px 5%' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={pill}>Testimonials</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 16 }}>Loved by users</h2>
            <p style={{ ...S, maxWidth: 400, margin: '0 auto', fontSize: 16 }}>See what people are saying about FinSmart AI.</p>
          </div>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
            {TESTIMONIALS.map(({ name, role, avatar, text }) => (
              <div key={name} style={{ padding: 28, borderRadius: 18, background: 'rgba(17,18,32,0.8)', border: '1px solid rgba(99,102,241,0.1)', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star" style={{ color: '#f59e0b', fontSize: 13 }} />)}
                </div>
                <p style={{ ...S, fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── TECH STACK ─────────────────────────────────────── */}
      <section style={{ padding: '60px 5%', borderTop: '1px solid rgba(99,102,241,0.07)' }}>
        <Section>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Built with modern technologies</p>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {TECH.map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.14)', fontSize: 14, fontWeight: 500, color: 'rgba(203,213,225,0.7)', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.14)'; e.currentTarget.style.color = '#a5b4fc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.07)'; e.currentTarget.style.color = 'rgba(203,213,225,0.7)'; }}>
                <i className={icon} style={{ fontSize: 15 }} /> {label}
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ padding: '120px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Section style={{ position: 'relative' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: 20, lineHeight: 1.1 }}>
              Take control of your<br />
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>finances today</span>
            </h2>
            <p style={{ ...S, fontSize: 17, marginBottom: 44 }}>Join FinSmart AI and start making smarter financial decisions with the power of AI and machine learning.</p>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 14, textDecoration: 'none', fontSize: 17, fontWeight: 700, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 8px 32px rgba(99,102,241,.5)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(99,102,241,.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,.5)'; }}>
              Get Started Now <i className="fas fa-arrow-right" style={{ fontSize: 14 }} />
            </Link>
            <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(148,163,184,0.35)' }}>Free forever · No credit card required</p>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ background: '#0a0b14', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="footer-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 5% 48px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.6fr', gap: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,.4)' }}>
                <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 13 }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>FinSmart AI</span>
            </div>
            <p style={{ ...S, maxWidth: 220, marginBottom: 24 }}>Empowering your financial journey with AI-powered insights and smart budgeting tools.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: 'fab fa-github',    href: 'https://github.com/Yash926' },
                { icon: 'fab fa-linkedin',  href: 'https://linkedin.com/in/yashtripathi12' },
                { icon: 'fab fa-twitter',   href: '#' },
                { icon: 'fab fa-instagram', href: '#' },
              ].map(({ icon, href }) => (
                <a key={icon} href={href} target="_blank" rel="noreferrer" style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.55)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)'; e.currentTarget.style.color = '#a5b4fc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = 'rgba(148,163,184,0.55)'; }}>
                  <i className={icon} style={{ fontSize: 13 }} />
                </a>
              ))}
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 style={H4}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ l: 'Features', h: '#features' }, { l: 'How It Works', h: '#how' }, { l: 'Sign In', h: '/login' }, { l: 'Register', h: '/register' }].map(({ l, h }) => (
                <li key={l}><a href={h} style={{ ...S, textDecoration: 'none', fontSize: 14 }} onMouseEnter={e => e.target.style.color = '#a5b4fc'} onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,0.65)'}>{l}</a></li>
              ))}
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 style={H4}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <li key={l}><a href="#" style={{ ...S, textDecoration: 'none', fontSize: 14 }} onMouseEnter={e => e.target.style.color = '#a5b4fc'} onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,0.65)'}>{l}</a></li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 style={H4}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: 'fas fa-envelope',       text: 'support@finsmart.ai' },
                { icon: 'fas fa-phone',           text: '+91 98765 43210' },
                { icon: 'fas fa-map-marker-alt',  text: 'Lovely Professional University, Punjab, India' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <i className={icon} style={{ color: '#6366f1', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ ...S, fontSize: 13.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(99,102,241,0.08)', padding: '20px 5%', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.35)' }}>© {new Date().getFullYear()} FinSmart AI. All rights reserved. Made with ❤️ by Yash Tripathi</p>
        </div>
      </footer>
    </div>
  );
}
