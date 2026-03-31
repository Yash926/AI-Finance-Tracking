import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getBudgetWithStatus, setBudget } from '../services/budgetService';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const EXPENSE_CATS = ['Food','Transport','Shopping','Entertainment','Health','Education','Utilities','Rent','Travel','Other Expense'];

const cardStyle = { background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', fontSize: '14px', outline: 'none' };

export default function Budget() {
  const { user } = useAuth();
  const [month, setMonth]         = useState(new Date().getMonth() + 1);
  const [year, setYear]           = useState(new Date().getFullYear());
  const [budgetData, setBudgetData] = useState(null);
  const [totalLimit, setTotalLimit] = useState('');
  const [catLimits, setCatLimits]   = useState({});
  const [loading, setLoading]       = useState(false);

  const fetchBudget = async () => {
    if (!user) return;
    try {
      const data = await getBudgetWithStatus(user.uid, month, year);
      setBudgetData(data);
      if (data.budget) {
        setTotalLimit(data.budget.totalLimit);
        const cl = {};
        data.budget.categoryLimits?.forEach(({ category, limit }) => { cl[category] = limit; });
        setCatLimits(cl);
      } else {
        setTotalLimit(''); setCatLimits({});
      }
    } catch (_) {}
  };

  useEffect(() => { fetchBudget(); }, [month, year, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (e) => {
    e.preventDefault();
    if (!totalLimit) return toast.error('Total limit is required');
    setLoading(true);
    try {
      const categoryLimits = Object.entries(catLimits)
        .filter(([, v]) => v > 0)
        .map(([category, limit]) => ({ category, limit: parseFloat(limit) }));
      await setBudget(user.uid, { month, year, totalLimit, categoryLimits });
      toast.success('Budget saved!');
      fetchBudget();
    } catch (err) {
      toast.error(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const pct = budgetData?.percentUsed ? parseFloat(budgetData.percentUsed) : 0;
  const barColor = pct >= 100 ? '#ef233c' : pct >= 80 ? '#f8961e' : '#4361ee';

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#e2e8f0', fontWeight: 700, margin: 0 }}>Budget Manager</h4>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Set and track monthly spending limits</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>
        {/* Form */}
        <div style={cardStyle}>
          <h6 style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '20px' }}>
            <i className="fas fa-wallet" style={{ color: '#4361ee', marginRight: '8px' }} />Set Budget
          </h6>
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} style={{ ...inputStyle, flex: 1 }}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ ...inputStyle, flex: 1 }}>
                {[2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Total Monthly Limit (₹)</label>
              <input type="number" style={inputStyle} min="1" placeholder="e.g. 50000" value={totalLimit} onChange={(e) => setTotalLimit(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '10px' }}>Category Limits (optional)</label>
              {EXPENSE_CATS.map((cat) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px', flex: 1 }}>{cat}</span>
                  <input type="number" min="0" placeholder="₹ limit" value={catLimits[cat] || ''}
                    onChange={(e) => setCatLimits((p) => ({ ...p, [cat]: e.target.value }))}
                    style={{ ...inputStyle, width: '110px', padding: '7px 10px' }} />
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#4361ee,#7209b7)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Save Budget'}
            </button>
          </form>
        </div>

        {/* Status */}
        <div>
          {budgetData?.alerts?.map((a, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: a.type === 'danger' ? 'rgba(239,35,60,0.1)' : 'rgba(248,150,30,0.1)', border: `1px solid ${a.type === 'danger' ? 'rgba(239,35,60,0.3)' : 'rgba(248,150,30,0.3)'}`, color: a.type === 'danger' ? '#ef233c' : '#f8961e' }}>
              <i className={`fas fa-${a.type === 'danger' ? 'exclamation-circle' : 'exclamation-triangle'}`} />
              {a.message}
            </div>
          ))}

          {budgetData?.budget ? (
            <div style={cardStyle}>
              <h6 style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '20px' }}>
                <i className="fas fa-chart-bar" style={{ color: '#4361ee', marginRight: '8px' }} />
                Budget Status — {MONTHS[month - 1]} {year}
              </h6>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total Spent</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>₹{budgetData.totalSpent?.toFixed(2)} / ₹{budgetData.budget.totalLimit}</span>
                </div>
                <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: '5px', width: `${Math.min(pct, 100)}%`, background: barColor, transition: 'width 0.5s' }} />
                </div>
                <p style={{ color: barColor, fontSize: '13px', marginTop: '6px' }}>{pct}% of budget used</p>
              </div>
              {budgetData.budget.categoryLimits?.length > 0 && (
                <>
                  <h6 style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category Breakdown</h6>
                  {budgetData.budget.categoryLimits.map(({ category, limit }) => {
                    const spent = budgetData.categorySpend?.[category] || 0;
                    const cp = Math.min((spent / limit) * 100, 100);
                    const cc = cp >= 100 ? '#ef233c' : cp >= 80 ? '#f8961e' : '#2dc653';
                    return (
                      <div key={category} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#e2e8f0', fontSize: '13px' }}>{category}</span>
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>₹{spent.toFixed(2)} / ₹{limit}</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                          <div style={{ height: '100%', borderRadius: '3px', width: `${cp}%`, background: cc, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}>
              <i className="fas fa-wallet" style={{ fontSize: '48px', color: '#4361ee', marginBottom: '16px', opacity: 0.4 }} />
              <h6 style={{ color: '#e2e8f0' }}>No Budget Set</h6>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Set a budget for {MONTHS[month - 1]} {year} to track your spending.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
