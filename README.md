<div align="center">

# 💰 FinSmart AI
### Intelligent Personal Finance Assistant

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

An AI-powered full-stack MERN application that tracks income & expenses, visualises spending patterns, and generates intelligent financial insights via the Gemini API.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Future Scope](#-future-scope)

</div>

---

## ✨ Features

| Category | Details |
|---|---|
| 🔐 **Auth** | JWT-based Register / Login with protected routes |
| 💳 **Transactions** | Add / Edit / Delete income & expense transactions |
| 🗂️ **Categories** | 15 pre-defined categories with date filtering |
| 📊 **Dashboard** | Balance cards, doughnut & line charts, monthly summary |
| 🤖 **AI Insights** | Gemini-powered personalised financial advice |
| 🚨 **Budget Alerts** | Set monthly limits; warning at 80 %, danger at 100 % |
| 🌐 **REST API** | Secure, rate-limited Express API |
| 📱 **Responsive UI** | Dark-theme dashboard with sidebar navigation |

---

## 🧠 AI Capabilities

- **Insight Generator** — Powered by Google Gemini 1.5 Flash with structured prompt engineering
- **Trend Analysis** — Month-over-month spending trend detection
- **Personalised Advice** — Insights tailored to each user's transaction history
- **Graceful Fallback** — Rule-based insights when the API key is not configured

**Example AI Insight:**
> *"Your Food expenses account for 35% of total spending this month. Reducing dining expenses can help you stay within budget and improve your savings rate."*

---

## 🏗️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=flat&logo=dotenv&logoColor=black)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)

### AI
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white)

---

## 📂 Project Structure

```
AI-Finance-Tracking/
│
├── frontend/               # React UI
│   ├── src/
│   │   ├── components/     # Sidebar, StatCard, TransactionForm
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── pages/          # Dashboard, Transactions, Budget, Insights, Login, Register
│   │   └── utils/          # Axios instance with interceptors
│   └── package.json
│
├── backend/                # Node.js + Express API
│   ├── controllers/        # Business logic per resource
│   ├── middleware/         # JWT auth middleware + rate limiter
│   ├── models/             # Mongoose schemas (User, Transaction, Budget)
│   ├── routes/             # Express routers
│   ├── utils/              # Gemini AI helper
│   └── server.js
│
├── docs/
│   ├── API.md                            # Full API reference
│   └── FinSmart-AI.postman_collection.json  # Import into Postman
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16.x
- MongoDB (local or Atlas)
- Google Gemini API Key *(optional — falls back to mock insights)*

### 1. Clone the Repository

```bash
git clone https://github.com/Yash926/AI-Finance-Tracking.git
cd AI-Finance-Tracking
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev                 # starts on http://localhost:5000
```

**.env variables**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finsmart
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key   # leave blank for mock insights
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start                   # starts on http://localhost:3000
```

### 4. Postman Testing

Import `docs/FinSmart-AI.postman_collection.json` into Postman.  
The Register and Login requests auto-save the JWT to the `token` collection variable so all subsequent requests are authenticated automatically.

---

## 📊 System Workflow

```
User Login / Register
        │
        ▼
  Add Transactions
        │
        ▼
  MongoDB Storage
        │
   ┌────┴────┐
   ▼         ▼
Dashboard  AI Insights
(Charts)  (Gemini API)
   │         │
   └────┬────┘
        ▼
  Budget Alerts
```

---

## 🔄 Development Methodology

- **Agile** development workflow
- **REST API** architecture with modular controllers / routes / models
- **Version control** using Git & GitHub
- **API testing** using Postman (collection included in `docs/`)
- **Environment management** using dotenv

---

## 🎯 Project Objective

This project demonstrates how **Artificial Intelligence** can be integrated into a full-stack MERN application to build an intelligent financial decision support system — similar to enterprise solutions developed at companies like Accenture and similar tech firms.

---

## 🔭 Future Scope

- [ ] Bank API integration (Plaid / Razorpay)
- [ ] Mobile app (React Native)
- [ ] Voice assistant integration
- [ ] Multi-user analytics & admin panel
- [ ] Cloud deployment (AWS / Azure / GCP)

---

## 📖 API Reference

See [`docs/API.md`](docs/API.md) for the complete endpoint reference, or import the Postman collection from [`docs/FinSmart-AI.postman_collection.json`](docs/FinSmart-AI.postman_collection.json).

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
