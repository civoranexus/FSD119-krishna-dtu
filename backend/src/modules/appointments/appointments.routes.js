import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

import {
  createAppointmentHandler,
  getPatientAppointmentsHandler,
  getDoctorAppointmentsHandler,
  confirmAppointmentHandler,
  completeAppointmentHandler,
  cancelAppointmentHandler,
} from './appointments.controller.js';

const router = Router();

/**
 * Patient creates appointment
 */
router.post(
  '/',
  authenticate,
  authorize(['patient']),
  createAppointmentHandler
);

/**
 * Patient views own appointments
 */
router.get(
  '/patient',
  authenticate,
  authorize(['patient']),
  getPatientAppointmentsHandler
);

/**
 * Doctor views assigned appointments
 */
router.get(
  '/doctor',
  authenticate,
  authorize(['doctor']),
  getDoctorAppointmentsHandler
);

/**
 * Doctor confirms appointment
 */
router.patch(
  '/:id/confirm',
  authenticate,
  authorize(['doctor']),
  confirmAppointmentHandler
);

/**
 * Doctor completes appointment
 */
router.patch(
  '/:id/complete',
  authenticate,
  authorize(['doctor']),
  completeAppointmentHandler
);

/**
 * Patient cancels appointment
 */
router.patch(
  '/:id/cancel',
  authenticate,
  authorize(['patient']),
  cancelAppointmentHandler
);

export default router;
