import { getDb } from '../../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createAppointment = async ({
  patientId,
  doctorId,
  appointment_date,
  appointment_time,
  reason,
}) => {
  const db = getDb();
  const id = uuidv4();

  await db.execute(
    `INSERT INTO appointments 
     (id, patient_id, doctor_id, appointment_date, appointment_time, reason)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, patientId, doctorId, appointment_date, appointment_time, reason]
  );

  return { id };
};

export const getAppointmentsForPatient = async (patientId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `SELECT * FROM appointments 
     WHERE patient_id = ?
     ORDER BY appointment_date DESC`,
    [patientId]
  );

  return rows;
};

export const getAppointmentsForDoctor = async (doctorId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `SELECT * FROM appointments 
     WHERE doctor_id = ?
     ORDER BY appointment_date DESC`,
    [doctorId]
  );

  return rows;
};
export const updateAppointmentStatus = async (appointmentId, status) => {
  const db = getDb();

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
