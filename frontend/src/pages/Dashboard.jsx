import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const cardStyle = {
  background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px',
};

const chartOpts = {
  responsive: true,
  plugins: { legend: { labels: { color: '#94a3b8' } } },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary]   = useState(null);
  const [trend, setTrend]       = useState([]);
  const [recent, setRecent]     = useState([]);
  const [budget, setBudget]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selMonth, setSelMonth] = useState(new Date().getMonth() + 1);
  const [selYear, setSelYear]   = useState(new Date().getFullYear());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summRes, trendRes, txRes, budgetRes] = await Promise.all([
        api.get(`/transactions/summary?month=${selMonth}&year=${selYear}`),
        api.get(`/transactions/monthly-trend?year=${selYear}`),
        api.get('/transactions?limit=5'),
        api.get(`/budget?month=${selMonth}&year=${selYear}`),
      ]);
      setSummary(summRes.data.data);
      setTrend(trendRes.data.data);
      setRecent(txRes.data.data);
      setBudget(budgetRes.data.data);
    } catch (_) {}
    setLoading(false);
  }, [selMonth, selYear]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border" style={{ color: '#4361ee', width: '3rem', height: '3rem' }} role="status" />
        <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  // Chart data
  const doughnutData = {
    labels: Object.keys(summary?.categoryBreakdown || {}),
    datasets: [{
      data: Object.values(summary?.categoryBreakdown || {}),
      backgroundColor: ['#4361ee','#7209b7','#ef233c','#f8961e','#2dc653','#4cc9f0','#e9c46a','#a8dadc','#e76f51','#264653'],
      borderWidth: 0,
    }],
  };

  const lineData = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Income', data: trend.map((t) => t.income),
        borderColor: '#2dc653', backgroundColor: 'rgba(45,198,83,0.1)', fill: true, tension: 0.4,
      },
      {
        label: 'Expense', data: trend.map((t) => t.expense),
        borderColor: '#ef233c', backgroundColor: 'rgba(239,35,60,0.1)', fill: true, tension: 0.4,
      },
    ],
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ color: '#e2e8f0', fontWeight: 700, margin: 0 }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Here's your financial overview</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selMonth} onChange={(e) => setSelMonth(parseInt(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#16213e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', cursor: 'pointer' }}
          >
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select
            value={selYear} onChange={(e) => setSelYear(parseInt(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#16213e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', cursor: 'pointer' }}
          >
            {[2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Budget Alerts */}
      {budget?.alerts?.map((alert, i) => (
        <div key={i} style={{
          padding: '12px 16px', borderRadius: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px',
          background: alert.type === 'danger' ? 'rgba(239,35,60,0.1)' : 'rgba(248,150,30,0.1)',
          border: `1px solid ${alert.type === 'danger' ? 'rgba(239,35,60,0.3)' : 'rgba(248,150,30,0.3)'}`,
          color: alert.type === 'danger' ? '#ef233c' : '#f8961e',
        }}>
          <i className={`fas fa-${alert.type === 'danger' ? 'exclamation-circle' : 'exclamation-triangle'}`} />
          {alert.message}
        </div>
      ))}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard title="Total Income"    value={`₹${(summary?.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}  icon="fas fa-arrow-up"    color="#2dc653" subtitle={`${MONTHS[selMonth-1]} ${selYear}`} />
        <StatCard title="Total Expenses"  value={`₹${(summary?.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}  icon="fas fa-arrow-down"  color="#ef233c" subtitle={`${MONTHS[selMonth-1]} ${selYear}`} />
        <StatCard title="Net Balance"     value={`₹${(summary?.netBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}    icon="fas fa-wallet"      color="#4361ee" subtitle="Income - Expenses" />
        <StatCard title="Transactions"    value={summary?.transactionCount || 0}                                                              icon="fas fa-receipt"     color="#4cc9f0" subtitle="This month" />
      </div>

      {/* Budget Progress */}
      {budget?.budget && (
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h6 style={{ color: '#e2e8f0', fontWeight: 600, margin: 0 }}>
              <i className="fas fa-wallet" style={{ color: '#4361ee', marginRight: '8px' }} />
              Monthly Budget
            </h6>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
              ₹{budget.totalSpent?.toFixed(2)} / ₹{budget.budget.totalLimit}
            </span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px', transition: 'width 0.5s ease',
              width: `${Math.min(budget.percentUsed || 0, 100)}%`,
              background: parseFloat(budget.percentUsed) >= 100 ? '#ef233c' : parseFloat(budget.percentUsed) >= 80 ? '#f8961e' : '#4361ee',
            }} />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>{budget.percentUsed}% used</p>
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <h6 style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '16px' }}>
            <i className="fas fa-chart-pie" style={{ color: '#7209b7', marginRight: '8px' }} />
            Expense by Category
          </h6>
          {Object.keys(summary?.categoryBreakdown || {}).length > 0 ? (
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8', padding: 12 }, position: 'bottom' } } }} />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <i className="fas fa-chart-pie" style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
              <p>No expense data</p>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h6 style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '16px' }}>
            <i className="fas fa-chart-line" style={{ color: '#4361ee', marginRight: '8px' }} />
            Income vs Expense Trend ({selYear})
          </h6>
          <Line data={lineData} options={chartOpts} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={cardStyle}>
        <h6 style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '16px' }}>
          <i className="fas fa-clock" style={{ color: '#4cc9f0', marginRight: '8px' }} />
          Recent Transactions
        </h6>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
            <i className="fas fa-inbox" style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }} />
            <p>No transactions yet. Add your first transaction!</p>
          </div>
        ) : (
          recent.map((tx) => (
            <div key={tx._id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: tx.type === 'income' ? 'rgba(45,198,83,0.15)' : 'rgba(239,35,60,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`fas fa-${tx.type === 'income' ? 'arrow-up' : 'arrow-down'}`}
                    style={{ color: tx.type === 'income' ? '#2dc653' : '#ef233c', fontSize: '13px' }} />
                </div>
                <div>
                  <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500, margin: 0 }}>{tx.category}</p>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{tx.description || '—'} · {new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span style={{ color: tx.type === 'income' ? '#2dc653' : '#ef233c', fontWeight: 600 }}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
