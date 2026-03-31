import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, getDocs, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = (uid) => collection(db, 'users', uid, 'transactions');

// ── Write ────────────────────────────────────────────────
export const addTransaction = (uid, data) =>
  addDoc(col(uid), {
    type:        data.type,
    amount:      parseFloat(data.amount),
    category:    data.category,
    description: data.description || '',
    date:        Timestamp.fromDate(new Date(data.date + 'T12:00:00')), // noon to avoid timezone edge cases
    createdAt:   Timestamp.now(),
  });

export const updateTransaction = (uid, id, data) =>
  updateDoc(doc(db, 'users', uid, 'transactions', id), {
    type:        data.type,
    amount:      parseFloat(data.amount),
    category:    data.category,
    description: data.description || '',
    date:        Timestamp.fromDate(new Date(data.date + 'T12:00:00')),
  });

export const deleteTransaction = (uid, id) =>
  deleteDoc(doc(db, 'users', uid, 'transactions', id));

// ── Read all (no filters in Firestore — all client-side) ─
const fetchAll = async (uid) => {
  const snap = await getDocs(query(col(uid)));
  console.log('🔥 Firestore total docs:', snap.size, 'uid:', uid);
  return snap.docs.map(d => {
    const data = d.data();
    const ts = data.date?.toDate ? data.date.toDate() : new Date(data.date);
    return { id: d.id, ...data, _ts: ts.getTime(), date: ts.toISOString() };
  });
};

export const getTransactions = async (uid, filters = {}) => {
  const { type, category, startDate, endDate, limitCount } = filters;
  let results = await fetchAll(uid);

  if (type)      results = results.filter(t => t.type === type);
  if (category)  results = results.filter(t => t.category === category);
  if (startDate) results = results.filter(t => t._ts >= new Date(startDate).getTime());
  if (endDate)   results = results.filter(t => t._ts <= new Date(endDate).getTime());

  results.sort((a, b) => b._ts - a._ts);
  if (limitCount) results = results.slice(0, limitCount);

  console.log('📦 getTransactions result:', results.length, 'filters:', { type, category, startDate, endDate });
  return results;
};

export const getMonthlySummary = async (uid, month, year) => {
  // Start = first moment of month, End = last moment of month
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end   = new Date(year, month,     0, 23, 59, 59, 999);
  console.log('📅 getMonthlySummary range:', start.toDateString(), '→', end.toDateString());

  const txs = await getTransactions(uid, { startDate: start, endDate: end });
  console.log('📅 txs in month:', txs.length);

  let totalIncome = 0, totalExpense = 0;
  const categoryBreakdown = {};

  txs.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    }
  });

  return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense, categoryBreakdown, transactionCount: txs.length };
};

export const getMonthlyTrend = async (uid, year) => {
  const start = new Date(year, 0,  1, 0, 0, 0, 0);
  const end   = new Date(year, 11, 31, 23, 59, 59, 999);
  const txs   = await getTransactions(uid, { startDate: start, endDate: end });

  const trend = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
  txs.forEach(t => {
    const m = new Date(t.date).getMonth();
    trend[m][t.type] += t.amount;
  });
  return trend;
};
