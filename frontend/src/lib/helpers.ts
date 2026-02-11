/**
 * Helper Utilities
 * Common functions used across the application
 */

/**
 * ⚠️ DEPRECATED - Legacy date formatter (will be removed)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * ⚠️ DEPRECATED - Legacy time formatter (will be removed)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * ⚠️ DEPRECATED - Legacy datetime formatter (will be removed)
 */
export function formatDateTime(date: string | Date, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}

/**
 * Format day name (capitalize first letter)
 * DEFENSIVE: Returns "N/A" if day is undefined/null/invalid
 */
export function formatDayName(day?: string): string {
  if (!day || typeof day !== "string") return "N/A";
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/**
 * Format slot index as display string
 * DEFENSIVE: Returns "N/A" if slotIndex is invalid
 */
import { TIME_SLOTS } from "./constants";

export function formatSlotIndex(slotIndex?: number): string {
  if (slotIndex === undefined || slotIndex === null || typeof slotIndex !== "number") return "N/A";
  // Defensive: If slotIndex is out of range, fallback to Slot #
  if (slotIndex < 0 || slotIndex >= TIME_SLOTS.length) return `Slot #${slotIndex + 1}`;
  const start = TIME_SLOTS[slotIndex].label;
  // If not last slot, show range; else just show start time
  const end = slotIndex + 1 < TIME_SLOTS.length ? TIME_SLOTS[slotIndex + 1].label : undefined;
  return end ? `${start} – ${end}` : start;
}

/**
 * Format day + slot for display
 * DEFENSIVE: Handles missing values gracefully
 */
export function formatDaySlot(day?: string, slotIndex?: number): string {
  const dayStr = formatDayName(day);
  const slotStr = formatSlotIndex(slotIndex);
  if (dayStr === "N/A" && slotStr === "N/A") return "N/A";
  if (dayStr === "N/A") return slotStr;
  if (slotStr === "N/A") return dayStr;
  return `${dayStr} - ${slotStr}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if a date is Sunday (BUSINESS RULE: NO SUNDAYS)
 */
export function isSunday(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00.000Z') : date;
  return d.getUTCDay() === 0; // 0 = Sunday
}

/**
 * Get day of week name from date
 */
export function getDayOfWeek(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00.000Z') : date;
  return d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string): boolean {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Validate appointment reason
 */
export function validateReason(reason: string): string | null {
  if (!reason || reason.trim().length === 0) {
    return 'Reason is required';
  }
  if (reason.trim().length < 10) {
    return 'Reason must be at least 10 characters';
  }
  if (reason.length > 500) {
    return 'Reason must not exceed 500 characters';
  }
  return null;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Parse API error message
 */
export function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unexpected error occurred';
}

/**
 * Format availability error message for user-friendly display
 */
export function formatAvailabilityError(
  doctorName: string | undefined,
  availableSlots: Array<{ date: string; slots: string[] }> | null,
  errorCode?: string
): string {
  // Handle Sunday-specific error
  if (errorCode === 'SUNDAY_CLOSED') {
    return 'Doctors are not available on Sundays. Please select a weekday.';
  }

  if (!availableSlots || availableSlots.length === 0) {
    return `${doctorName || 'This doctor'} has no available slots at this time. Please check back later or contact support.`;
  }

  const firstSlot = availableSlots[0];
  const dayOfWeek = getDayOfWeek(firstSlot.date);
  const timeRange = `${formatTime(firstSlot.slots[0])} – ${formatTime(firstSlot.slots[firstSlot.slots.length - 1])}`;
  
  return `${doctorName || 'This doctor'} is available only on days like ${dayOfWeek} (${timeRange}). Please select from available dates.`;
}

/**
 * Check if appointment can be rescheduled
 */
export function canRescheduleAppointment(status: string): boolean {
  return status === 'scheduled' || status === 'confirmed';
}

/**
 * Check if appointment can be cancelled
 */
export function canCancelAppointment(status: string): boolean {
  return status === 'scheduled' || status === 'confirmed';
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'scheduled':
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'confirmed':
      return 'text-blue-600 bg-blue-50';
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Sort appointments by date and time
 */
export function sortAppointments<T extends { appointment_date: string; appointment_time: string }>(
  appointments: T[]
): T[] {
  return [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
    const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Group appointments by date
 */
export function groupAppointmentsByDate<T extends { appointment_date: string }>(
  appointments: T[]
): Record<string, T[]> {
  return appointments.reduce((groups, appointment) => {
    const date = appointment.appointment_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, T[]>);
}
