# FinSmart AI – API Reference

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### POST `/auth/register`
Register a new user.

**Body**
```json
{ "name": "Yash Tripathi", "email": "yash@example.com", "password": "secret123" }
```

**Response `201`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "name": "Yash Tripathi", "email": "yash@example.com", "currency": "INR" }
}
```

---

### POST `/auth/login`
Authenticate and receive a JWT.

**Body**
```json
{ "email": "yash@example.com", "password": "secret123" }
```

**Response `200`** – same shape as register.

---

### GET `/auth/profile` 🔒
Get the logged-in user's profile.

---

## Transactions

### POST `/transactions` 🔒
Add a new transaction.

**Body**
```json
{
  "type": "expense",
  "amount": 1200,
  "category": "Food",
  "description": "Lunch",
  "date": "2025-03-15"
}
```

`type` → `income` | `expense`

**Income categories:** Salary, Freelance, Investment, Gift, Other Income

**Expense categories:** Food, Transport, Shopping, Entertainment, Health, Education, Utilities, Rent, Travel, Other Expense

---

### GET `/transactions` 🔒
Get paginated transactions with optional filters.

| Query param | Type   | Description                    |
|-------------|--------|--------------------------------|
| `type`      | string | `income` or `expense`          |
| `category`  | string | exact category name            |
| `startDate` | ISO    | filter from date               |
| `endDate`   | ISO    | filter to date                 |
| `page`      | number | page number (default 1)        |
| `limit`     | number | results per page (default 50)  |

---

### GET `/transactions/:id` 🔒
Get a single transaction by ID.

### PUT `/transactions/:id` 🔒
Update a transaction. Send only the fields to change.

### DELETE `/transactions/:id` 🔒
Delete a transaction.

---

### GET `/transactions/summary` 🔒
Monthly income/expense summary.

| Query param | Default       |
|-------------|---------------|
| `month`     | current month |
| `year`      | current year  |

**Response**
```json
{
  "success": true,
  "data": {
    "totalIncome": 80000,
    "totalExpense": 32000,
    "netBalance": 48000,
    "categoryBreakdown": { "Food": 8000, "Transport": 2000 },
    "transactionCount": 24
  }
}
```

---

### GET `/transactions/monthly-trend` 🔒
Income and expense totals for all 12 months of a year (used for line chart).

| Query param | Default      |
|-------------|--------------|
| `year`      | current year |

---

## Budget

### POST `/budget` 🔒
Create or update the monthly budget (upsert).

**Body**
```json
{
  "month": 3,
  "year": 2025,
  "totalLimit": 50000,
  "categoryLimits": [
    { "category": "Food",      "limit": 8000 },
    { "category": "Transport", "limit": 3000 }
  ]
}
```

---

### GET `/budget` 🔒
Get the budget status, current spend, and alerts.

| Query param | Default       |
|-------------|---------------|
| `month`     | current month |
| `year`      | current year  |

**Response**
```json
{
  "success": true,
  "data": {
    "budget": { "totalLimit": 50000, "categoryLimits": [] },
    "totalSpent": 31000,
    "categorySpend": { "Food": 7200 },
    "percentUsed": "62.0",
    "alerts": [
      { "type": "warning", "message": "Food: 80% budget used (₹7200 / ₹8000)" }
    ]
  }
}
```

Alert `type` is `"warning"` (≥80%) or `"danger"` (≥100%).

---

## AI Insights

### GET `/ai/insights` 🔒
Generate AI-powered financial insights for a month.

| Query param | Default       |
|-------------|---------------|
| `month`     | current month |
| `year`      | current year  |

**Response**
```json
{
  "success": true,
  "insights": "• 💰 Financial Overview: ...\n• ✅ Savings Rate: ...",
  "summary": { "totalIncome": 80000, "totalExpense": 32000, "netBalance": 48000, "categoryBreakdown": {} }
}
```

If `GEMINI_API_KEY` is not configured the server returns rule-based mock insights automatically.

---

## Error Responses

All errors follow the same shape:
```json
{ "success": false, "message": "Human-readable error description" }
```

| Status | Meaning                         |
|--------|---------------------------------|
| 400    | Bad request / validation        |
| 401    | Missing or invalid token        |
| 404    | Resource not found              |
| 409    | Conflict (e.g. duplicate email) |
| 429    | Rate limit exceeded             |
| 500    | Internal server error           |
