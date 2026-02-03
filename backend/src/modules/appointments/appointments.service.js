import { Appointment } from '../../models/Appointment.js';
import { DoctorAvailability } from '../../models/DoctorAvailability.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Check if appointment time falls within doctor's availability
 */
const isWithinAvailability = async (
  doctorId,
  appointmentDate,
  appointmentTime
) => {
  const day = new Date(appointmentDate)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  const availability = await DoctorAvailability.findOne({
    doctorId,
    day_of_week: day,
  });

  if (!availability) {
    return false;
  }

  // Simple string comparison for time (e.g., "09:00" between "08:00" and "17:00")
  return appointmentTime >= availability.start_time && appointmentTime <= availability.end_time;
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
  const existing = await Appointment.findOne({
    patientId,
    doctorId,
    appointment_date,
    appointment_time,
    status: { $in: ['scheduled', 'confirmed'] },
  });

  if (existing) {
    throw new Error('You already have an appointment at this time');
  }

  // 4️⃣ Insert appointment
  const id = uuidv4();
  await Appointment.create({
    _id: id,
    patientId,
    doctorId,
    appointment_date,
    appointment_time,
    reason,
    status: 'scheduled',
  });

  return { id };
};

/**
 * Get appointments for patient
 */
export const getAppointmentsForPatient = async (patientId) => {
  const appointments = await Appointment.find({ patientId }).sort({
    appointment_date: -1,
    appointment_time: -1,
  });

  return appointments;
};

/**
 * Get appointments for doctor
 */
export const getAppointmentsForDoctor = async (doctorId) => {
  const appointments = await Appointment.find({ doctorId }).sort({
    appointment_date: -1,
    appointment_time: -1,
  });

  return appointments;
};

/**
 * Update appointment status (DOCTOR / PATIENT)
 */
export const updateAppointmentStatus = async (appointmentId, status) => {
  const allowedStatuses = ['confirmed', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid appointment status');
  }

  const result = await Appointment.updateOne(
    { _id: appointmentId },
    { status }
  );

  if (result.matchedCount === 0) {
    throw new Error('Appointment not found');
  }

  return true;
};
