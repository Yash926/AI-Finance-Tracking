import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useInView() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}
function Fade({ children, style = {} }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity .65s ease, transform .65s ease', ...style }}>{children}</div>;
}

const FEATURES = [
  { icon: 'fas fa-exchange-alt', color: '#0891b2', title: 'Smart Expense Tracking',   desc: 'Log income and expenses across 15 categories with date filtering and instant totals.' },
  { icon: 'fas fa-wallet',       color: '#0891b2', title: 'Intelligent Budgeting',     desc: 'Set monthly limits per category. Get alerted at 80% and 100% before you overspend.' },
  { icon: 'fas fa-chart-line',   color: '#0891b2', title: 'Investment Insights',       desc: 'ML-powered linear regression predicts your next month\'s expenses per category.' },
  { icon: 'fas fa-shield-alt',   color: '#0891b2', title: 'Bank-Level Security',       desc: 'Firebase Auth and Firestore security rules ensure only you can access your data.' },
  { icon: 'fas fa-robot',        color: '#0891b2', title: 'Financial Coaching',        desc: 'Chat with Gemini AI about your finances and get personalized, data-driven advice.' },
  { icon: 'fas fa-star',         color: '#f97316', title: 'Rewards Program',           desc: 'Track your savings milestones and celebrate financial wins with smart goal tracking.' },
];

const STEPS = [
  { num: '01', icon: 'fas fa-plus-circle',  title: 'Add Your Expenses',  desc: 'Log transactions in seconds. Choose from 15 categories, add notes, and pick the date.' },
  { num: '02', icon: 'fas fa-brain',        title: 'Analyze with AI',    desc: 'Gemini AI reads your data and identifies spending trends, risks, and opportunities.' },
  { num: '03', icon: 'fas fa-lightbulb',    title: 'Get Smart Insights', desc: 'Receive personalized advice, budget alerts, and ML predictions tailored to your habits.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  role: 'Software Engineer', avatar: 'PS', text: 'FinSmart AI helped me cut my food expenses by 30% in just two months. The AI insights are incredibly accurate and actionable.' },
  { name: 'Rahul Verma',   role: 'Freelance Designer', avatar: 'RV', text: 'The budget alerts saved me from overspending three times last month. Best personal finance app I have ever used.' },
  { name: 'Ananya Gupta',  role: 'MBA Student', avatar: 'AG', text: 'The ML predictions are surprisingly accurate. It predicted my rent spike before I even remembered it was due.' },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", overflowX: 'hidden', color: '#1e293b' }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        a{transition:all .2s;text-decoration:none}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;text-align:center}.feat-grid{grid-template-columns:1fr 1fr!important}.ai-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.feat-grid{grid-template-columns:1fr!important}.steps-grid{grid-template-columns:1fr!important}.testi-grid{grid-template-columns:1fr!important}.footer-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 60, padding: '0 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(8,145,178,0.12)' : 'none', transition: 'all .3s', boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#0891b2,#0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(8,145,178,.4)' }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 13 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: scrolled ? '#0c2340' : '#fff' }}>FinSmart <span style={{ color: '#f97316' }}>AI</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Features','Testimonials','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ padding: '6px 14px', fontSize: 13.5, fontWeight: 500, color: scrolled ? '#374151' : 'rgba(255,255,255,0.85)', borderRadius: 8 }}
              onMouseEnter={e => e.target.style.color = scrolled ? '#0891b2' : '#fff'}
              onMouseLeave={e => e.target.style.color = scrolled ? '#374151' : 'rgba(255,255,255,0.85)'}>{l}</a>
          ))}
          <Link to="/login" style={{ padding: '7px 16px', fontSize: 13.5, fontWeight: 500, color: scrolled ? '#374151' : 'rgba(255,255,255,0.85)', borderRadius: 8 }}
            onMouseEnter={e => e.target.style.color = scrolled ? '#0891b2' : '#fff'}
            onMouseLeave={e => e.target.style.color = scrolled ? '#374151' : 'rgba(255,255,255,0.85)'}>Sign In</Link>
          <Link to="/register" style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13.5, fontWeight: 700, background: '#f97316', color: '#fff', boxShadow: '0 3px 10px rgba(249,115,22,.35)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ea6c0a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)'; }}>Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 35%, #1d4ed8 100%)', minHeight: '88vh', display: 'flex', alignItems: 'center', padding: '100px 5% 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
              AI-Powered Finance Management
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#fff', marginBottom: 20 }}>
              Master Your<br />Finances
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: 420, marginBottom: 36 }}>
              Empower your financial journey with FinSmart AI — Use AI to track spending, budgeting, and growing your wealth.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" style={{ padding: '13px 30px', borderRadius: 10, fontSize: 15, fontWeight: 700, background: '#f97316', color: '#fff', boxShadow: '0 6px 20px rgba(249,115,22,.45)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ea6c0a'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(249,115,22,.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,.45)'; }}>
                Get Started <i className="fas fa-arrow-right" style={{ fontSize: 12 }} />
              </Link>
              <Link to="/login" style={{ padding: '13px 30px', borderRadius: 10, fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}>
                <i className="fas fa-play-circle" style={{ fontSize: 13 }} /> View Demo
              </Link>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 24, boxShadow: '0 32px 64px rgba(0,0,0,0.25)', animation: 'float 6s ease-in-out infinite' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              {['#f43f5e','#f59e0b','#10b981'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[{ l:'Income', v:'₹52,000', c:'#34d399' },{ l:'Expenses', v:'₹31,400', c:'#fb7185' },{ l:'Balance', v:'₹20,600', c:'#fff' },{ l:'Savings', v:'39.6%', c:'#fbbf24' }].map(({ l, v, c }) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{l}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: c, letterSpacing: '-0.02em' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'flex-end', gap: 5, height: 72 }}>
              {[35,55,40,75,50,65,85,55,70,45,80,90].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(249,115,22,0.7)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" style={{ background: '#fff', padding: '90px 5%' }}>
        <Fade>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0c2340', marginBottom: 12 }}>Powerful Features for Your Financial Success</h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 440, margin: '0 auto' }}>Everything you need to take control of your money in one place.</p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
            {FEATURES.map(({ icon, color, title, desc }) => (
              <div key={title} style={{ padding: '28px 24px', borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all .22s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#bae6fd'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(8,145,178,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className={icon} style={{ color: '#0891b2', fontSize: 18 }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c2340', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section style={{ background: '#f0f9ff', padding: '90px 5%', borderTop: '1px solid #e0f2fe', borderBottom: '1px solid #e0f2fe' }}>
        <Fade>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0c2340', marginBottom: 12 }}>How It Works</h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 400, margin: '0 auto' }}>Get started in minutes. No complex setup required.</p>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, maxWidth: 900, margin: '0 auto' }}>
            {STEPS.map(({ num, icon, title, desc }) => (
              <div key={num} style={{ textAlign: 'center', padding: '36px 24px', borderRadius: 16, background: '#fff', border: '1px solid #bae6fd', boxShadow: '0 2px 12px rgba(8,145,178,0.07)', transition: 'all .22s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(8,145,178,0.15)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,145,178,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#0891b2,#0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 6px 18px rgba(8,145,178,0.3)' }}>
                  <i className={icon} style={{ color: '#fff', fontSize: 22 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0891b2', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Step {num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c2340', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section id="testimonials" style={{ background: '#fff', padding: '90px 5%' }}>
        <Fade>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0c2340', marginBottom: 12 }}>What Our Users Say</h2>
          </div>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
            {TESTIMONIALS.map(({ name, role, avatar, text }) => (
              <div key={name} style={{ padding: 28, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#bae6fd'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(8,145,178,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star" style={{ color: '#f59e0b', fontSize: 13 }} />)}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0891b2,#0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0c2340' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#0891b2' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Fade>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)', padding: '80px 5%', textAlign: 'center' }}>
        <Fade>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', marginBottom: 14 }}>
            Ready to Transform Your Financial Life?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Join thousands of users who are already managing their finances smarter with FinSmart AI.
          </p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', borderRadius: 99, fontSize: 16, fontWeight: 700, background: '#fff', color: '#f97316', boxShadow: '0 8px 28px rgba(0,0,0,0.15)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.15)'; }}>
            Start Your Free Trial <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>No credit card required · Free forever</p>
        </Fade>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer id="contact" style={{ background: '#1e2d3d' }}>
        <div className="footer-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 5% 44px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.6fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#0891b2,#0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: 12 }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>FinSmart <span style={{ color: '#f97316' }}>AI</span></span>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 210, marginBottom: 22 }}>Empowering your financial journey with AI-powered insights and smart budgeting.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ i: 'fab fa-facebook-f', h: '#' }, { i: 'fab fa-twitter', h: '#' }, { i: 'fab fa-instagram', h: '#' }, { i: 'fab fa-linkedin-in', h: 'https://linkedin.com/in/yashtripathi12' }].map(({ i, h }) => (
                <a key={i} href={h} target="_blank" rel="noreferrer" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0891b2'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                  <i className={i} style={{ fontSize: 12 }} />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Quick Links', links: [{ l:'Features', h:'#features' }, { l:'Testimonials', h:'#testimonials' }, { l:'Pricing', h:'#' }, { l:'Contact', h:'#contact' }] },
            { title: 'Legal', links: [{ l:'Privacy Policy', h:'#' }, { l:'Terms of Service', h:'#' }, { l:'Cookie Policy', h:'#' }] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {links.map(({ l, h }) => (
                  <li key={l}><a href={h} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)' }} onMouseEnter={e => e.target.style.color = '#38bdf8'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Contact Us</h4>
            {[{ i: 'fas fa-envelope', t: 'Email: support@finsmart.ai' }, { i: 'fas fa-phone', t: 'Phone: +91 98765 43210' }, { i: 'fas fa-map-marker-alt', t: 'Address: LPU, Punjab, India' }].map(({ i, t }) => (
              <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <i className={i} style={{ color: '#0891b2', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '18px 5%', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} FinSmart AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
