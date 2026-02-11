/**
 * Application Constants
 * Centralized configuration to avoid magic numbers and strings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ⚠️ DEPRECATED - Legacy time slots (will be removed)
export const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '13:30', label: '1:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
] as const;

// Days of Week (NO SUNDAY - Business Rule)
export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
] as const;

// Slot Status Tags (for weekly grid)
export const SLOT_STATUS = {
  AVAILABLE: 'available',
  FULL: 'full',
  HOLIDAY: 'holiday',
  NOT_CONFIGURED: 'not_configured',
} as const;

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_REASON_LENGTH: 10,
  MAX_REASON_LENGTH: 500,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm',
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  APPOINTMENT_BOOKED: 'Appointment booked successfully',
  APPOINTMENT_RESCHEDULED: 'Appointment rescheduled successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  AVAILABILITY_SAVED: 'Availability saved successfully',
  ERROR_GENERIC: 'An error occurred. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_AUTH: 'Authentication failed. Please login again.',
} as const;

// Loading States
export const LOADING_MESSAGES = {
  APPOINTMENTS: 'Loading appointments...',
  DOCTORS: 'Loading doctors...',
  AVAILABILITY: 'Loading availability...',
  SAVING: 'Saving...',
  BOOKING: 'Booking appointment...',
  CANCELLING: 'Cancelling appointment...',
  LOADING: 'Loading...',
} as const;

// Empty States
export const EMPTY_MESSAGES = {
  NO_APPOINTMENTS: 'No appointments found',
  NO_DOCTORS: 'No doctors available',
  NO_AVAILABILITY: 'No availability configured',
  NO_RESULTS: 'No results found',
} as const;
