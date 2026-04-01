import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, getDocs, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const col = (uid) => collection(db, 'users', uid, 'transactions');

// ── Write ────────────────────────────────────────────────
export const addTransaction = async (uid, data) => {
  // Parse date parts directly to avoid any timezone conversion
  const [y, m, d] = data.date.split('-').map(Number);
  const localDate = new Date(y, m - 1, d, 12, 0, 0); // local noon — stays in correct local day
  const ref = await addDoc(col(uid), {
    type:        data.type,
    amount:      parseFloat(data.amount),
    category:    data.category,
    description: data.description || '',
    date:        Timestamp.fromDate(localDate),
    createdAt:   Timestamp.now(),
  });
  return ref;
};

export const updateTransaction = (uid, id, data) => {
  const [y, m, d] = data.date.split('-').map(Number);
  const localDate = new Date(y, m - 1, d, 12, 0, 0);
  return updateDoc(doc(db, 'users', uid, 'transactions', id), {
    type:        data.type,
    amount:      parseFloat(data.amount),
    category:    data.category,
    description: data.description || '',
    date:        Timestamp.fromDate(localDate),
  });
};

export const deleteTransaction = (uid, id) =>
  deleteDoc(doc(db, 'users', uid, 'transactions', id));

// ── Read all (no filters in Firestore — all client-side) ─
const fetchAll = async (uid) => {
  const snap = await getDocs(query(col(uid)));
  console.log('🔥 Firestore total docs:', snap.size, 'uid:', uid);
  return snap.docs.map(d => {
    const data = d.data();
    const ts = data.date?.toDate ? data.date.toDate() : new Date(data.date);
    // Store local year/month/day to avoid UTC vs IST mismatch
    const localYear  = ts.getFullYear();
    const localMonth = ts.getMonth() + 1; // 1-12
    const localDay   = ts.getDate();
    return { id: d.id, ...data, _ts: ts.getTime(), date: ts.toISOString(), localYear, localMonth, localDay };
  });
};

export const getTransactions = async (uid, filters = {}) => {
  const { type, category, startDate, endDate, limitCount } = filters;
  let results = await fetchAll(uid);

  if (type)     results = results.filter(t => t.type === type);
  if (category) results = results.filter(t => t.category === category);

  if (startDate || endDate) {
    // Extract YYYY, MM, DD in local time to avoid timezone shifts
    const toYMD = (d) => {
      const dt = (d instanceof Date) ? d : new Date(d);
      return { y: dt.getFullYear(), m: dt.getMonth(), day: dt.getDate() };
    };
    const toNum = (d) => { const { y, m, day } = toYMD(d); return y * 10000 + m * 100 + day; };

    const startNum = startDate ? toNum(startDate) : 0;
    const endNum   = endDate   ? toNum(endDate)   : 99999999;

    results = results.filter(t => {
      // t.date is ISO string — parse and use LOCAL time
      const dt  = new Date(t.date);
      const tNum = dt.getFullYear() * 10000 + dt.getMonth() * 100 + dt.getDate();
      return tNum >= startNum && tNum <= endNum;
    });
  }

  results.sort((a, b) => b._ts - a._ts);
  if (limitCount) results = results.slice(0, limitCount);

  console.log('📦 getTransactions result:', results.length);
  return results;
};

export const getMonthlySummary = async (uid, month, year) => {
  // Fetch all and filter by year+month only — no date math needed
  const all = await fetchAll(uid);
  const txs = all.filter(t => {
    const match = t.localYear === year && t.localMonth === month;
    return match;
  });
  console.log('📅 getMonthlySummary', year, month, '→ txs:', txs.length);

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
  const all  = await fetchAll(uid);
  const txs  = all.filter(t => t.localYear === year);
  const trend = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, income: 0, expense: 0 }));
  txs.forEach(t => { trend[t.localMonth - 1][t.type] += t.amount; });
  return trend;
};
