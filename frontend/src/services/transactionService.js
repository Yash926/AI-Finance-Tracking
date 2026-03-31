/**
 * Firestore service for transactions
 * Replaces Express /api/transactions endpoints
 */
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, getDocs, Timestamp, limit,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = (uid) => collection(db, 'users', uid, 'transactions');

export const addTransaction = (uid, data) =>
  addDoc(col(uid), {
    ...data,
    amount: parseFloat(data.amount),
    date: Timestamp.fromDate(new Date(data.date)),
    createdAt: Timestamp.now(),
  });

export const updateTransaction = (uid, id, data) =>
  updateDoc(doc(db, 'users', uid, 'transactions', id), {
    ...data,
    amount: parseFloat(data.amount),
    date: Timestamp.fromDate(new Date(data.date)),
  });

export const deleteTransaction = (uid, id) =>
  deleteDoc(doc(db, 'users', uid, 'transactions', id));

/** Fetch transactions with optional filters */
export const getTransactions = async (uid, filters = {}) => {
  const { type, category, startDate, endDate, limitCount } = filters;
  const constraints = [orderBy('date', 'desc')];

  if (type)      constraints.push(where('type', '==', type));
  if (category)  constraints.push(where('category', '==', category));
  if (startDate) constraints.push(where('date', '>=', Timestamp.fromDate(new Date(startDate))));
  if (endDate)   constraints.push(where('date', '<=', Timestamp.fromDate(new Date(endDate))));
  if (limitCount) constraints.push(limit(limitCount));

  const snap = await getDocs(query(col(uid), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), date: d.data().date?.toDate().toISOString() }));
};

/** Monthly summary: totalIncome, totalExpense, netBalance, categoryBreakdown */
export const getMonthlySummary = async (uid, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0, 23, 59, 59);
  const txs   = await getTransactions(uid, { startDate: start, endDate: end });

  let totalIncome = 0, totalExpense = 0;
  const categoryBreakdown = {};

  txs.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    }
  });

  return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense, categoryBreakdown, transactionCount: txs.length };
};

/** Yearly monthly trend */
export const getMonthlyTrend = async (uid, year) => {
  const start = new Date(year, 0, 1);
  const end   = new Date(year, 11, 31, 23, 59, 59);
  const txs   = await getTransactions(uid, { startDate: start, endDate: end });

  const trend = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
  txs.forEach((t) => {
    const m = new Date(t.date).getMonth();
    trend[m][t.type] += t.amount;
  });
  return trend;
};
