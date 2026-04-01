import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { getMonthlySummary, getMonthlyTrend, getTransactions } from '../services/transactionService';
import { getBudgetWithStatus } from '../services/budgetService';
import StatCard from '../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MO_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CHART_COLORS = ['#6366f1','#8b5cf6','#a855f7','#06b6d4','#10b981','#f59e0b','#f43f5e','#3b82f6','#ec4899','#14b8a6'];

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [summary, setSummary] = useState(null);
  const [trend, setTrend]     = useState([]);
  const [recent, setRecent]   = useState([]);
  const [budget, setBudget]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [selMonth, setSelMonth] = useState(new Date().getMonth() + 1);
  const [selYear, setSelYear]   = useState(new Date().getFullYear());

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [sum, tr, rec, bud] = await Promise.all([
        getMonthlySummary(user.uid, selMonth, selYear),
        getMonthlyTrend(user.uid, selYear),
        getTransactions(user.uid, { limitCount: 6 }),
        getBudgetWithStatus(user.uid, selMonth, selYear),
      ]);
      console.log('📊 Dashboard data:', { sum, rec, tr });
      setSummary(sum); setTrend(tr); setRecent(rec); setBudget(bud);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
    setLoading(false);
  }, [user, selMonth, selYear]);

  // Refetch on mount, on month/year change, and on every navigation to this page
  useEffect(() => { fetchData(); }, [fetchData, location.pathname]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 16 }}>
      <div className="spinner spinner-lg" />
      <p className="t-small">Loading your finances...</p>
    </div>
  );

  const savingsRate = summary?.totalIncome > 0
    ? ((summary.netBalance / summary.totalIncome) * 100).toFixed(1) : 0;

  const pct = parseFloat(budget?.percentUsed || 0);
  const budgetColor = pct >= 100 ? '#f43f5e' : pct >= 80 ? '#f59e0b' : '#6366f1';

  const doughnutData = {
    labels: Object.keys(summary?.categoryBreakdown || {}),
    datasets: [{ data: Object.values(summary?.categoryBreakdown || {}), backgroundColor: CHART_COLORS, borderWidth: 0, hoverOffset: 8 }],
  };

  const lineData = {
    labels: MO,
    datasets: [
      { label: 'Income',  data: trend.map(t => t.income),  borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)',  fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#10b981', pointBorderColor: '#fff', pointBorderWidth: 2 },
      { label: 'Expense', data: trend.map(t => t.expense), borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#f43f5e', pointBorderColor: '#fff', pointBorderWidth: 2 },
    ],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: 'var(--chart-text)', font: { size: 12, family: 'Inter' }, padding: 16 } },
      tooltip: { backgroundColor: 'var(--tooltip-bg)', titleColor: '#fff', bodyColor: '#a8b3cf', padding: 12, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, cornerRadius: 8 },
    },
    scales: {
      x: { ticks: { color: 'var(--chart-text)', font: { size: 11 } }, grid: { color: 'var(--chart-grid)' } },
      y: { ticks: { color: 'var(--chart-text)', font: { size: 11 } }, grid: { color: 'var(--chart-grid)' } },
    },
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="anim-fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="t-title" style={{ fontSize: '1.375rem', marginBottom: 4 }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="t-small">Financial overview · {MO_FULL[selMonth-1]} {selYear}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { val: selMonth, set: setSelMonth, opts: MO.map((m,i) => ({ v: i+1, l: m })) },
            { val: selYear,  set: setSelYear,  opts: [2023,2024,2025,2026].map(y => ({ v: y, l: y })) },
          ].map((s, i) => (
            <select key={i} value={s.val} onChange={e => s.set(parseInt(e.target.value))}
              className="fin-input" style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}>
              {s.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {budget?.alerts?.map((a, i) => (
        <div key={i} className={`alert alert-${a.type}`}>
          <i className={`fas fa-${a.type === 'danger' ? 'exclamation-circle' : 'exclamation-triangle'}`} />
          {a.message}
        </div>
      ))}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <StatCard title="Total Income"   value={`₹${(summary?.totalIncome||0).toLocaleString('en-IN',{minimumFractionDigits:2})}`}  icon="fas fa-arrow-up"   color="#10b981" subtitle={`${MO[selMonth-1]} ${selYear}`} trend="up" />
        <StatCard title="Total Expenses" value={`₹${(summary?.totalExpense||0).toLocaleString('en-IN',{minimumFractionDigits:2})}`}  icon="fas fa-arrow-down" color="#f43f5e" subtitle={`${MO[selMonth-1]} ${selYear}`} trend="down" />
        <StatCard title="Net Balance"    value={`₹${(summary?.netBalance||0).toLocaleString('en-IN',{minimumFractionDigits:2})}`}    icon="fas fa-balance-scale" color="#6366f1" subtitle="Income − Expenses" />
        <StatCard title="Savings Rate"   value={`${savingsRate}%`}                                                                    icon="fas fa-piggy-bank"    color="#f59e0b" subtitle={`${summary?.transactionCount||0} transactions`} />
      </div>

      {/* Budget bar */}
      {budget?.budget && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="icon-box icon-box-sm" style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}>
                <i className="fas fa-wallet" style={{ color: 'var(--primary)', fontSize: 12 }} />
              </div>
              <span className="t-heading">Monthly Budget</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: budgetColor, fontWeight: 700, fontSize: 14 }}>{pct}%</span>
              <p className="t-small" style={{ marginTop: 1 }}>₹{budget.totalSpent?.toFixed(0)} of ₹{budget.budget.totalLimit}</p>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(pct,100)}%`, background: budgetColor }} />
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div className="icon-box icon-box-sm" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <i className="fas fa-chart-pie" style={{ color: '#8b5cf6', fontSize: 12 }} />
            </div>
            <span className="t-heading">Expense Breakdown</span>
          </div>
          {Object.keys(summary?.categoryBreakdown||{}).length > 0 ? (
            <Doughnut data={doughnutData} options={{ responsive: true, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: 'var(--chart-text)', font: { size: 11, family: 'Inter' }, padding: 10 } }, tooltip: { backgroundColor: 'var(--tooltip-bg)', titleColor: '#fff', bodyColor: '#a8b3cf', padding: 10, cornerRadius: 8 } } }} />
          ) : (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <i className="fas fa-chart-pie" style={{ fontSize: 32, color: 'var(--text-4)' }} />
              <p className="t-small">No expense data yet</p>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div className="icon-box icon-box-sm" style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)' }}>
              <i className="fas fa-chart-line" style={{ color: 'var(--primary)', fontSize: 12 }} />
            </div>
            <span className="t-heading">Income vs Expenses — {selYear}</span>
          </div>
          <Line data={lineData} options={chartOpts} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="icon-box icon-box-sm" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <i className="fas fa-history" style={{ color: '#06b6d4', fontSize: 12 }} />
            </div>
            <span className="t-heading">Recent Transactions</span>
          </div>
          <a href="/transactions" style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>View all →</a>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-inbox" style={{ color: 'var(--primary)', fontSize: 22 }} /></div>
            <p className="t-heading">No transactions yet</p>
            <p className="t-small">Add your first transaction to get started</p>
          </div>
        ) : recent.map((tx, i) => (
          <div key={tx.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0',
            borderBottom: i < recent.length - 1 ? '1px solid var(--border-2)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-box icon-box-sm" style={{
                background: tx.type === 'income' ? 'var(--success-dim)' : 'var(--danger-dim)',
                border: `1px solid ${tx.type === 'income' ? 'rgba(0,212,170,0.2)' : 'rgba(255,77,106,0.2)'}`,
              }}>
                <i className={`fas fa-arrow-${tx.type === 'income' ? 'up' : 'down'}`}
                  style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', fontSize: 11 }} />
              </div>
              <div>
                <p style={{ color: 'var(--text-1)', fontSize: 14, fontWeight: 500, margin: 0 }}>{tx.category}</p>
                <p className="t-small" style={{ margin: 0 }}>{tx.description || '—'} · {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            </div>
            <span style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: 700, fontSize: 15 }}>
              {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
