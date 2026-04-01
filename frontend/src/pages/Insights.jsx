import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getMonthlySummary, getTransactions, getMonthlyTrend } from '../services/transactionService';
import { auth } from '../firebase';

const MO = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const API = process.env.REACT_APP_AI_API_URL || 'http://localhost:5000';

async function getToken() { return auth.currentUser?.getIdToken(); }

function generateLocalInsights({ totalIncome=0, totalExpense=0, netBalance=0, categoryBreakdown={} }) {
  const rate = totalIncome > 0 ? ((netBalance/totalIncome)*100).toFixed(1) : 0;
  const top  = Object.entries(categoryBreakdown).sort((a,b)=>b[1]-a[1])[0];
  return [
    `• 💰 Financial Overview: Earned ₹${totalIncome.toFixed(2)}, spent ₹${totalExpense.toFixed(2)}, net ₹${netBalance.toFixed(2)}.`,
    rate>=20 ? `• ✅ Excellent savings rate of ${rate}%!` : rate>0 ? `• ⚠️ Savings rate ${rate}% — aim for 20%+.` : `• 🚨 Expenses exceeded income this month.`,
    top ? `• 📊 Top expense: "${top[0]}" at ₹${top[1].toFixed(2)} (${((top[1]/totalExpense)*100).toFixed(1)}%).` : null,
    `• 💡 Set category budgets and review weekly.`,
    `• 🎯 Build an emergency fund of ≈₹${(totalExpense*3).toFixed(0)}.`,
  ].filter(Boolean).join('\n\n');
}

// ── Insight line renderer ─────────────────────────────────────────────────────
function InsightLine({ line, delay = 0 }) {
  return (
    <div style={{ padding: '13px 18px', borderRadius: 10, marginBottom: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-2)', borderLeft: '3px solid var(--primary)', animation: `fadeUp 0.35s ease ${delay}s both` }}>
      <p className="t-body" style={{ margin: 0, lineHeight: 1.75 }}>{line}</p>
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      {!isUser && (
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#059669,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10, alignSelf: 'flex-end' }}>
          <i className="fas fa-robot" style={{ color: '#fff', fontSize: 12 }} />
        </div>
      )}
      <div style={{
        maxWidth: '75%', padding: '11px 16px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? 'var(--grad-brand)' : 'var(--bg-elevated)',
        border: isUser ? 'none' : '1px solid var(--border-1)',
        color: isUser ? '#fff' : 'var(--text-1)',
        fontSize: 14, lineHeight: 1.65,
        boxShadow: isUser ? '0 2px 8px rgba(5,150,105,0.25)' : 'none',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.text}
      </div>
    </div>
  );
}

// ── Prediction card ───────────────────────────────────────────────────────────
function PredictionCard({ label, value, prev, color, icon }) {
  const diff = prev ? value - prev : null;
  const up   = diff > 0;
  return (
    <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="icon-box icon-box-md" style={{ background: `${color}14`, border: `1px solid ${color}25`, flexShrink: 0 }}>
        <i className={icon} style={{ color, fontSize: 15 }} />
      </div>
      <div style={{ flex: 1 }}>
        <p className="t-label" style={{ marginBottom: 4 }}>{label}</p>
        <p style={{ color, fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>₹{value.toLocaleString('en-IN')}</p>
        {diff !== null && (
          <p style={{ fontSize: 11, margin: '3px 0 0', color: up ? '#ef4444' : '#10b981' }}>
            {up ? '▲' : '▼'} ₹{Math.abs(diff).toLocaleString('en-IN')} vs last month
          </p>
        )}
      </div>
      <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 99, background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border-2)' }}>
        ML Predicted
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function Insights() {
  const { user } = useAuth();
  const [tab, setTab]           = useState('insights'); // 'insights' | 'chat' | 'predict'
  const [month, setMonth]       = useState(new Date().getMonth() + 1);
  const [year, setYear]         = useState(new Date().getFullYear());

  // Insights state
  const [insights, setInsights] = useState('');
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'model', text: '👋 Hi! I\'m your AI financial advisor. Ask me anything about your spending, savings, or financial goals.' }
  ]);
  const [chatInput, setChatInput]   = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatContext, setChatContext]  = useState(null);
  const chatEndRef = useRef(null);

  // Prediction state
  const [predictions, setPredictions]   = useState(null);
  const [predNarrative, setPredNarrative] = useState('');
  const [predLoading, setPredLoading]   = useState(false);
  const [lastMonthExpense, setLastMonthExpense] = useState(null);

  // Scroll chat to bottom
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Load chat context when switching to chat tab
  useEffect(() => {
    if (tab === 'chat' && !chatContext && user) loadChatContext();
    if (tab === 'predict' && !predictions && user) loadPredictions();
  }, [tab]); // eslint-disable-line

  const loadChatContext = async () => {
    try {
      const [cur, txs] = await Promise.all([
        getMonthlySummary(user.uid, month, year),
        getTransactions(user.uid, { limitCount: 20 }),
      ]);
      setChatContext({ summary: cur, transactions: txs });
    } catch (_) {}
  };

  const loadPredictions = async () => {
    setPredLoading(true);
    try {
      // Get last 6 months of data
      const trend = await getMonthlyTrend(user.uid, year);
      const monthlyData = trend
        .filter(m => m.income > 0 || m.expense > 0)
        .map(m => ({
          month: m.month, year,
          income: m.income, expense: m.expense,
          categoryBreakdown: {},
        }));

      // Enrich with category breakdown for each month
      for (const md of monthlyData) {
        const s = await getMonthlySummary(user.uid, md.month, md.year);
        md.categoryBreakdown = s.categoryBreakdown;
      }

      if (monthlyData.length < 2) {
        setPredictions(null);
        setPredLoading(false);
        return;
      }

      // Last month actual expense for comparison
      const lastM = monthlyData[monthlyData.length - 1];
      setLastMonthExpense(lastM?.expense || null);

      const token = await getToken();
      const { data } = await axios.post(`${API}/api/ai/predict`,
        { monthlyData },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
      );
      setPredictions(data.predictions);
      setPredNarrative(data.narrative || '');
    } catch (err) {
      console.error('Prediction error:', err.message);
      toast.error('Could not load predictions');
    }
    setPredLoading(false);
  };

  // ── Generate insights ───────────────────────────────────────────────────────
  const fetchInsights = async () => {
    setLoading(true); setInsights('');
    try {
      const cur = await getMonthlySummary(user.uid, month, year);
      const pm  = month === 1 ? 12 : month - 1;
      const py  = month === 1 ? year - 1 : year;
      const prevTxs = await getTransactions(user.uid, { startDate: new Date(py,pm-1,1), endDate: new Date(py,pm,0,23,59,59) });
      let pi=0, pe=0; const pc={};
      prevTxs.forEach(t => { if(t.type==='income') pi+=t.amount; else { pe+=t.amount; pc[t.category]=(pc[t.category]||0)+t.amount; } });

      if (cur.transactionCount === 0) {
        setInsights('• No transactions found. Add income and expenses to get personalized insights!');
        setSummary(cur); setLoading(false); return;
      }
      setSummary(cur);
      try {
        const token = await getToken();
        const { data } = await axios.post(`${API}/api/ai/insights`,
          { summary: { ...cur, previousMonth: { totalIncome:pi, totalExpense:pe, netBalance:pi-pe, categoryBreakdown:pc } } },
          { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 }
        );
        setInsights(data.insights);
      } catch { setInsights(generateLocalInsights(cur)); }
    } catch (err) { toast.error(err.message || 'Failed'); }
    setLoading(false);
  };

  // ── Send chat message ───────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const history = messages.slice(1).map(m => ({ role: m.role, text: m.text }));
      const token = await getToken();
      const { data } = await axios.post(`${API}/api/ai/chat`,
        { message: userMsg, context: chatContext, history },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
      );
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: '⚠️ Sorry, I couldn\'t connect to the AI. Make sure the backend is running.' }]);
    }
    setChatLoading(false);
  };

  const QUICK = ['How can I save more?', 'What\'s my biggest expense?', 'Am I on track this month?', 'Tips to reduce food spending'];

  // ── Tab styles ──────────────────────────────────────────────────────────────
  const tabStyle = (t) => ({
    padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13.5, fontWeight: tab === t ? 600 : 400,
    background: tab === t ? 'var(--grad-brand)' : 'transparent',
    color: tab === t ? '#fff' : 'var(--text-3)',
    transition: 'all 0.2s',
    boxShadow: tab === t ? '0 2px 12px rgba(99,102,241,0.4)' : 'none',
  });

  return (
    <div className="anim-fade-up">
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="t-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div className="icon-box icon-box-sm" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <i className="fas fa-robot" style={{ color: '#fff', fontSize: 12 }} />
            </div>
            AI Financial Intelligence
          </h1>
          <p className="t-small">Powered by Google Gemini · ML predictions · Personal advisor</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-surface)', padding: 4, borderRadius: 14, width: 'fit-content', border: '1px solid var(--border-1)' }}>
        {[
          { key: 'insights', icon: 'fas fa-magic',      label: 'Insights' },
          { key: 'predict',  icon: 'fas fa-chart-line',          label: 'Predictions' },
          { key: 'chat',     icon: 'fas fa-comments',            label: 'AI Chat' },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => setTab(key)} style={tabStyle(key)}>
            <i className={icon} style={{ fontSize: 12, marginRight: 6 }} />{label}
          </button>
        ))}
      </div>

      {/* ── INSIGHTS TAB ─────────────────────────────────────────────────────── */}
      {tab === 'insights' && (
        <>
          <div className="card card-sm" style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', gap: 10, overflowX: 'auto' }}>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="fin-input" style={{ width: 'auto', padding: '9px 13px', flexShrink: 0 }}>
              {MO.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="fin-input" style={{ width: 'auto', padding: '9px 13px', flexShrink: 0 }}>
              {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={fetchInsights} disabled={loading} className="btn btn-primary" style={{ flexShrink: 0 }}>
              {loading ? <><span className="spinner" style={{ width:14,height:14,borderWidth:2 }} />Analyzing...</> : <><i className="fas fa-magic" style={{ fontSize:12 }} />Generate Insights</>}
            </button>
          </div>

          {summary && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label:'Total Income',  value:`₹${summary.totalIncome?.toFixed(2)||0}`,  color:'var(--success)', icon:'fas fa-arrow-up' },
                { label:'Total Expense', value:`₹${summary.totalExpense?.toFixed(2)||0}`, color:'var(--danger)',  icon:'fas fa-arrow-down' },
                { label:'Net Balance',   value:`₹${summary.netBalance?.toFixed(2)||0}`,   color:'var(--primary)', icon:'fas fa-balance-scale' },
              ].map(({ label, value, color, icon }) => (
                <div key={label} className="card card-sm" style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div className="icon-box icon-box-md" style={{ background:`${color}14`, border:`1px solid ${color}28`, flexShrink:0 }}>
                    <i className={icon} style={{ color, fontSize:15 }} />
                  </div>
                  <div>
                    <p className="t-label" style={{ marginBottom:3 }}>{label}</p>
                    <p style={{ color, fontSize:18, fontWeight:800, margin:0, letterSpacing:'-0.02em' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {insights ? (
            <div className="card">
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--border-2)' }}>
                <div className="icon-box icon-box-md" style={{ background:'linear-gradient(135deg,#059669,#0d9488)', boxShadow:'0 4px 14px rgba(5,150,105,0.3)', flexShrink:0 }}>
                  <i className="fas fa-robot" style={{ color:'#fff', fontSize:16 }} />
                </div>
                <div style={{ flex:1 }}>
                  <p className="t-heading">AI Analysis — {MO[month-1]} {year}</p>
                  <p className="t-small">Gemini 2.0 Flash</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--success)', animation:'pulse 2s infinite' }} />
                  <span style={{ color:'var(--success)', fontSize:12, fontWeight:500 }}>Live</span>
                </div>
              </div>
              {insights.split('\n').filter(Boolean).map((line, i) => <InsightLine key={i} line={line} delay={i * 0.06} />)}
            </div>
          ) : !loading && (
            <div className="card">
              <div className="empty-state" style={{ padding:'60px 32px' }}>
                <div className="empty-icon" style={{ width:72, height:72, borderRadius:20 }}>
                  <i className="fas fa-brain" style={{ color:'var(--primary)', fontSize:28 }} />
                </div>
                <p className="t-heading" style={{ fontSize:18 }}>Ready to Analyze</p>
                <p className="t-body" style={{ maxWidth:340, textAlign:'center' }}>Select a month and click "Generate Insights" for AI-powered financial advice.</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PREDICTIONS TAB ──────────────────────────────────────────────────── */}
      {tab === 'predict' && (
        <>
          {predLoading ? (
            <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:64, gap:16 }}>
              <div className="spinner spinner-lg" />
              <p className="t-small">Running ML predictions on your spending patterns...</p>
            </div>
          ) : predictions ? (
            <>
              {/* ML badge */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, padding:'10px 16px', borderRadius:10, background:'var(--primary-dim)', border:'1px solid var(--primary-border)', width:'fit-content' }}>
                <i className="fas fa-microchip" style={{ color:'var(--primary)', fontSize:13 }} />
                <span style={{ color:'var(--primary)', fontSize:13, fontWeight:600 }}>Linear Regression · {predictions.dataPoints} months of data · Expense trend: {predictions.expenseTrend}</span>
              </div>

              {/* Prediction cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
                <PredictionCard label="Predicted Income"  value={predictions.predictedIncome}  prev={null}             color="#10b981" icon="fas fa-arrow-up" />
                <PredictionCard label="Predicted Expense" value={predictions.predictedExpense} prev={lastMonthExpense} color="#ef4444" icon="fas fa-arrow-down" />
                <PredictionCard label="Predicted Balance" value={predictions.predictedBalance} prev={null}             color="#059669" icon="fas fa-balance-scale" />
              </div>

              {/* Category predictions */}
              {Object.keys(predictions.categoryPredictions).length > 0 && (
                <div className="card" style={{ marginBottom:20 }}>
                  <div className="section-header">
                    <div className="section-title">
                      <div className="icon-box icon-box-sm" style={{ background:'var(--primary-dim)', border:'1px solid var(--primary-border)' }}>
                        <i className="fas fa-chart-bar" style={{ color:'var(--primary)', fontSize:12 }} />
                      </div>
                      Category Predictions — Next Month
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:10 }}>
                    {Object.entries(predictions.categoryPredictions)
                      .sort((a,b) => b[1]-a[1])
                      .map(([cat, val]) => (
                        <div key={cat} style={{ padding:'12px 14px', borderRadius:10, background:'var(--bg-surface)', border:'1px solid var(--border-2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span className="t-body" style={{ fontSize:13 }}>{cat}</span>
                          <span style={{ color:'var(--danger)', fontWeight:700, fontSize:14 }}>₹{val.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* AI narrative */}
              {predNarrative && (
                <div className="card">
                  <div className="section-header">
                    <div className="section-title">
                      <div className="icon-box icon-box-sm" style={{ background:'linear-gradient(135deg,#059669,#0d9488)' }}>
                        <i className="fas fa-robot" style={{ color:'#fff', fontSize:12 }} />
                      </div>
                      AI Interpretation
                    </div>
                  </div>
                  {predNarrative.split('\n').filter(Boolean).map((line, i) => <InsightLine key={i} line={line} delay={i*0.06} />)}
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <div className="empty-state" style={{ padding:'60px 32px' }}>
                <div className="empty-icon" style={{ width:72, height:72, borderRadius:20 }}>
                  <i className="fas fa-chart-line" style={{ color:'var(--primary)', fontSize:28 }} />
                </div>
                <p className="t-heading" style={{ fontSize:18 }}>Not Enough Data</p>
                <p className="t-body" style={{ maxWidth:340, textAlign:'center' }}>Add transactions for at least 2 months to enable ML-based expense predictions.</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── CHAT TAB ─────────────────────────────────────────────────────────── */}
      {tab === 'chat' && (
        <div className="card" style={{ display:'flex', flexDirection:'column', height:600, padding:0, overflow:'hidden' }}>
          {/* Chat header */}
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-2)', display:'flex', alignItems:'center', gap:12, background:'var(--bg-elevated)' }}>
            <div className="icon-box icon-box-md" style={{ background:'linear-gradient(135deg,#059669,#0d9488)', boxShadow:'0 4px 12px rgba(5,150,105,0.3)', flexShrink:0 }}>
              <i className="fas fa-robot" style={{ color:'#fff', fontSize:16 }} />
            </div>
            <div style={{ flex:1 }}>
              <p className="t-heading">FinSmart AI Advisor</p>
              <p className="t-small">Ask anything about your finances</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981', animation:'pulse 2s infinite' }} />
              <span style={{ color:'#10b981', fontSize:12, fontWeight:500 }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 8px' }}>
            {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
            {chatLoading && (
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#059669,#0d9488)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <i className="fas fa-robot" style={{ color:'#fff', fontSize:12 }} />
                </div>
                <div style={{ padding:'11px 16px', borderRadius:'16px 16px 16px 4px', background:'var(--bg-elevated)', border:'1px solid var(--border-1)', display:'flex', gap:4, alignItems:'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--primary)', animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div style={{ padding:'0 20px 12px', display:'flex', gap:8, flexWrap:'wrap' }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => { setChatInput(q); }}
                  style={{ padding:'6px 12px', borderRadius:99, border:'1px solid var(--border-1)', background:'var(--bg-surface)', color:'var(--text-2)', fontSize:12, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-1)'; e.currentTarget.style.color='var(--text-2)'; }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} style={{ padding:'12px 16px', borderTop:'1px solid var(--border-2)', display:'flex', gap:10, background:'var(--bg-elevated)' }}>
            <input
              value={chatInput} onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about your finances..."
              className="fin-input" style={{ flex:1, borderRadius:12 }}
              disabled={chatLoading}
            />
            <button type="submit" disabled={chatLoading || !chatInput.trim()} className="btn btn-primary" style={{ borderRadius:12, padding:'10px 18px', flexShrink:0 }}>
              <i className="fas fa-paper-plane" style={{ fontSize:13 }} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
