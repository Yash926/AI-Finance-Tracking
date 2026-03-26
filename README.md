<div align="center">

# 💰 FinSmart AI
### Intelligent Personal Finance Assistant

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

An AI-powered full-stack personal finance management application that tracks expenses, analyzes spending patterns, predicts future expenses, and generates intelligent financial insights using LLMs and Machine Learning.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [System Workflow](#-system-workflow) • [Future Scope](#-future-scope)

</div>

---

## ✨ Features

| Category | Features |
|---|---|
| 🔐 **Auth** | JWT-based User Authentication |
| 💳 **Transactions** | Add / Edit / Delete Transactions |
| 📊 **Dashboard** | Charts, Monthly Summary & Analytics |
| 🤖 **AI Insights** | LLM-powered Personalized Financial Advice |
| 📈 **ML Prediction** | Future Expense Prediction using Linear Regression |
| 🚨 **Alerts** | Budget Limit Warning System |
| 🌐 **API** | Secure REST API |
| 📱 **UI** | Responsive Dashboard |

---

## 🧠 AI & ML Capabilities

- **AI Insight Generator** — Powered by Gemini / OpenAI API with prompt engineering
- **Expense Prediction** — Machine Learning model using Linear Regression (Scikit-learn)
- **Trend Analysis** — Monthly spending trend detection
- **Personalized Advice** — Insights tailored to individual transaction history
- **Budget Warnings** — Proactive alerts when approaching spending limits

**Example AI Insight:**
> *"Your food expenses increased by 18% this month. Reducing dining expenses can help you stay within budget."*

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

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)

### AI / ML
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=flat&logo=google&logoColor=white)

---

## 📂 Project Structure

```
FinSmart-AI/
│
├── frontend/               # React UI
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard, Login, etc.
│   │   └── utils/          # Axios config, helpers
│   └── package.json
│
├── backend/                # Node + Express API
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── middleware/         # JWT auth middleware
│   └── server.js
│
├── ml-model/               # Python ML prediction service
│   ├── predict.py
│   └── requirements.txt
│
├── docs/                   # Project documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- Python >= 3.8
- MongoDB (local or Atlas)
- Gemini / OpenAI API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Yash926/finsmart-ai.git
cd finsmart-ai
```

### 2. Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_url
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_gemini_or_openai_api_key
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

> API will start at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

> App will start at `http://localhost:3000`

### 5. ML Model Setup

```bash
cd ml-model
pip install pandas scikit-learn
python predict.py
```

---

## 📊 System Workflow

```
User Login
    │
    ▼
Add Transactions
    │
    ▼
MongoDB Storage
    │
    ├──────────────────────────┐
    ▼                          ▼
AI Insight Generation    ML Expense Prediction
(LLM API)                (Scikit-learn)
    │                          │
    └──────────┬───────────────┘
               ▼
      Dashboard Display
    (Charts + Insights + Alerts)
```

---

## 🔄 Development Methodology

- **Agile** development workflow
- **REST API** architecture with modular structure
- **Version control** using Git & GitHub
- **API testing** using Postman
- **Environment management** using dotenv
- **Optional containerization** with Docker

---

## 🎯 Project Objective

This project demonstrates how **Artificial Intelligence** and **Machine Learning** can be integrated into a full-stack MERN application to build an intelligent financial decision support system — similar to enterprise solutions developed at companies like Accenture and similar tech firms.

---

## 🔭 Future Scope

- [ ] Bank API integration (Plaid / Razorpay)
- [ ] Mobile app (React Native)
- [ ] Voice assistant integration
- [ ] Deep Learning-based predictions (LSTM)
- [ ] Multi-user analytics & admin panel
- [ ] Cloud deployment (AWS / Azure / GCP)

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
