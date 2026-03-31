import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';

const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter]     = useState({ type: '', category: '', month: '', year: new Date().getFullYear() });

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const f = {};
      if (filter.type)     f.type = filter.type;
      if (filter.category) f.category = filter.category;
      if (filter.month && filter.year) {
        const m = parseInt(filter.month), y = parseInt(filter.year);
        f.startDate = new Date(y, m-1, 1);
        f.endDate   = new Date(y, m, 0, 23, 59, 59);
      }
      setTransactions(await getTransactions(user.uid, f));
    } catch (_) { toast.error('Failed to load transactions'); }
    setLoading(false);
  }, [user, filter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await deleteTransaction(user.uid, id); toast.success('Deleted'); fetchTransactions(); }
    catch (_) { toast.error('Delete failed'); }
  };

  const cats = filter.type === 'income'
    ? ['Salary','Freelance','Investment','Gift','Other Income']
    : ['Food','Transport','Shopping','Entertainment','Health','Education','Utilities','Rent','Travel','Other Expense'];

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);

  return (
    <div className="anim-fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="t-title" style={{ fontSize: '1.375rem', marginBottom: 4 }}>Transactions</h1>
          <p className="t-small">Manage your income and expenses</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditData(null); }} className="btn btn-primary">
          <i className="fas fa-plus" style={{ fontSize: 12 }} /> Add Transaction
        </button>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Income',  value: `₹${totalIncome.toLocaleString('en-IN',{minimumFractionDigits:2})}`,  color: 'var(--success)', icon: 'fas fa-arrow-up' },
          { label: 'Expense', value: `₹${totalExpense.toLocaleString('en-IN',{minimumFractionDigits:2})}`, color: 'var(--danger)',  icon: 'fas fa-arrow-down' },
          { label: 'Count',   value: transactions.length,                                                   color: 'var(--primary)', icon: 'fas fa-receipt' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="icon-box icon-box-sm" style={{ background: `${color}14`, border: `1px solid ${color}28`, flexShrink: 0 }}>
              <i className={icon} style={{ color, fontSize: 12 }} />
            </div>
            <div>
              <p className="t-label" style={{ marginBottom: 2 }}>{label}</p>
              <p style={{ color, fontWeight: 700, fontSize: 15, margin: 0 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card card-sm" style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <i className="fas fa-sliders" style={{ color: 'var(--text-3)', fontSize: 13 }} />
        {[
          { key: 'type',  opts: [{ v:'',l:'All Types' },{ v:'income',l:'Income' },{ v:'expense',l:'Expense' }] },
          { key: 'month', opts: [{ v:'',l:'All Months' },...MO.map((m,i) => ({ v:i+1,l:m }))] },
          { key: 'year',  opts: [2023,2024,2025,2026].map(y => ({ v:y,l:y })) },
        ].map(({ key, opts }) => (
          <select key={key} value={filter[key]} onChange={e => setFilter(p => ({ ...p, [key]: e.target.value }))}
            className="fin-input" style={{ width: 'auto', padding: '7px 11px', fontSize: 13 }}>
            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        ))}
        {filter.type && (
          <select value={filter.category} onChange={e => setFilter(p => ({ ...p, category: e.target.value }))}
            className="fin-input" style={{ width: 'auto', padding: '7px 11px', fontSize: 13 }}>
            <option value="">All Categories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <button onClick={() => setFilter({ type:'',category:'',month:'',year:new Date().getFullYear() })}
          className="btn btn-ghost btn-sm">
          <i className="fas fa-xmark" /> Clear
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 className="t-heading" style={{ fontSize: 16 }}>{editData ? 'Edit Transaction' : 'New Transaction'}</h2>
              <button onClick={() => { setShowForm(false); setEditData(null); }}
                className="btn btn-ghost btn-sm" style={{ width: 32, height: 32, padding: 0, borderRadius: 8 }}>
                <i className="fas fa-xmark" />
              </button>
            </div>
            <TransactionForm editData={editData}
              onSuccess={() => { setShowForm(false); setEditData(null); fetchTransactions(); }}
              onCancel={() => { setShowForm(false); setEditData(null); }} />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner spinner-lg" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-inbox" style={{ color: 'var(--primary)', fontSize: 22 }} /></div>
            <p className="t-heading">No transactions found</p>
            <p className="t-small">Try adjusting your filters or add a new transaction</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="fin-table">
              <thead>
                <tr>
                  {['Date','Type','Category','Description','Amount',''].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td><span className={`badge badge-${tx.type}`}>{tx.type}</span></td>
                    <td style={{ color: 'var(--text-1)', fontWeight: 500 }}>{tx.category}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || '—'}</td>
                    <td style={{ fontWeight: 700, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', whiteSpace: 'nowrap' }}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditData(tx); setShowForm(true); }} className="btn btn-ghost btn-sm">
                          <i className="fas fa-pen" style={{ fontSize: 11 }} />
                        </button>
                        <button onClick={() => handleDelete(tx.id)} className="btn btn-danger btn-sm">
                          <i className="fas fa-trash" style={{ fontSize: 11 }} />
                        </button>
                      </div>
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
