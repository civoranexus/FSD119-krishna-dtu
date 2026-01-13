import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'HealthVillage API is live' });
});

router.use('/auth', authRoutes);

export default router;
