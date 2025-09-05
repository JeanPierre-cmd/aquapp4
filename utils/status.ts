export type Status = 'OK' | 'WARN' | 'CRIT';

export interface Thresholds {
  warn_min?: number | null;
  warn_max?: number | null;
  crit_min?: number | null;
  crit_max?: number | null;
}

/**
 * Determines the status of a value based on provided thresholds.
 * @param value The current value of the parameter.
 * @param thresholds An object containing the warning and critical thresholds.
 * @returns The status as 'OK', 'WARN', or 'CRIT'.
 */
export const getStatus = (value: number, thresholds: Thresholds | null | undefined): Status => {
  if (!thresholds) {
    return 'OK';
  }

  const { warn_min, warn_max, crit_min, crit_max } = thresholds;

  // Check for critical status first
  if ((crit_min != null && value < crit_min) || (crit_max != null && value > crit_max)) {
    return 'CRIT';
  }

  // Check for warning status
  if ((warn_min != null && value < warn_min) || (warn_max != null && value > warn_max)) {
    return 'WARN';
  }

  // Otherwise, it's OK
  return 'OK';
};
