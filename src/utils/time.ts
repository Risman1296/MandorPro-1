import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.locale('id');

// Get current date in ISO format (YYYY-MM-DD)
export function getCurrentDate(): string {
  return dayjs().format('YYYY-MM-DD');
}

// Get current timestamp in ISO format
export function getCurrentTimestamp(): string {
  return dayjs().toISOString();
}

// Format date for display
export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  return dayjs(date).format(format);
}

// Format currency (Indonesian Rupiah)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format time for display
export function formatTime(time: string | Date, format: string = 'HH:mm'): string {
  return dayjs(time).format(format);
}

// Format datetime for display
export function formatDateTime(datetime: string | Date, format: string = 'DD/MM/YYYY HH:mm'): string {
  return dayjs(datetime).format(format);
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

// Get start and end of week (Monday to Sunday)
export function getWeekRange(date: string | Date = new Date()): { start: string; end: string } {
  const start = dayjs(date).startOf('isoWeek');
  const end = dayjs(date).endOf('isoWeek');
  
  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
  };
}

// Get start and end of month
export function getMonthRange(date: string | Date = new Date()): { start: string; end: string } {
  const start = dayjs(date).startOf('month');
  const end = dayjs(date).endOf('month');
  
  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
  };
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

// Check if date is this week
export function isThisWeek(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), 'week');
}

// Check if date is this month
export function isThisMonth(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), 'month');
}

// Get working days between two dates (excluding weekends)
export function getWorkingDaysBetween(startDate: string | Date, endDate: string | Date): number {
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  let workingDays = 0;
  
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const dayOfWeek = current.day();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      workingDays++;
    }
    current = current.add(1, 'day');
  }
  
  return workingDays;
}

// Get days between two dates
export function getDaysBetween(startDate: string | Date, endDate: string | Date): number {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
}

// Add working days to a date
export function addWorkingDays(date: string | Date, days: number): string {
  let current = dayjs(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    current = current.add(1, 'day');
    const dayOfWeek = current.day();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  
  return current.format('YYYY-MM-DD');
}

// Get Indonesian day name
export function getIndonesianDayName(date: string | Date): string {
  const dayNames = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  return dayNames[dayjs(date).day()];
}

// Get Indonesian month name
export function getIndonesianMonthName(date: string | Date): string {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return monthNames[dayjs(date).month()];
}

// Format date in Indonesian
export function formatIndonesianDate(date: string | Date): string {
  const day = getIndonesianDayName(date);
  const dateNum = dayjs(date).date();
  const month = getIndonesianMonthName(date);
  const year = dayjs(date).year();
  
  return `${day}, ${dateNum} ${month} ${year}`;
}

// Parse time string to minutes (e.g., "08:30" -> 510)
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to time string (e.g., 510 -> "08:30")
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Calculate working hours between check-in and check-out
export function calculateWorkingHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  
  const checkInTime = dayjs(checkIn);
  const checkOutTime = dayjs(checkOut);
  
  if (checkOutTime.isBefore(checkInTime)) return 0;
  
  const totalMinutes = checkOutTime.diff(checkInTime, 'minute');
  return Math.round((totalMinutes / 60) * 100) / 100; // Round to 2 decimal places
}