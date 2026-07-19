import { COLOR_GREEN, COLOR_AMBER, COLOR_RED } from '../constants/theme';
import { SAFETY_THRESHOLD_OPTIMAL, SAFETY_THRESHOLD_WARNING } from '../constants/stadium';
import type { MetricZone } from 'shared';

/** Returns the brand color for a given safety score. */
export function getSafetyColor(score: number): string {
  if (score > SAFETY_THRESHOLD_OPTIMAL) return COLOR_GREEN;
  if (score > SAFETY_THRESHOLD_WARNING) return COLOR_AMBER;
  return COLOR_RED;
}

/** Returns the brand color for an event severity level. */
export function getSeverityColor(severity: 'info' | 'warning' | 'critical'): string {
  switch (severity) {
    case 'critical': return COLOR_RED;
    case 'warning':  return COLOR_AMBER;
    case 'info':     return COLOR_GREEN;
  }
}

/** Returns a CSS rgba background string for a zone status. */
export function getZoneStatusBg(status: MetricZone['status']): string {
  switch (status) {
    case 'critical': return 'rgba(200,74,74,0.10)';
    case 'warning':  return 'rgba(196,138,0,0.10)';
    case 'optimal':  return 'rgba(46,125,50,0.08)';
    case 'inactive': return 'rgba(0,0,0,0.04)';
  }
}
