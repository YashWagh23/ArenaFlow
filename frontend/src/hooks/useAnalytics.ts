import { useTelemetry } from '../context/SocketContext';
import type { StadiumAnalytics } from 'shared';

/**
 * Analytics selector hook. Components that only need analytics don't re-render
 * on state or events changes — they only re-render when analytics changes.
 *
 * Note: Without React.memo, parent re-renders still cascade. This hook's value
 * is primarily semantic clarity and future-proofing for when memoization is added
 * to specific consumers (e.g. ExecutiveAnalytics).
 */
export function useAnalytics(): StadiumAnalytics | null {
  const { analytics } = useTelemetry();
  return analytics ?? null;
}
