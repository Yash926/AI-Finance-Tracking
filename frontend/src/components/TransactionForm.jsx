import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { addTransaction, updateTransaction } from '../services/transactionService';

const INCOME_CATS  = ['Salary','Freelance','Investment','Gift','Other Income'];
const EXPENSE_CATS = ['Food','Transport','Shopping','Entertainment','Health','Education','Utilities','Rent','Travel','Other Expense'];
const CAT_ICONS    = { Salary:'💼',Freelance:'💻',Investment:'📈',Gift:'🎁','Other Income':'💰',Food:'🍔',Transport:'🚗',Shopping:'🛍️',Entertainment:'🎬',Health:'💊',Education:'📚',Utilities:'💡',Rent:'🏠',Travel:'✈️','Other Expense':'📦' };

// Get today's date in local timezone as YYYY-MM-DD
const localToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function TransactionForm({ onSuccess, editData, onCancel }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ type: 'expense', amount: '', category: '', description: '', date: localToday() });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) setForm({
      type: editData.type, amount: editData.amount, category: editData.category,
      description: editData.description || '',
      date: editData.date ? editData.date.split('T')[0] : localToday(),
    });
  }, [editData]);

  const categories = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value, ...(name === 'type' ? { category: '' } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return toast.error('Amount and category are required');
    setLoading(true);
    try {
      if (editData) { await updateTransaction(user.uid, editData.id, form); toast.success('Transaction updated!'); }
      else          { await addTransaction(user.uid, form);                  toast.success('Transaction added!'); }
      onSuccess();
    } catch (err) { toast.error(err.message || 'Error saving transaction'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Type toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {['income','expense'].map(t => (
          <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t, category: '' }))}
            className="btn"
            style={{
              padding: '11px',
              background: form.type === t
                ? (t === 'income' ? 'var(--success-dim)' : 'var(--danger-dim)')
                : 'var(--bg-hover)',
              color: form.type === t ? (t === 'income' ? 'var(--success)' : 'var(--danger)') : 'var(--text-3)',
              border: `1px solid ${form.type === t ? (t === 'income' ? 'rgba(0,212,170,0.25)' : 'rgba(255,77,106,0.25)') : 'var(--border-1)'}`,
              fontWeight: form.type === t ? 600 : 400,
            }}>
            <i className={`fas fa-arrow-${t === 'income' ? 'up' : 'down'}`} style={{ fontSize: 11 }} />
            {t === 'income' ? 'Income' : 'Expense'}
          </button>
        ))}
      </div>

      {[
        { label: 'Amount (₹)', name: 'amount', type: 'number', placeholder: '0.00', props: { min: '0.01', step: '0.01' } },
        { label: 'Note (optional)', name: 'description', type: 'text', placeholder: 'Add a note...' },
        { label: 'Date', name: 'date', type: 'date', placeholder: '' },
      ].map(({ label, name, type, placeholder, props }) => (
        <div key={name} style={{ marginBottom: 14 }}>
          <label className="field-label">{label}</label>
          <input className="fin-input" type={type} name={name} placeholder={placeholder}
            value={form[name]} onChange={handleChange}
            required={name !== 'description'} {...(props || {})} />
        </div>
      ))}

      <div style={{ marginBottom: 22 }}>
        <label className="field-label">Category</label>
        <select className="fin-input" name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
          {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Saving...</> : editData ? 'Update' : 'Add Transaction'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost" style={{ padding: '12px 18px' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
