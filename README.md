<div align="center">

# 💚 FinSmart AI
### Intelligent Personal Finance Assistant

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Gemini_2.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

A full-stack AI-powered personal finance tracker built with React, Firebase, and Google Gemini. Track income & expenses, visualise spending patterns, set budgets, chat with an AI advisor, and get ML-powered expense predictions.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

| Category | Details |
|---|---|
| 🔐 **Auth** | Firebase Authentication — Email/Password register & login |
| 💳 **Transactions** | Add / Edit / Delete income & expense transactions with 15 categories |
| 📊 **Dashboard** | Stat cards, doughnut chart, income vs expense line chart, recent transactions |
| 🎯 **Budget Manager** | Set monthly total & per-category limits with 80% / 100% alerts |
| 🤖 **AI Insights** | Gemini 2.0 Flash — personalised monthly financial analysis |
| 💬 **AI Chatbot** | Conversational financial advisor with your transaction data as context |
| 📈 **ML Predictions** | Linear regression on past spending to predict next month's expenses per category |
| 🌗 **Dark / Light Mode** | Full theme toggle persisted to localStorage |
| 🚀 **Deployed** | Frontend on Vercel · Backend on Render |

---

## 🧠 AI & ML Capabilities

### AI Insights (Gemini 2.0 Flash)
- Monthly financial health assessment with actionable bullet points
- Month-over-month spending trend detection
- Savings rate analysis and personalised recommendations
- Graceful fallback to rule-based insights when API key is not configured

### AI Chatbot
- Conversational interface powered by Gemini with multi-turn chat history
- Full financial context injected — summary, top categories, recent transactions
- Quick-prompt suggestions for common questions
- Typing indicator and smooth chat UX

### ML Expense Predictions
- **Linear regression** computed server-side on monthly spending history
- Predicts next month's total income, expense, and per-category breakdown
- Shows trend direction (increasing / decreasing) and comparison vs last month
- Gemini narrates the predictions with actionable interpretation
- Requires minimum 2 months of data; accuracy improves with more history

---

## 🏗️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase_SDK-FFCA28?style=flat&logo=firebase&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=flat&logo=reactrouter&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Firebase Admin](https://img.shields.io/badge/Firebase_Admin-FFCA28?style=flat&logo=firebase&logoColor=black)

### Database & Auth
![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=flat&logo=firebase&logoColor=black)
![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat&logo=firebase&logoColor=black)

### AI
![Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=flat&logo=google&logoColor=white)

---

## 📂 Project Structure

```
AI-Finance-Tracking/
│
├── frontend/                        # React 19 app
│   ├── public/
│   │   ├── index.html               # Title, favicon, meta tags
│   │   └── manifest.json            # PWA manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Navigation with theme toggle
│   │   │   ├── StatCard.jsx         # Animated metric cards
│   │   │   └── TransactionForm.jsx  # Add/edit transaction modal
│   │   ├── context/
│   │   │   ├── AuthContext.js       # Firebase Auth state
│   │   │   └── ThemeContext.js      # Dark/light theme
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Overview with charts
│   │   │   ├── Transactions.jsx     # Full transaction list + filters
│   │   │   ├── Budget.jsx           # Monthly budget manager
│   │   │   ├── Insights.jsx         # AI insights + chatbot + predictions
│   │   │   ├── Login.jsx            # Split-screen auth page
│   │   │   └── Register.jsx         # Registration page
│   │   ├── services/
│   │   │   ├── transactionService.js # Firestore CRUD + client-side filtering
│   │   │   └── budgetService.js      # Budget Firestore operations
│   │   ├── firebase.js              # Firebase app init
│   │   └── index.css                # Design system (CSS variables, dark/light)
│   ├── .env.example                 # Environment variable template
│   └── vercel.json                  # React Router SPA rewrite rule
│
├── backend/                         # Minimal Express AI server
│   └── server.js                    # /api/ai/insights, /api/ai/chat, /api/ai/predict
│
├── firestore.rules                  # Firestore security rules
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- Firebase project (Firestore + Authentication enabled)
- Google Gemini API Key *(optional — falls back to rule-based insights)*

### 1. Clone

```bash
git clone https://github.com/Yash926/AI-Finance-Tracking.git
cd AI-Finance-Tracking
```

### 2. Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Enable **Firestore Database** (production mode)
4. Apply security rules from `firestore.rules`
5. Get your web app config from **Project Settings → Your apps**
6. Generate a service account key from **Project Settings → Service Accounts**

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env   # fill in your Firebase config values
npm install
npm start              # http://localhost:3000
```

**`frontend/.env`**
```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_AI_API_URL=http://localhost:5000
```

### 4. Backend Setup

```bash
cd backend
npm install
npm run dev            # http://localhost:5000
```

**`backend/.env`**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}  # minified JSON
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add all `REACT_APP_*` environment variables
4. Deploy — `vercel.json` handles React Router rewrites automatically

### Backend → Render

1. New Web Service on [render.com](https://render.com)
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. Add `GEMINI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`, `CLIENT_URL` env vars

### After deploying both

- Add your Vercel URL to **Firebase Console → Authentication → Authorized domains**
- Set `REACT_APP_AI_API_URL` in Vercel env vars to your Render URL and redeploy

---

## 🔄 System Workflow

```
User Login (Firebase Auth)
        │
        ▼
  Add Transactions → Firestore (users/{uid}/transactions)
        │
        ▼
  Dashboard fetches & aggregates client-side
        │
   ┌────┴──────────────┐
   ▼                   ▼
Charts & Stats     Budget Alerts
                        │
                        ▼
              AI Insights Page
              ┌─────┬──────┬──────────┐
              │     │      │          │
           Insights Chat  ML Predict  │
           (Gemini)(Gemini)(Linear    │
                          Regression) │
                                      ▼
                              Gemini Narration
```

---

## 🔐 Firestore Security Rules

Data is stored per user under `users/{uid}/transactions` and `budgets/{uid}_{year}_{month}`. Security rules ensure users can only read and write their own data. See `firestore.rules` for the full ruleset.

---

## 👨‍💻 Author

**Yash Tripathi**  
B.Tech — Computer Science Engineering  
Lovely Professional University

[![GitHub](https://img.shields.io/badge/GitHub-Yash926-181717?style=flat&logo=github)](https://github.com/Yash926)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-yashtripathi12-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/yashtripathi12/)

---

<div align="center">

⭐ **If you find this project useful, please consider giving it a star!** ⭐

Made with ❤️ by Yash Tripathi

</div>
