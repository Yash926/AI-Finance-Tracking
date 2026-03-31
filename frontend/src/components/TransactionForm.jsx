import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { addTransaction, updateTransaction } from '../services/transactionService';

const INCOME_CATS  = ['Salary','Freelance','Investment','Gift','Other Income'];
const EXPENSE_CATS = ['Food','Transport','Shopping','Entertainment','Health','Education','Utilities','Rent','Travel','Other Expense'];

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', fontSize: '14px', outline: 'none' };

export default function TransactionForm({ onSuccess, editData, onCancel }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        type:        editData.type,
        amount:      editData.amount,
        category:    editData.category,
        description: editData.description || '',
        date:        editData.date ? editData.date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [editData]);

  const categories = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === 'type' ? { category: '' } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return toast.error('Amount and category are required');
    setLoading(true);
    try {
      if (editData) {
        await updateTransaction(user.uid, editData.id, form);
        toast.success('Transaction updated!');
      } else {
        await addTransaction(user.uid, form);
        toast.success('Transaction added!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Error saving transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['income', 'expense'].map((t) => (
          <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, type: t, category: '' }))}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 600, fontSize: '14px', background: form.type === t ? (t === 'income' ? '#2dc653' : '#ef233c') : 'rgba(255,255,255,0.06)', color: form.type === t ? '#fff' : '#94a3b8' }}>
            {t === 'income' ? '↑ Income' : '↓ Expense'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px', display: 'block' }}>Amount (₹)</label>
        <input style={inputStyle} type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={handleChange} required />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px', display: 'block' }}>Category</label>
        <select style={inputStyle} name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px', display: 'block' }}>Description (optional)</label>
        <input style={inputStyle} type="text" name="description" placeholder="Add a note..." value={form.description} onChange={handleChange} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px', display: 'block' }}>Date</label>
        <input style={inputStyle} type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #4361ee, #7209b7)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          {loading ? 'Saving...' : editData ? 'Update' : 'Add Transaction'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '12px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
