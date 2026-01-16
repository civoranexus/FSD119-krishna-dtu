import { getDb } from '../../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Check if appointment time falls within doctor's availability
 */
const isWithinAvailability = async (
  doctorId,
  appointmentDate,
  appointmentTime
) => {
  const db = getDb();

  const day = new Date(appointmentDate)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  const [rows] = await db.execute(
    `SELECT 1 FROM doctor_availability
     WHERE doctor_id = ?
       AND day_of_week = ?
       AND ? BETWEEN start_time AND end_time`,
    [doctorId, day, appointmentTime]
  );

  return rows.length > 0;
};

/**
 * Create appointment (PATIENT)
 */
export const createAppointment = async ({
  patientId,
  doctorId,
  appointment_date,
  appointment_time,
  reason,
}) => {
  const db = getDb();

  // 1️⃣ Prevent booking in the past
  const appointmentDateTime = new Date(
    `${appointment_date}T${appointment_time}`
  );
  if (appointmentDateTime < new Date()) {
    throw new Error('Cannot book appointment in the past');
  }

  // 2️⃣ Enforce doctor availability
  const isAvailable = await isWithinAvailability(
    doctorId,
    appointment_date,
    appointment_time
  );

  if (!isAvailable) {
    throw new Error('Doctor not available at selected time');
  }

  // 3️⃣ Prevent duplicate booking (same patient + doctor + time)
  const [existing] = await db.execute(
    `SELECT id FROM appointments
     WHERE patient_id = ?
       AND doctor_id = ?
       AND appointment_date = ?
       AND appointment_time = ?
       AND status IN ('scheduled','confirmed')`,
    [patientId, doctorId, appointment_date, appointment_time]
  );

  if (existing.length > 0) {
    throw new Error('You already have an appointment at this time');
  }

  // 4️⃣ Insert appointment
  const id = uuidv4();
  await db.execute(
    `INSERT INTO appointments
     (id, patient_id, doctor_id, appointment_date, appointment_time, reason)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, patientId, doctorId, appointment_date, appointment_time, reason]
  );

  return { id };
};

/**
 * Get appointments for patient
 */
export const getAppointmentsForPatient = async (patientId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `SELECT *
     FROM appointments
     WHERE patient_id = ?
     ORDER BY appointment_date DESC, appointment_time DESC`,
    [patientId]
  );

  return rows;
};

/**
 * Get appointments for doctor
 */
export const getAppointmentsForDoctor = async (doctorId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `SELECT *
     FROM appointments
     WHERE doctor_id = ?
     ORDER BY appointment_date DESC, appointment_time DESC`,
    [doctorId]
  );

  return rows;
};

/**
 * Update appointment status (DOCTOR / PATIENT)
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  const db = getDb();

  const allowedStatuses = ['confirmed', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid appointment status');
  }

  const [result] = await db.execute(
    `UPDATE appointments
     SET status = ?
     WHERE id = ?`,
    [status, appointmentId]
  );

  if (result.affectedRows === 0) {
    throw new Error('Appointment not found');
  }

  return true;
};
