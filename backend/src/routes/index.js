import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';

const router = Router();

/**
 * Base API route
 */
router.get('/', (req, res) => {
  res.json({ message: 'HealthVillage API is live' });
});

/**
 * Auth routes
 */
router.use('/auth', authRoutes);

/**
 * Any authenticated user
 */
router.get('/protected', authenticate, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

/**
 * Doctor-only route
 */
router.get(
  '/doctor-only',
  authenticate,
  authorize(['doctor']),
  (req, res) => {
    res.json({
      message: 'Doctor-only route accessed',
      user: req.user
    });
  }
);

/**
 * Admin-only route
 */
router.get(
  '/admin-only',
  authenticate,
  authorize(['admin']),
  (req, res) => {
    res.json({
      message: 'Admin-only route accessed',
      user: req.user
    });
  }
);

export default router;
