/**
 * Date formatting utilities that handle timezone correctly
 * Treats dates as local dates (date-only) to avoid timezone conversion issues
 */

/**
 * Parse a date string and return a Date object in local timezone
 * Handles both ISO strings and date-only strings (YYYY-MM-DD)
 */
export function parseLocalDate(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    return dateString;
  }

  // If it's a date-only string (YYYY-MM-DD), parse it as local date
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // If it's an ISO string with time, extract just the date part and parse as local
  const dateOnly = dateString.split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const [year, month, day] = dateOnly.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Fallback to standard Date parsing
  return new Date(dateString);
}

/**
 * Format date for display (short format: "3 de dez. de 2025")
 * @param date - Date string or Date object
 * @param locale - Locale string (e.g., 'pt-BR', 'en-US')
 * @returns Formatted date string
 */
export function formatArticleDate(date: string | Date, locale: string = 'pt-BR'): string {
  const localDate = parseLocalDate(date);

  // Format without timezone conversion since we're already using local date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(localDate);
}

/**
 * Format date for display (long format: "3 de dezembro de 2025")
 * @param date - Date string or Date object
 * @param locale - Locale string (e.g., 'pt-BR', 'en-US')
 * @returns Formatted date string
 */
export function formatArticleDateLong(date: string | Date, locale: string = 'pt-BR'): string {
  const localDate = parseLocalDate(date);

  // Format without timezone conversion since we're already using local date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(localDate);
}

/**
 * Format date for display (numeric format: "03/12/2025")
 * @param date - Date string or Date object
 * @param locale - Locale string (e.g., 'pt-BR', 'en-US')
 * @returns Formatted date string
 */
export function formatArticleDateNumeric(date: string | Date, locale: string = 'pt-BR'): string {
  const localDate = parseLocalDate(date);

  // Format without timezone conversion since we're already using local date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(localDate);
}

/**
 * Get date-only string (YYYY-MM-DD) from a date
 * Useful for form inputs
 */
export function getDateOnly(date: string | Date): string {
  const localDate = parseLocalDate(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

