import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getMonthlySummary, getTransactions } from '../services/transactionService';
import { auth } from '../firebase';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const cardStyle = { background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' };

export default function Insights() {
  const { user } = useAuth();
  const [month, setMonth]       = useState(new Date().getMonth() + 1);
  const [year, setYear]         = useState(new Date().getFullYear());
  const [insights, setInsights] = useState('');
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setInsights('');
    try {
      // Build summary locally from Firestore
      const currentSummary = await getMonthlySummary(user.uid, month, year);

      // Previous month
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear  = month === 1 ? year - 1 : year;
      const prevTxs   = await getTransactions(user.uid, {
        startDate: new Date(prevYear, prevMonth - 1, 1),
        endDate:   new Date(prevYear, prevMonth, 0, 23, 59, 59),
      });
      let prevIncome = 0, prevExpense = 0;
      const prevCats = {};
      prevTxs.forEach((t) => {
        if (t.type === 'income') prevIncome += t.amount;
        else { prevExpense += t.amount; prevCats[t.category] = (prevCats[t.category] || 0) + t.amount; }
      });

      if (currentSummary.transactionCount === 0) {
        setInsights('• No transactions found for the selected period. Start adding your income and expenses to get personalized AI financial insights!');
        setSummary(currentSummary);
        setLoading(false);
        return;
      }

      // Get Firebase ID token to authenticate with the AI backend
      const idToken = await auth.currentUser.getIdToken();

      const { data } = await axios.post(
        `${process.env.REACT_APP_AI_API_URL || 'http://localhost:5000'}/api/ai/insights`,
        {
          summary: { ...currentSummary, previousMonth: { totalIncome: prevIncome, totalExpense: prevExpense, netBalance: prevIncome - prevExpense, categoryBreakdown: prevCats } },
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setInsights(data.insights);
      setSummary(currentSummary);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const renderInsights = (text) =>
    text.split('\n').filter(Boolean).map((line, i) => (
      <p key={i} style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.7, padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #4361ee' }}>
        {line}
      </p>
    ));

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#e2e8f0', fontWeight: 700, margin: 0 }}>
          <i className="fas fa-robot" style={{ color: '#4361ee', marginRight: '10px' }} />AI Financial Insights
        </h4>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Powered by Google Gemini AI – personalized advice based on your transaction data</p>
      </div>

      <div style={{ ...cardStyle, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', minWidth: '150px', cursor: 'pointer' }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ padding: '10px 14px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', cursor: 'pointer' }}>
          {[2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={fetchInsights} disabled={loading} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #4361ee, #7209b7)', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? <><span className="spinner-border spinner-border-sm" /> Analyzing...</> : <><i className="fas fa-magic" /> Generate Insights</>}
        </button>
      </div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Income',  value: `₹${summary.totalIncome?.toFixed(2) || 0}`,  color: '#2dc653', icon: 'arrow-up' },
            { label: 'Total Expense', value: `₹${summary.totalExpense?.toFixed(2) || 0}`, color: '#ef233c', icon: 'arrow-down' },
            { label: 'Net Balance',   value: `₹${summary.netBalance?.toFixed(2) || 0}`,   color: '#4361ee', icon: 'wallet' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fas fa-${icon}`} style={{ color, fontSize: '18px' }} />
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{label}</p>
                <p style={{ color, fontSize: '18px', fontWeight: 700, margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {insights ? (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #4361ee, #7209b7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-robot" style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            <div>
              <h6 style={{ color: '#e2e8f0', fontWeight: 600, margin: 0 }}>AI Analysis</h6>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{MONTHS[month - 1]} {year} · Generated by Gemini AI</p>
            </div>
          </div>
          {renderInsights(insights)}
        </div>
      ) : !loading && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '20px', margin: '0 auto 20px', background: 'linear-gradient(135deg, #4361ee22, #7209b722)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-brain" style={{ fontSize: '36px', color: '#4361ee', opacity: 0.6 }} />
          </div>
          <h5 style={{ color: '#e2e8f0', fontWeight: 600 }}>Ready to Analyze Your Finances</h5>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>Select a month and year, then click "Generate Insights" to receive AI-powered financial advice.</p>
        </div>
      )}
    </div>
  );
}
