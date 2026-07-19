import { StadiumState, PredictionEvent, StadiumAnalytics } from 'shared';

/**
 * Pure function — no side effects, no class state.
 * Takes current simulation state and returns computed analytics.
 * Extracted from SimulationEngine to eliminate double-call on every broadcastState().
 */
export function calculateAnalytics(
  state: StadiumState,
  events: PredictionEvent[]
): StadiumAnalytics {
  const zones = state.zones;

  const gates = Object.values(zones).filter((z) => z.type === 'gate');
  const avgGateWait =
    gates.length > 0
      ? Math.round(gates.reduce((sum, g) => sum + g.waitTime, 0) / gates.length)
      : 0;

  const parking = zones['parking-lot'];
  const transit = zones['transit-station'];
  const parkingCapacityPercent = parking
    ? Math.round((parking.currentLoad / parking.capacity) * 100)
    : 0;
  const transitLoadPercent = transit
    ? Math.round((transit.currentLoad / transit.capacity) * 100)
    : 0;

  const food = Object.values(zones).filter((z) => z.id.includes('food-court'));
  const avgFoodQueue =
    food.length > 0
      ? Math.round(food.reduce((sum, f) => sum + f.waitTime, 0) / food.length)
      : 0;

  const total = events.length;
  const unresolvedEvents = events.filter((e) => !e.resolved);
  const critical = events.filter((e) => e.severity === 'critical' && !e.resolved).length;
  const warning = events.filter((e) => e.severity === 'warning' && !e.resolved).length;
  const resolved = events.filter((e) => e.resolved).length;

  const current = unresolvedEvents.length > 0 ? unresolvedEvents[0].probability : 94;
  const successRate = total > 0 ? Math.round((resolved / total) * 100) : 98;

  const gatesLoad = gates.reduce((sum, g) => sum + g.currentLoad, 0);
  const seatingLoad = Object.values(zones)
    .filter((z) => z.type === 'stand')
    .reduce((sum, s) => sum + s.currentLoad, 0);
  const concessionsLoad = food.reduce((sum, f) => sum + f.currentLoad, 0);

  const volunteersAvailable = Math.max(
    0,
    12 - unresolvedEvents.reduce((sum, e) => sum + e.playbook.steps.length, 0)
  );

  let executiveSummary =
    'Overall stadium operations remain within stable parameters. Telemetry lines are green.';
  const activeCritical = unresolvedEvents.find((e) => e.severity === 'critical');
  const activeWarning = unresolvedEvents.find((e) => e.severity === 'warning');

  if (activeCritical) {
    executiveSummary = `CRITICAL ALERT: ${activeCritical.title}. ${activeCritical.reasoning} AI recommends immediate playbook approval.`;
  } else if (activeWarning) {
    executiveSummary = `WARNING: ${activeWarning.title}. ${activeWarning.reasoning} Operational guidelines deployed.`;
  }

  return {
    avgGateWait,
    parkingCapacityPercent,
    transitLoadPercent,
    avgFoodQueue,
    medicalRequests: events.filter((e) => e.id.includes('medical') && !e.resolved).length,
    securityCalls: events.filter(
      (e) => (e.id.includes('security') || e.id.includes('fire')) && !e.resolved
    ).length,
    volunteersAvailable,
    activeIncidents: { total, critical, warning, resolved },
    aiConfidence: { current, average: 92, successRate },
    crowdDistribution: {
      gates: gatesLoad,
      seating: seatingLoad,
      concessions: concessionsLoad,
      parking: parking?.currentLoad ?? 0,
      transit: transit?.currentLoad ?? 0,
    },
    executiveSummary,
  };
}
