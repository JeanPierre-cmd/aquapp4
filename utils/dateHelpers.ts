export const monthNameToNumber: { [key: string]: number } = {
  'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
  'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
};

/**
 * Parses a date string in "DD monthName" format into a Date object.
 * Assumes the year is provided separately.
 * @param dateString The date string (e.g., "2 febrero").
 * @param year The year to associate with the date.
 * @returns A Date object or null if parsing fails.
 */
export const parseDateString = (dateString: string, year: number): Date | null => {
  const parts = dateString.split(' ');
  if (parts.length !== 2) return null;

  const day = parseInt(parts[0], 10);
  const monthName = parts[1].toLowerCase();
  const month = monthNameToNumber[monthName];

  if (isNaN(day) || month === undefined) return null;

  return new Date(year, month, day);
};

/**
 * Checks if a given date falls within a specific quarter of a year.
 * @param date The Date object to check.
 * @param year The target year.
 * @param quarter The target quarter (1-4).
 * @returns True if the date is within the quarter, false otherwise.
 */
export const isDateInQuarter = (date: Date, year: number, quarter: number): boolean => {
  if (date.getFullYear() !== year) return false;

  const month = date.getMonth(); // 0-11
  const startMonth = (quarter - 1) * 3;
  const endMonth = startMonth + 2;

  return month >= startMonth && month <= endMonth;
};
