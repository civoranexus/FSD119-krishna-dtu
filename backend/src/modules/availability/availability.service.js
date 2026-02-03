import { DoctorAvailability } from '../../models/DoctorAvailability.js';
import { v4 as uuidv4 } from 'uuid';

export const addAvailability = async ({
  doctorId,
  day_of_week,
  start_time,
  end_time,
}) => {
  const id = uuidv4();

  await DoctorAvailability.create({
    _id: id,
    doctorId,
    day_of_week,
    start_time,
    end_time,
  });

  return { id };
};

export const getAvailabilityByDoctor = async (doctorId) => {
  const availabilities = await DoctorAvailability.find({ doctorId });

  // Return only relevant fields to match original response shape
  return availabilities.map((doc) => ({
    day_of_week: doc.day_of_week,
    start_time: doc.start_time,
    end_time: doc.end_time,
  }));
};
