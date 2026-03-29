/**
 * AI Controller
 * Generates financial insights using Gemini AI
 */

const Transaction = require('../models/Transaction');
const { generateFinancialInsights } = require('../utils/geminiAI');

// ─── @route   GET /api/ai/insights ───────────────────────────────────────────
const getInsights = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year  = parseInt(req.query.year)  || new Date().getFullYear();

    const startDate    = new Date(year, month - 1, 1);
    const endDate      = new Date(year, month, 0, 23, 59, 59);
    const prevStart    = new Date(year, month - 2, 1);
    const prevEnd      = new Date(year, month - 1, 0, 23, 59, 59);

    // Current month transactions
    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Previous month transactions
    const prevTransactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: prevStart, $lte: prevEnd },
    });

    // Build summary
    const summary = buildSummary(transactions);
    const previousMonth = buildSummary(prevTransactions);

    if (transactions.length === 0) {
      return res.json({
        success: true,
        insights: '• No transactions found for the selected period. Start adding your income and expenses to get personalized AI financial insights!',
      });
    }

    const insights = await generateFinancialInsights({ ...summary, previousMonth });

    res.json({ success: true, insights, summary });
  } catch (err) {
    console.error('AI insights error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate insights' });
  }
};

// ─── Helper ──────────────────────────────────────────────────────────────────
const buildSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryBreakdown = {};

  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    }
  });

  return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense, categoryBreakdown };
};

module.exports = { getInsights };
