import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required', code: 'TOKEN_REQUIRED' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'orbidu_compass_super_secret_jwt_key_2026';

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      // Return 401 Unauthorized for expired or invalid token (Contract 2.6)
      return res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' });
    }
    req.user = decoded as { id: string; email: string; role: string };
    next();
  });
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Kamu tidak memiliki akses ke bagian ini',
        code: 'FORBIDDEN_ROLE'
      });
    }

    next();
  };
};
