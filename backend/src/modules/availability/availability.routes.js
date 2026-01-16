import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

import {
  addAvailabilityHandler,
  getDoctorAvailabilityHandler,
} from './availability.controller.js';

const router = Router();

/**
 * Doctor adds availability
 */
router.post(
  '/',
  authenticate,
  authorize(['doctor']),
  addAvailabilityHandler
);

/**
 * Patient views doctor availability
 */
router.get(
  '/:doctorId',
  authenticate,
  getDoctorAvailabilityHandler
);

export default router;
