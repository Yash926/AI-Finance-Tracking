/**
 * FinSmart AI – Minimal AI Backend
 * Only handles Gemini AI insights. Auth, DB → Firebase.
 */
const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const admin     = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

// ─── Firebase Admin Init ─────────────────────────────────────────────────────
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

// ─── Express Setup ────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// ─── Firebase Auth Middleware ─────────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = await admin.auth().verifyIdToken(header.split(' ')[1]);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ─── AI Insights Route ────────────────────────────────────────────────────────
app.post('/api/ai/insights', verifyToken, async (req, res) => {
  try {
    const { summary } = req.body;
    const insights = await generateInsights(summary);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate insights' });
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

// ─── Gemini AI ────────────────────────────────────────────────────────────────
async function generateInsights(summary) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return mockInsights(summary);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(buildPrompt(summary));
    return result.response.text();
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return mockInsights(summary);
  }
}

function buildPrompt({ totalIncome, totalExpense, netBalance, categoryBreakdown, previousMonth }) {
  const cats = Object.entries(categoryBreakdown || {}).map(([c, a]) => `  - ${c}: ₹${a.toFixed(2)}`).join('\n');
  const prev = previousMonth
    ? `\nPrevious Month:\n  Total Expense: ₹${previousMonth.totalExpense?.toFixed(2)}\n  Categories:\n${Object.entries(previousMonth.categoryBreakdown || {}).map(([c, a]) => `  - ${c}: ₹${a.toFixed(2)}`).join('\n')}`
    : '';
  return `You are a professional financial advisor. Analyze the following monthly financial data and provide personalized, actionable advice in 4-5 bullet points.

Current Month:
  Total Income:  ₹${totalIncome?.toFixed(2) || 0}
  Total Expense: ₹${totalExpense?.toFixed(2) || 0}
  Net Balance:   ₹${netBalance?.toFixed(2) || 0}

Expense Breakdown:
${cats || '  No expenses recorded'}
${prev}

Provide: overall health assessment, spending alerts, savings rate, 2-3 recommendations, motivational closing. Format as bullet points. Use ₹ for currency.`;
}

function mockInsights({ totalIncome = 0, totalExpense = 0, netBalance = 0, categoryBreakdown = {} }) {
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
  const top = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];
  const lines = [
    `• 💰 Financial Overview: You earned ₹${totalIncome.toFixed(2)} and spent ₹${totalExpense.toFixed(2)}, resulting in a net balance of ₹${netBalance.toFixed(2)}.`,
    savingsRate >= 20
      ? `• ✅ Savings Rate: Excellent! You saved ${savingsRate}% of your income.`
      : savingsRate > 0
        ? `• ⚠️ Savings Rate: You saved ${savingsRate}%. Aim for at least 20%.`
        : `• 🚨 Savings Alert: Expenses exceeded income. Review your spending immediately.`,
    top ? `• 📊 Top Expense: "${top[0]}" is ${((top[1] / totalExpense) * 100).toFixed(1)}% of total expenses (₹${top[1].toFixed(2)}).` : null,
    `• 💡 Recommendation: Set a monthly budget per category and review it weekly.`,
    `• 🎯 Goal: Build an emergency fund of ≈₹${(totalExpense * 3).toFixed(2)} (3 months of expenses).`,
  ].filter(Boolean);
  return lines.join('\n\n');
}

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AI server running on http://localhost:${PORT}`));
