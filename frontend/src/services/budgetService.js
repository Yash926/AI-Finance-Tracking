/**
 * Firestore service for budgets
 * Replaces Express /api/budget endpoints
 */
import {
  collection, doc, setDoc, getDocs, query, where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getTransactions } from './transactionService';

const budgetDocId = (uid, month, year) => `${uid}_${year}_${month}`;

export const setBudget = (uid, { month, year, totalLimit, categoryLimits }) =>
  setDoc(doc(db, 'budgets', budgetDocId(uid, month, year)), {
    uid, month, year,
    totalLimit: parseFloat(totalLimit),
    categoryLimits: categoryLimits || [],
  });

export const getBudgetWithStatus = async (uid, month, year) => {
  const snap = await getDocs(
    query(collection(db, 'budgets'), where('uid', '==', uid), where('month', '==', month), where('year', '==', year))
  );

  const budget = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };

  // Get expenses for this month
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0, 23, 59, 59);
  const expenses = await getTransactions(uid, { startDate: start, endDate: end, type: 'expense' });

  const totalSpent = expenses.reduce((s, t) => s + t.amount, 0);
  const categorySpend = {};
  expenses.forEach((t) => { categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount; });

  const alerts = [];
  if (budget) {
    if (totalSpent >= budget.totalLimit) {
      alerts.push({ type: 'danger', message: `Total budget exceeded! Spent ₹${totalSpent.toFixed(2)} of ₹${budget.totalLimit}` });
    } else if (totalSpent >= budget.totalLimit * 0.8) {
      alerts.push({ type: 'warning', message: `80% of total budget used! Spent ₹${totalSpent.toFixed(2)} of ₹${budget.totalLimit}` });
    }
    (budget.categoryLimits || []).forEach(({ category, limit }) => {
      const spent = categorySpend[category] || 0;
      if (spent >= limit) {
        alerts.push({ type: 'danger', message: `${category} budget exceeded! Spent ₹${spent.toFixed(2)} of ₹${limit}` });
      } else if (spent >= limit * 0.8) {
        alerts.push({ type: 'warning', message: `${category}: 80% budget used (₹${spent.toFixed(2)} / ₹${limit})` });
      }
    });
  }

  return {
    budget,
    totalSpent,
    categorySpend,
    alerts,
    percentUsed: budget && budget.totalLimit > 0 ? ((totalSpent / budget.totalLimit) * 100).toFixed(1) : null,
  };
};
