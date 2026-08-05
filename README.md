# 🧭 Orbita Compass — Monorepo Workspace

Platform *Student Profiling & Academic Guidance* (SMA/SMK Indonesia).

## 🏗️ Repository Architecture

- 📱 **`frontend/`**: React + Vite + TypeScript + Tailwind CSS (Port 5173 / Vite default)
- ⚙️ **`backend-api/`**: Node.js + Express + Prisma ORM + PostgreSQL (Port 5000)
- 🤖 **`ai-engine/`**: Python FastAPI + Gemini API + Mathematical Scoring (Port 8000)

## 🚀 How to Run

### 1. Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Atau dari root directory: `npm run dev:frontend`

### 2. Backend API Server
```bash
cd backend-api
npm install
npx prisma generate
npm run dev
```
Atau dari root directory: `npm run dev:backend`

### 3. AI Engine Service
```bash
cd ai-engine
pip install -r requirements.txt
python main.py
```
Atau dari root directory: `npm run dev:ai`
