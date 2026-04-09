const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const admin   = require('firebase-admin');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// ── Auth middleware ───────────────────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = await admin.auth().verifyIdToken(header.split(' ')[1]); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
};

// ── Groq helper ───────────────────────────────────────────────────────────────
async function groqChat(messages) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(`Groq API error: ${res.status} - ${JSON.stringify(errBody)}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

// ── POST /api/ai/insights ─────────────────────────────────────────────────────
app.post('/api/ai/insights', verifyToken, async (req, res) => {
  try {
    const { summary } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return res.json({ success: true, insights: mockInsights(summary) });
    }
    const text = await groqChat([{ role: 'user', content: buildInsightPrompt(summary) }]);
    res.json({ success: true, insights: text });
  } catch (err) {
    console.error('Groq insights error:', err.message);
    res.json({ success: true, insights: mockInsights(req.body.summary || {}) });
  }
});

// ── POST /api/ai/chat ─────────────────────────────────────────────────────────
// Body: { message, context: { transactions, summary }, history: [{role,text}] }
app.post('/api/ai/chat', verifyToken, async (req, res) => {
  try {
    const { message, context, history = [] } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return res.json({ success: true, reply: "AI chat requires a Groq API key. Please configure it in the backend." });
    }

    const messages = [
      { role: 'system', content: buildChatSystemPrompt(context) },
      ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : h.role, content: h.text })),
      { role: 'user', content: message },
    ];

    const reply = await groqChat(messages);
    res.json({ success: true, reply });
  } catch (err) {
    console.error('Groq chat error:', err.message);
    res.status(500).json({ success: false, message: 'Chat failed: ' + err.message });
  }
});

// ── POST /api/ai/predict ──────────────────────────────────────────────────────
// Body: { monthlyData: [{month, year, income, expense, categoryBreakdown}] }
app.post('/api/ai/predict', verifyToken, async (req, res) => {
  try {
    const { monthlyData } = req.body;

    if (!monthlyData || monthlyData.length < 2) {
      return res.json({ success: true, predictions: null, message: 'Need at least 2 months of data for predictions.' });
    }

    // ── Linear regression per category ───────────────────────────────────────
    const predictions = computePredictions(monthlyData);

    // ── Ask Groq to narrate the predictions ──────────────────────────────────
    const apiKey = process.env.GROQ_API_KEY;
    let narrative = '';
    if (apiKey && apiKey !== 'your_groq_api_key_here') {
      try {
        narrative = await groqChat([{ role: 'user', content: buildPredictionPrompt(monthlyData, predictions) }]);
      } catch (e) {
        console.error('Prediction narrative error:', e.message);
      }
    }

    res.json({ success: true, predictions, narrative });
  } catch (err) {
    console.error('Prediction error:', err.message);
    res.status(500).json({ success: false, message: 'Prediction failed' });
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

// ── ML: Simple linear regression ─────────────────────────────────────────────
function linearRegression(values) {
  const n = values.length;
  if (n === 0) return 0;
  if (n === 1) return values[0];
  const xs = values.map((_, i) => i);
  const sumX  = xs.reduce((a, b) => a + b, 0);
  const sumY  = values.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * values[i], 0);
  const sumX2 = xs.reduce((s, x) => s + x * x, 0);
  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return Math.max(0, slope * n + intercept); // predict next point
}

function computePredictions(monthlyData) {
  // Predict total income & expense
  const incomes  = monthlyData.map(m => m.income  || 0);
  const expenses = monthlyData.map(m => m.expense || 0);

  const predictedIncome  = linearRegression(incomes);
  const predictedExpense = linearRegression(expenses);

  // Predict per category
  const allCategories = [...new Set(monthlyData.flatMap(m => Object.keys(m.categoryBreakdown || {})))];
  const categoryPredictions = {};
  allCategories.forEach(cat => {
    const vals = monthlyData.map(m => m.categoryBreakdown?.[cat] || 0);
    categoryPredictions[cat] = Math.round(linearRegression(vals));
  });

  // Trend direction
  const expenseTrend = expenses.length >= 2
    ? expenses[expenses.length - 1] > expenses[0] ? 'increasing' : 'decreasing'
    : 'stable';

  return {
    predictedIncome:  Math.round(predictedIncome),
    predictedExpense: Math.round(predictedExpense),
    predictedBalance: Math.round(predictedIncome - predictedExpense),
    categoryPredictions,
    expenseTrend,
    dataPoints: monthlyData.length,
  };
}

// ── Prompts ───────────────────────────────────────────────────────────────────
function buildInsightPrompt({ totalIncome, totalExpense, netBalance, categoryBreakdown, previousMonth }) {
  const cats = Object.entries(categoryBreakdown || {}).map(([c, a]) => `  - ${c}: ₹${a.toFixed(2)}`).join('\n');
  const prev = previousMonth
    ? `\nPrevious Month Expense: ₹${previousMonth.totalExpense?.toFixed(2)}\nPrev Categories:\n${Object.entries(previousMonth.categoryBreakdown || {}).map(([c, a]) => `  - ${c}: ₹${a.toFixed(2)}`).join('\n')}`
    : '';
  return `You are a professional financial advisor. Analyze this monthly data and give 4-5 actionable bullet points.
Income: ₹${totalIncome?.toFixed(2)||0} | Expense: ₹${totalExpense?.toFixed(2)||0} | Balance: ₹${netBalance?.toFixed(2)||0}
Categories:\n${cats||'  None'}${prev}
Format: bullet points with emoji. Use ₹. Be specific and practical.`;
}

function buildChatSystemPrompt(context) {
  if (!context) return 'You are a helpful personal financial advisor.';
  const { summary, transactions = [] } = context;
  const recentTx = transactions.slice(0, 10).map(t =>
    `  ${t.type === 'income' ? '+' : '-'}₹${t.amount} (${t.category}) on ${new Date(t.date).toLocaleDateString()}`
  ).join('\n');
  return `You are a personal AI financial advisor for this user. Here is their financial context:

Monthly Summary:
  Income:  ₹${summary?.totalIncome?.toFixed(2) || 0}
  Expense: ₹${summary?.totalExpense?.toFixed(2) || 0}
  Balance: ₹${summary?.netBalance?.toFixed(2) || 0}
  Transactions this month: ${summary?.transactionCount || 0}

Top expense categories: ${Object.entries(summary?.categoryBreakdown || {}).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c,a])=>`${c} ₹${a.toFixed(0)}`).join(', ') || 'None'}

Recent transactions:
${recentTx || '  No recent transactions'}

Answer questions about their finances concisely. Use ₹ for currency. Be helpful, specific, and encouraging.`;
}

function buildPredictionPrompt(monthlyData, predictions) {
  const months = monthlyData.map((m, i) => `Month ${i+1}: Income ₹${m.income||0}, Expense ₹${m.expense||0}`).join('\n');
  const cats = Object.entries(predictions.categoryPredictions).map(([c,v]) => `  ${c}: ₹${v}`).join('\n');
  return `Based on ${monthlyData.length} months of spending data, ML predictions for next month:
${months}

Predicted next month:
  Income:  ₹${predictions.predictedIncome}
  Expense: ₹${predictions.predictedExpense}
  Balance: ₹${predictions.predictedBalance}
  Expense trend: ${predictions.expenseTrend}

Category predictions:
${cats}

Write 3-4 bullet points interpreting these predictions. Highlight any concerning trends and give specific advice. Use ₹. Be concise.`;
}

function mockInsights({ totalIncome = 0, totalExpense = 0, netBalance = 0, categoryBreakdown = {} }) {
  const rate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
  const top  = Object.entries(categoryBreakdown).sort((a,b) => b[1]-a[1])[0];
  return [
    `• 💰 You earned ₹${totalIncome.toFixed(2)} and spent ₹${totalExpense.toFixed(2)}, net balance ₹${netBalance.toFixed(2)}.`,
    rate >= 20 ? `• ✅ Great savings rate of ${rate}%!` : rate > 0 ? `• ⚠️ Savings rate ${rate}% — aim for 20%+.` : `• 🚨 Expenses exceeded income this month.`,
    top ? `• 📊 Top expense: ${top[0]} at ₹${top[1].toFixed(2)}.` : null,
    `• 💡 Review your budget weekly to stay on track.`,
  ].filter(Boolean).join('\n\n');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AI server running on http://localhost:${PORT}`));
