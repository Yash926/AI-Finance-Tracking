import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getMonthlySummary, getTransactions } from '../services/transactionService';
import { auth } from '../firebase';

const MO = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function generateLocalInsights({ totalIncome = 0, totalExpense = 0, netBalance = 0, categoryBreakdown = {} }) {
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
  const top = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
  return [
    `• 💰 Financial Overview: You earned ₹${totalIncome.toFixed(2)} and spent ₹${totalExpense.toFixed(2)}, resulting in a net balance of ₹${netBalance.toFixed(2)}.`,
    savingsRate >= 20
      ? `• ✅ Savings Rate: Excellent! You saved ${savingsRate}% of your income. Keep it up!`
      : savingsRate > 0
        ? `• ⚠️ Savings Rate: You saved ${savingsRate}% of your income. Aim for at least 20%.`
        : `• 🚨 Savings Alert: Your expenses exceeded your income this month. Review your spending immediately.`,
    top ? `• 📊 Top Expense: "${top[0]}" accounts for ${((top[1] / totalExpense) * 100).toFixed(1)}% of total expenses (₹${top[1].toFixed(2)}).` : null,
    `• 💡 Recommendation: Set a monthly budget per category and review it weekly to stay on track.`,
    `• 🎯 Goal: Build an emergency fund of ≈₹${(totalExpense * 3).toFixed(2)} (3 months of expenses).`,
  ].filter(Boolean).join('\n\n');
}

export default function Insights() {
  const { user } = useAuth();
  const [month, setMonth]       = useState(new Date().getMonth() + 1);
  const [year, setYear]         = useState(new Date().getFullYear());
  const [insights, setInsights] = useState('');
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const fetchInsights = async () => {
    setLoading(true); setInsights('');
    try {
      const cur = await getMonthlySummary(user.uid, month, year);
      console.log('🤖 Insights summary:', cur);

      const pm  = month === 1 ? 12 : month - 1;
      const py  = month === 1 ? year - 1 : year;
      const prevStart = new Date(py, pm - 1, 1, 0, 0, 0, 0);
      const prevEnd   = new Date(py, pm,     0, 23, 59, 59, 999);
      const prevTxs   = await getTransactions(user.uid, { startDate: prevStart, endDate: prevEnd });

      let pi = 0, pe = 0; const pc = {};
      prevTxs.forEach(t => {
        if (t.type === 'income') pi += t.amount;
        else { pe += t.amount; pc[t.category] = (pc[t.category] || 0) + t.amount; }
      });

      if (cur.transactionCount === 0) {
        setInsights('• No transactions found for the selected period. Start adding your income and expenses to get personalized AI financial insights!');
        setSummary(cur); setLoading(false); return;
      }

      setSummary(cur);

      try {
        const idToken = await auth.currentUser.getIdToken();
        const { data } = await axios.post(
          `${process.env.REACT_APP_AI_API_URL || 'http://localhost:5000'}/api/ai/insights`,
          { summary: { ...cur, previousMonth: { totalIncome: pi, totalExpense: pe, netBalance: pi - pe, categoryBreakdown: pc } } },
          { headers: { Authorization: `Bearer ${idToken}` }, timeout: 15000 }
        );
        setInsights(data.insights);
      } catch (backendErr) {
        console.warn('Backend unavailable, using local insights:', backendErr.message);
        setInsights(generateLocalInsights(cur));
      }
    } catch (err) {
      console.error('Insights error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to generate insights');
    } finally { setLoading(false); }
  };

  const renderInsights = (text) =>
    text.split('\n').filter(Boolean).map((line, i) => (
      <div key={i} className="anim-fade-up" style={{
        animationDelay: `${i * 0.06}s`,
        padding: '14px 18px', borderRadius: 10, marginBottom: 8,
        background: 'var(--bg-surface)', border: '1px solid var(--border-2)',
        borderLeft: '3px solid var(--primary)',
      }}>
        <p className="t-body" style={{ margin: 0, lineHeight: 1.75 }}>{line}</p>
      </div>
    ));

  return (
    <div className="anim-fade-up">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="t-title" style={{ fontSize: '1.375rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="icon-box icon-box-sm" style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', flexShrink: 0 }}>
              <i className="fas fa-robot" style={{ color: '#fff', fontSize: 12 }} />
            </div>
            AI Financial Insights
          </h1>
          <p className="t-small">Powered by Google Gemini — personalized advice from your data</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card card-sm" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="fin-input" style={{ width: 'auto', padding: '9px 13px' }}>
          {MO.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="fin-input" style={{ width: 'auto', padding: '9px 13px' }}>
          {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={fetchInsights} disabled={loading} className="btn btn-primary" style={{ gap: 8 }}>
          {loading
            ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Analyzing...</>
            : <><i className="fas fa-wand-magic-sparkles" style={{ fontSize: 12 }} />Generate Insights</>}
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Income',  value: `₹${summary.totalIncome?.toFixed(2)||0}`,  color: 'var(--success)', icon: 'fas fa-arrow-up' },
            { label: 'Total Expense', value: `₹${summary.totalExpense?.toFixed(2)||0}`, color: 'var(--danger)',  icon: 'fas fa-arrow-down' },
            { label: 'Net Balance',   value: `₹${summary.netBalance?.toFixed(2)||0}`,   color: 'var(--primary)', icon: 'fas fa-scale-balanced' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-box icon-box-md" style={{ background: `${color}14`, border: `1px solid ${color}28`, flexShrink: 0 }}>
                <i className={icon} style={{ color, fontSize: 15 }} />
              </div>
              <div>
                <p className="t-label" style={{ marginBottom: 3 }}>{label}</p>
                <p style={{ color, fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Output */}
      {insights ? (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--border-2)' }}>
            <div className="icon-box icon-box-md" style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 4px 14px rgba(5,150,105,0.35)', flexShrink: 0 }}>
              <i className="fas fa-robot" style={{ color: '#fff', fontSize: 16 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p className="t-heading">AI Analysis Complete</p>
              <p className="t-small">{MO[month-1]} {year} · Gemini 1.5 Flash</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
              <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>Live</span>
            </div>
          </div>
          {renderInsights(insights)}
        </div>
      ) : !loading && (
        <div className="card">
          <div className="empty-state" style={{ padding: '72px 32px' }}>
            <div className="empty-icon" style={{ width: 72, height: 72, borderRadius: 20 }}>
              <i className="fas fa-brain" style={{ color: 'var(--primary)', fontSize: 28 }} />
            </div>
            <p className="t-heading" style={{ fontSize: 18 }}>Ready to Analyze</p>
            <p className="t-body" style={{ maxWidth: 360, textAlign: 'center' }}>
              Select a month and year, then click "Generate Insights" to get AI-powered financial advice tailored to your spending patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
