import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import compassRoutes from './routes/compassRoutes';
import ptnRoutes from './routes/ptnRoutes';
import bkRoutes from './routes/bkRoutes';
import actionPlanRoutes from './routes/actionPlanRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Orbita Compass Backend API', timestamp: new Date().toISOString() });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1/compass', compassRoutes);
app.use('/api/v1/ptn', ptnRoutes);
app.use('/api/v1/bk', bkRoutes);
app.use('/api/v1/action-plans', actionPlanRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Handler for undefined API routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Rute API '${req.originalUrl}' tidak ditemukan` });
});

// Centralized Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Terjadi kesalahan internal pada server Express API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Orbita Compass Backend API running on http://localhost:${PORT}`);
});
