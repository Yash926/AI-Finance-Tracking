import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getBudgetWithStatus, setBudget } from '../services/budgetService';

const MO = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CATS = ['Food','Transport','Shopping','Entertainment','Health','Education','Utilities','Rent','Travel','Other Expense'];
const ICONS = { Food:'🍔',Transport:'🚗',Shopping:'🛍️',Entertainment:'🎬',Health:'💊',Education:'📚',Utilities:'💡',Rent:'🏠',Travel:'✈️','Other Expense':'📦' };

export default function Budget() {
  const { user } = useAuth();
  const [month, setMonth]           = useState(new Date().getMonth() + 1);
  const [year, setYear]             = useState(new Date().getFullYear());
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
      } else { setTotalLimit(''); setCatLimits({}); }
    } catch (_) {}
  };

  useEffect(() => { fetchBudget(); }, [month, year, user]); // eslint-disable-line

  const handleSave = async (e) => {
    e.preventDefault();
    if (!totalLimit) return toast.error('Total limit is required');
    setLoading(true);
    try {
      const categoryLimits = Object.entries(catLimits).filter(([,v]) => v > 0).map(([category, limit]) => ({ category, limit: parseFloat(limit) }));
      await setBudget(user.uid, { month, year, totalLimit, categoryLimits });
      toast.success('Budget saved!');
      fetchBudget();
    } catch (err) { toast.error(err.message || 'Failed to save budget'); }
    finally { setLoading(false); }
  };

  const pct = parseFloat(budgetData?.percentUsed || 0);
  const barColor = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--warning)' : 'var(--primary)';

  return (
    <div className="anim-fade-up">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="t-title" style={{ fontSize: '1.375rem', marginBottom: 4 }}>Budget Manager</h1>
          <p className="t-small">Set and track your monthly spending limits</p>
        </div>
      </div>

      {budgetData?.alerts?.map((a, i) => (
        <div key={i} className={`alert alert-${a.type}`}>
          <i className={`fas fa-${a.type === 'danger' ? 'exclamation-circle' : 'exclamation-triangle'}`} />
          {a.message}
        </div>
      ))}

      <div className="budget-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        {/* Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <div className="icon-box icon-box-sm" style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}>
              <i className="fas fa-wallet" style={{ color: 'var(--primary)', fontSize: 12 }} />
            </div>
            <span className="t-heading">Set Budget</span>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="fin-input" style={{ flex: 1 }}>
                {MO.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
              <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="fin-input" style={{ flex: 1 }}>
                {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="field-label">Total Monthly Limit (₹)</label>
              <input type="number" className="fin-input" min="1" placeholder="e.g. 50,000" value={totalLimit} onChange={e => setTotalLimit(e.target.value)} required />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label className="field-label" style={{ marginBottom: 12 }}>Category Limits (optional)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CATS.map(cat => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{ICONS[cat]}</span>
                    <span className="t-body" style={{ flex: 1, fontSize: 13 }}>{cat}</span>
                    <input type="number" min="0" placeholder="₹" value={catLimits[cat] || ''}
                      onChange={e => setCatLimits(p => ({ ...p, [cat]: e.target.value }))}
                      className="fin-input" style={{ width: 90, padding: '7px 10px', fontSize: 13 }} />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ padding: '12px' }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Saving...</> : 'Save Budget'}
            </button>
          </form>
        </div>

        {/* Status */}
        <div>
          {budgetData?.budget ? (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div className="icon-box icon-box-sm" style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}>
                  <i className="fas fa-chart-bar" style={{ color: 'var(--primary)', fontSize: 12 }} />
                </div>
                <span className="t-heading">{MO[month-1]} {year} — Status</span>
              </div>

              {/* Overall */}
              <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-2)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="t-body" style={{ fontSize: 13 }}>Total Spent</span>
                  <span style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: 14 }}>
                    ₹{budgetData.totalSpent?.toFixed(0)} <span className="t-small">/ ₹{budgetData.budget.totalLimit}</span>
                  </span>
                </div>
                <div className="progress-track progress-track-lg">
                  <div className="progress-fill" style={{ width: `${Math.min(pct,100)}%`, background: barColor }} />
                </div>
                <p style={{ color: barColor, fontSize: 13, marginTop: 8, fontWeight: 600 }}>{pct}% of budget used</p>
              </div>

              {/* Categories */}
              {budgetData.budget.categoryLimits?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p className="t-label">Category Breakdown</p>
                  {budgetData.budget.categoryLimits.map(({ category, limit }) => {
                    const spent = budgetData.categorySpend?.[category] || 0;
                    const cp = Math.min((spent / limit) * 100, 100);
                    const cc = cp >= 100 ? 'var(--danger)' : cp >= 80 ? 'var(--warning)' : 'var(--success)';
                    return (
                      <div key={category}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="t-body" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {ICONS[category]} {category}
                          </span>
                          <span className="t-small">₹{spent.toFixed(0)} / ₹{limit}</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${cp}%`, background: cc }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon"><i className="fas fa-wallet" style={{ color: 'var(--primary)', fontSize: 22 }} /></div>
                <p className="t-heading">No Budget Set</p>
                <p className="t-small">Set a budget for {MO[month-1]} {year} to start tracking.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
