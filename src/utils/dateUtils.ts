/**
 * Get the start date of the week containing the given date
 * @param date - Date object or ISO date string
 * @returns ISO date string (YYYY-MM-DD) for the start of the week (Sunday)
 */
export function getWeekStart(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = d.getDate() - day;
  const weekStart = new Date(d);
  weekStart.setDate(diff);
  return weekStart.toISOString().split('T')[0];
}

/**
 * Get the end date of the week containing the given date
 * @param date - Date object or ISO date string
 * @returns ISO date string (YYYY-MM-DD) for the end of the week (Saturday)
 */
export function getWeekEnd(date: Date | string): string {
  const weekStart = new Date(getWeekStart(date));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd.toISOString().split('T')[0];
}

/**
 * Generate an array of date strings for each day in a date range
 * @param startDate - Start date in ISO format (YYYY-MM-DD)
 * @param endDate - End date in ISO format (YYYY-MM-DD)
 * @returns Array of date strings in ISO format
 */
export function generateDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray: string[] = [];
  
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dateArray;
}

/**
 * Get date for X days ago from today or a specified date
 * @param daysAgo - Number of days to go back
 * @param fromDate - Optional reference date (defaults to today)
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getDateDaysAgo(daysAgo: number, fromDate?: Date | string): string {
  const referenceDate = fromDate 
    ? (typeof fromDate === 'string' ? new Date(fromDate) : fromDate)
    : new Date();
  
  const resultDate = new Date(referenceDate);
  resultDate.setDate(referenceDate.getDate() - daysAgo);
  return resultDate.toISOString().split('T')[0];
}

/**
 * Format date for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param format - Format option ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
    case 'long':
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    case 'medium':
    default:
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
} 