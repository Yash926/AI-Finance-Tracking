/**
 * Budget Controller
 * Set/get monthly budget and check if limits are exceeded
 */

const Budget      = require('../models/Budget');
const Transaction = require('../models/Transaction');

// ─── @route   POST /api/budget ────────────────────────────────────────────────
const setBudget = async (req, res) => {
  try {
    const { month, year, totalLimit, categoryLimits } = req.body;

    if (!month || !year || !totalLimit) {
      return res.status(400).json({ success: false, message: 'month, year, and totalLimit are required' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, month, year },
      { user: req.user.id, month, year, totalLimit, categoryLimits: categoryLimits || [] },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── @route   GET /api/budget ─────────────────────────────────────────────────
const getBudget = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year  = parseInt(req.query.year)  || new Date().getFullYear();

    const budget = await Budget.findOne({ user: req.user.id, month, year });

    // Also calculate current spend for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Transaction.find({
      user: req.user.id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate },
    });

    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Category-wise spend
    const categorySpend = {};
    expenses.forEach((t) => {
      categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
    });

    // Build alerts
    const alerts = [];
    if (budget) {
      if (totalSpent >= budget.totalLimit) {
        alerts.push({ type: 'danger', message: `Total budget exceeded! Spent ₹${totalSpent.toFixed(2)} of ₹${budget.totalLimit}` });
      } else if (totalSpent >= budget.totalLimit * 0.8) {
        alerts.push({ type: 'warning', message: `80% of total budget used! Spent ₹${totalSpent.toFixed(2)} of ₹${budget.totalLimit}` });
      }

      budget.categoryLimits.forEach(({ category, limit }) => {
        const spent = categorySpend[category] || 0;
        if (spent >= limit) {
          alerts.push({ type: 'danger', message: `${category} budget exceeded! Spent ₹${spent.toFixed(2)} of ₹${limit}` });
        } else if (spent >= limit * 0.8) {
          alerts.push({ type: 'warning', message: `${category}: 80% budget used (₹${spent.toFixed(2)} / ₹${limit})` });
        }
      });
    }

    res.json({
      success: true,
      data: {
        budget,
        totalSpent,
        categorySpend,
        alerts,
        percentUsed: budget && budget.totalLimit > 0 ? ((totalSpent / budget.totalLimit) * 100).toFixed(1) : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { setBudget, getBudget };
