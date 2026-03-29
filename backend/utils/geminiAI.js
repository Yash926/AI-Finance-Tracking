/**
 * Gemini AI Utility
 * Sends financial summary to Google Gemini API and returns insights
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generate AI financial insights from transaction data
 * @param {object} summary - { totalIncome, totalExpense, netBalance, categoryBreakdown, trend }
 * @returns {string} Human-readable financial advice
 */
const generateFinancialInsights = async (summary) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // Return mock insights when API key is not configured
    return generateMockInsights(summary);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = buildPrompt(summary);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API error:', err.message);
    // Fallback to mock insights on API failure
    return generateMockInsights(summary);
  }
};

/**
 * Build a structured prompt for financial analysis
 */
const buildPrompt = (summary) => {
  const { totalIncome, totalExpense, netBalance, categoryBreakdown, previousMonth } = summary;

  const categoryList = Object.entries(categoryBreakdown || {})
    .map(([cat, amt]) => `  - ${cat}: ₹${amt.toFixed(2)}`)
    .join('\n');

  let previousMonthText = '';
  if (previousMonth) {
    const prevList = Object.entries(previousMonth.categoryBreakdown || {})
      .map(([cat, amt]) => `  - ${cat}: ₹${amt.toFixed(2)}`)
      .join('\n');
    previousMonthText = `\nPrevious Month:\n  Total Expense: ₹${previousMonth.totalExpense?.toFixed(2)}\n  Categories:\n${prevList}`;
  }

  return `You are a professional financial advisor. Analyze the following monthly financial data and provide personalized, actionable advice in 4-5 bullet points. Be specific with numbers, identify concerning trends, and suggest practical improvements.

Current Month Financial Summary:
  Total Income:  ₹${totalIncome?.toFixed(2) || 0}
  Total Expense: ₹${totalExpense?.toFixed(2) || 0}
  Net Balance:   ₹${netBalance?.toFixed(2) || 0}

Expense Breakdown by Category:
${categoryList || '  No expenses recorded'}
${previousMonthText}

Please provide:
1. Overall financial health assessment
2. Specific category spending alerts (if any)
3. Savings rate analysis
4. 2-3 actionable recommendations
5. Short motivational closing statement

Format as clear bullet points. Use ₹ for currency. Be concise and practical.`;
};

/**
 * Generate mock insights when API is not available
 */
const generateMockInsights = (summary) => {
  const { totalIncome = 0, totalExpense = 0, netBalance = 0, categoryBreakdown = {} } = summary;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  const topCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];

  const insights = [];

  insights.push(`• 💰 **Financial Overview:** You earned ₹${totalIncome.toFixed(2)} and spent ₹${totalExpense.toFixed(2)} this month, resulting in a net balance of ₹${netBalance.toFixed(2)}.`);

  if (savingsRate >= 20) {
    insights.push(`• ✅ **Savings Rate:** Excellent! You saved ${savingsRate}% of your income. Keep maintaining this healthy saving habit.`);
  } else if (savingsRate > 0) {
    insights.push(`• ⚠️ **Savings Rate:** You saved ${savingsRate}% of your income. Financial experts recommend saving at least 20% of monthly income.`);
  } else {
    insights.push(`• 🚨 **Savings Alert:** Your expenses exceeded your income this month. Consider reviewing your spending habits immediately.`);
  }

  if (topCategory) {
    const pct = ((topCategory[1] / totalExpense) * 100).toFixed(1);
    insights.push(`• 📊 **Top Expense:** "${topCategory[0]}" accounts for ${pct}% of your total expenses (₹${topCategory[1].toFixed(2)}). Consider if this aligns with your financial goals.`);
  }

  insights.push(`• 💡 **Recommendation:** Set up a monthly budget for each category and review it weekly. Small consistent cuts in discretionary spending can significantly boost savings.`);
  insights.push(`• 🎯 **Goal:** Aim to build an emergency fund of 3-6 months of expenses (≈₹${(totalExpense * 3).toFixed(2)}).`);

  return insights.join('\n\n');
};

module.exports = { generateFinancialInsights };
