import { useMemo } from 'react';
import { useTelemetry } from '../context/SocketContext';
import { getSafetyColor } from '../utils/colors';
import { STADIUM_CAPACITY } from '../constants/stadium';

/**
 * Extracts and memoizes all computed dashboard metrics from telemetry state.
 * Only re-computes when state or events reference changes — not on every object update.
 *
 * Applied here because: this is a measurable bottleneck — Overview renders on every
 * telemetry_tick (1s interval) and all these values were being recomputed inline.
 */
export function useDashboardMetrics() {
  const { state, events, analytics, isPlaying } = useTelemetry();

  const activeEvent = useMemo(
    () => events.find((e) => !e.resolved) ?? null,
    [events]
  );

  const totalOccupancy = useMemo(() => {
    if (!state) return 0;
    return (
      (state.zones['stand-north']?.currentLoad ?? 0) +
      (state.zones['stand-south']?.currentLoad ?? 0) +
      (state.zones['stand-east']?.currentLoad ?? 0) +
      (state.zones['stand-west']?.currentLoad ?? 0)
    );
  }, [state]);

  const capacityPct = useMemo(
    () => (STADIUM_CAPACITY > 0 ? Math.round((totalOccupancy / STADIUM_CAPACITY) * 100) : 0),
    [totalOccupancy]
  );

  const safetyScore = state?.globalSafetyScore ?? 100;

  const safetyColor = useMemo(() => getSafetyColor(safetyScore), [safetyScore]);

  const activeIncidentsCount = useMemo(
    () => events.filter((e) => !e.resolved).length,
    [events]
  );

  const aiConfidence = useMemo(
    () => (activeEvent ? `${activeEvent.probability}%` : '98.2%'),
    [activeEvent]
  );

  return {
    state,
    events,
    analytics,
    isPlaying,
    activeEvent,
    totalOccupancy,
    capacityPct,
    safetyScore,
    safetyColor,
    activeIncidentsCount,
    aiConfidence,
  };
}
