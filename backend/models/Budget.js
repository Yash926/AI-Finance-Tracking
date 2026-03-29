/**
 * Budget Model
 * Stores monthly budget limits per user per category
 */

const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number, // 1–12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalLimit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [1, 'Budget must be a positive amount'],
    },
    categoryLimits: [
      {
        category: { type: String, required: true },
        limit: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Unique budget per user per month/year
BudgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
