# -------------------------------------------------------------
# Stage 1: Build Frontend (React + Vite)
# -------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Build Backend (Node.js + Prisma)
# -------------------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend-api
COPY backend-api/package*.json ./
RUN npm install
COPY backend-api/ ./
RUN npx prisma generate && npm run build

# -------------------------------------------------------------
# Stage 3: Runner (Python 3.11 + Node.js Runtime)
# -------------------------------------------------------------
FROM python:3.11-slim

# Install Node.js for backend runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create standard Hugging Face non-root user (UID 1000)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PORT=7860 \
    DATABASE_URL="file:/home/user/app/backend-api/dev.db" \
    AI_ENGINE_URL="http://127.0.0.1:8000" \
    JWT_SECRET="orbidu_compass_super_secret_jwt_key_2026"

WORKDIR $HOME/app

# Install AI Engine dependencies
COPY --chown=user:user ai-engine/ ./ai-engine/
RUN pip install --no-cache-dir --user -r ai-engine/requirements.txt

# Install Backend production dependencies
COPY --chown=user:user backend-api/package*.json ./backend-api/
WORKDIR $HOME/app/backend-api
RUN npm install --omit=dev
COPY --chown=user:user --from=backend-builder /app/backend-api/dist ./dist
COPY --chown=user:user backend-api/prisma ./prisma
RUN npx prisma generate

# Copy built Frontend static assets
COPY --chown=user:user --from=frontend-builder /app/frontend/dist $HOME/app/frontend/dist
ENV FRONTEND_DIST=/home/user/app/frontend/dist

# Startup script
WORKDIR $HOME/app
COPY --chown=user:user start.sh ./
RUN chmod +x start.sh

EXPOSE 7860

CMD ["./start.sh"]
