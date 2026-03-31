import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const cardStyle = {
  background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px',
};

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editData, setEditData]         = useState(null);
  const [filter, setFilter]             = useState({ type: '', category: '', month: '', year: new Date().getFullYear() });

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const filters = {};
      if (filter.type)     filters.type = filter.type;
      if (filter.category) filters.category = filter.category;
      if (filter.month && filter.year) {
        const m = parseInt(filter.month), y = parseInt(filter.year);
        filters.startDate = new Date(y, m - 1, 1);
        filters.endDate   = new Date(y, m, 0, 23, 59, 59);
      }
      const data = await getTransactions(user.uid, filters);
      setTransactions(data);
    } catch (_) { toast.error('Failed to load transactions'); }
    setLoading(false);
  }, [user, filter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(user.uid, id);
      toast.success('Deleted');
      fetchTransactions();
    } catch (_) { toast.error('Delete failed'); }
  };

  const handleSuccess = () => { setShowForm(false); setEditData(null); fetchTransactions(); };

  const categories = filter.type === 'income'
    ? ['Salary','Freelance','Investment','Gift','Other Income']
    : ['Food','Transport','Shopping','Entertainment','Health','Education','Utilities','Rent','Travel','Other Expense'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h4 style={{ color: '#e2e8f0', fontWeight: 700, margin: 0 }}>Transactions</h4>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Manage your income and expenses</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditData(null); }} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #4361ee, #7209b7)', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-plus" /> Add Transaction
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ ...cardStyle, marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { key: 'type', options: [{ v: '', l: 'All Types' }, { v: 'income', l: 'Income' }, { v: 'expense', l: 'Expense' }] },
          { key: 'month', options: [{ v: '', l: 'All Months' }, ...MONTHS.map((m, i) => ({ v: i + 1, l: m }))] },
          { key: 'year', options: [2023, 2024, 2025, 2026].map((y) => ({ v: y, l: y })) },
        ].map(({ key, options }) => (
          <select key={key} value={filter[key]}
            onChange={(e) => setFilter((p) => ({ ...p, [key]: e.target.value }))}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', minWidth: '130px', cursor: 'pointer' }}>
            {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        ))}
        {filter.type && (
          <select value={filter.category} onChange={(e) => setFilter((p) => ({ ...p, category: e.target.value }))}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', minWidth: '160px', cursor: 'pointer' }}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <button onClick={() => setFilter({ type: '', category: '', month: '', year: new Date().getFullYear() })}
          style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', cursor: 'pointer' }}>
          <i className="fas fa-times" /> Clear
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h5 style={{ color: '#e2e8f0', margin: 0, fontWeight: 600 }}>{editData ? 'Edit Transaction' : 'New Transaction'}</h5>
              <button onClick={() => { setShowForm(false); setEditData(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            <TransactionForm editData={editData} onSuccess={handleSuccess} onCancel={() => { setShowForm(false); setEditData(null); }} />
          </div>
        </div>
      )}

      {/* Table */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border" style={{ color: '#4361ee' }} role="status" /></div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
            <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px' }}>No transactions found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Date','Type','Category','Description','Amount','Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px', textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{new Date(tx.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}><span className={tx.type === 'income' ? 'badge-income' : 'badge-expense'}>{tx.type}</span></td>
                    <td style={{ padding: '12px', color: '#e2e8f0', fontSize: '14px' }}>{tx.category}</td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{tx.description || '—'}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: tx.type === 'income' ? '#2dc653' : '#ef233c' }}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => { setEditData(tx); setShowForm(true); }}
                        style={{ marginRight: '8px', padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(67,97,238,0.15)', color: '#4361ee', cursor: 'pointer', fontSize: '12px' }}>
                        <i className="fas fa-edit" />
                      </button>
                      <button onClick={() => handleDelete(tx.id)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(239,35,60,0.15)', color: '#ef233c', cursor: 'pointer', fontSize: '12px' }}>
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
