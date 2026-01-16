import { getDb } from '../../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export const addAvailability = async ({
  doctorId,
  day_of_week,
  start_time,
  end_time,
}) => {
  const db = getDb();
  const id = uuidv4();

  await db.execute(
    `INSERT INTO doctor_availability
     (id, doctor_id, day_of_week, start_time, end_time)
     VALUES (?, ?, ?, ?, ?)`,
    [id, doctorId, day_of_week, start_time, end_time]
  );

  return { id };
};

export const getAvailabilityByDoctor = async (doctorId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `SELECT day_of_week, start_time, end_time
     FROM doctor_availability
     WHERE doctor_id = ?`,
    [doctorId]
  );

  return rows;
};
