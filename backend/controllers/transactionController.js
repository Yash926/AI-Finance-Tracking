/**
 * Transaction Controller
 * CRUD for income/expense transactions with filtering
 */

const mongoose    = require('mongoose');
const Transaction = require('../models/Transaction');

// ─── @route   POST /api/transactions ─────────────────────────────────────────
const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ success: false, message: 'type, amount, and category are required' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.error('Add transaction error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   GET /api/transactions ──────────────────────────────────────────
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 50 } = req.query;

    const query = { user: req.user.id };

    if (type)     query.type     = type;
    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate)   query.date.$lte = new Date(endDate);
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   GET /api/transactions/:id ──────────────────────────────────────
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   PUT /api/transactions/:id ──────────────────────────────────────
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   DELETE /api/transactions/:id ───────────────────────────────────
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });

    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   GET /api/transactions/summary ──────────────────────────────────
const getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth() + 1) - 1, 1);
    const endDate   = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    });

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

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categoryBreakdown,
        transactionCount: transactions.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   GET /api/transactions/monthly-trend ────────────────────────────
const getMonthlyTrend = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const pipeline = [
      {
        $match: {
          user: mongoose.Types.ObjectId.createFromHexString(req.user.id),
          date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ];

    const result = await Transaction.aggregate(pipeline);

    // Organize into months 1–12
    const trend = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));

    result.forEach(({ _id, total }) => {
      trend[_id.month - 1][_id.type] = total;
    });

    res.json({ success: true, data: trend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction, getSummary, getMonthlyTrend };
