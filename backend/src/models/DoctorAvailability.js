import mongoose from 'mongoose';

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      index: true,
    },
    day_of_week: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DoctorAvailability = mongoose.model(
  'DoctorAvailability',
  doctorAvailabilitySchema
);
