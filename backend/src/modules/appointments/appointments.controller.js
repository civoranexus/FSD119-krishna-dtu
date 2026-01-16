import {
  createAppointment,
  getAppointmentsForPatient,
  getAppointmentsForDoctor,
  updateAppointmentStatus,
} from './appointments.service.js';

export const createAppointmentHandler = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    const result = await createAppointment({
      patientId,
      doctorId: doctor_id,
      appointment_date,
      appointment_time,
      reason,
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
};

export const getPatientAppointmentsHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsForPatient(req.user.id);
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorAppointmentsHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsForDoctor(req.user.id);
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 🔽 STATUS HANDLERS (IMPORTANT) */

export const confirmAppointmentHandler = async (req, res) => {
  try {
    await updateAppointmentStatus(req.params.id, 'confirmed');
    res.json({ message: 'Appointment confirmed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const completeAppointmentHandler = async (req, res) => {
  try {
    await updateAppointmentStatus(req.params.id, 'completed');
    res.json({ message: 'Appointment marked as completed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelAppointmentHandler = async (req, res) => {
  try {
    await updateAppointmentStatus(req.params.id, 'cancelled');
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
