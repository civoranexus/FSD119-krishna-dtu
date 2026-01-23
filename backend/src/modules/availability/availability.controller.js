import {
  addAvailability,
  getAvailabilityByDoctor,
} from './availability.service.js';

export const addAvailabilityHandler = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { day_of_week, start_time, end_time } = req.body;

    const result = await addAvailability({
      doctorId,
      day_of_week,
      start_time,
      end_time,
    });

    res.status(201).json({
      message: 'Availability added successfully',
      availabilityId: result.id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to add availability',
      error: error.message,
    });
  }
};

export const getDoctorAvailabilityHandler = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const availability = await getAvailabilityByDoctor(doctorId);

    res.json({ availability });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch availability',
      error: error.message,
    });
  }
};
