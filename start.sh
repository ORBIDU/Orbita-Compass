#!/bin/bash
set -e

echo "=== 1. Initializing Prisma Database ==="
cd /home/user/app/backend-api
npx prisma db push --skip-generate
npx prisma db seed || true

echo "=== 2. Starting AI Engine (FastAPI) on port 8000 ==="
cd /home/user/app/ai-engine
python -m uvicorn main:app --host 127.0.0.1 --port 8000 &

echo "=== 3. Starting Backend API & Frontend SPA on port 7860 ==="
cd /home/user/app/backend-api
exec node dist/server.js
