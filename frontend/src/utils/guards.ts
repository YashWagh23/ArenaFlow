import type { StadiumState, PredictionEvent, MetricZone, StadiumAnalytics } from 'shared';

/** Narrows an unknown value to StadiumState */
export function isStadiumState(value: unknown): value is StadiumState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'timestamp' in value &&
    'zones' in value &&
    'globalSafetyScore' in value
  );
}

/** Narrows an unknown value to PredictionEvent */
export function isPredictionEvent(value: unknown): value is PredictionEvent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'severity' in value &&
    'playbook' in value
  );
}

/** Narrows an unknown value to MetricZone */
export function isMetricZone(value: unknown): value is MetricZone {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'currentLoad' in value &&
    'capacity' in value
  );
}

/** Narrows an unknown value to StadiumAnalytics */
export function isStadiumAnalytics(value: unknown): value is StadiumAnalytics {
  return (
    typeof value === 'object' &&
    value !== null &&
    'avgGateWait' in value &&
    'activeIncidents' in value &&
    'aiConfidence' in value
  );
}

/** Extracts a safe error message from an unknown catch value */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred';
}
