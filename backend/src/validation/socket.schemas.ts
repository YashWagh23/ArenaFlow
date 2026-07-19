import { z } from 'zod';
import { SCENARIO_NAMES } from 'shared';

// All valid scenario IDs derived from shared constants — single source of truth
const validScenarioIds = [
  SCENARIO_NAMES.HEAVY_RAIN,
  SCENARIO_NAMES.METRO_DELAY,
  SCENARIO_NAMES.MEDICAL_EMERGENCY,
  SCENARIO_NAMES.GATE_OUTAGE,
  SCENARIO_NAMES.VIP_ARRIVAL,
  SCENARIO_NAMES.SECURITY_THREAT,
  SCENARIO_NAMES.FIRE_ALARM,
  SCENARIO_NAMES.MATCH_END,
] as const satisfies [string, ...string[]];

export const SimulationControlSchema = z.enum(['play', 'pause', 'reset']);

export const ScrubTimelineSchema = z
  .number()
  .int()
  .min(0)
  .max(95);

export const ExecuteStepSchema = z.object({
  eventId: z.string().min(1).max(128),
  stepId: z.string().min(1).max(64),
});

export const TriggerScenarioSchema = z.enum(validScenarioIds);

export type SimulationControlAction = z.infer<typeof SimulationControlSchema>;
export type ExecuteStepPayload = z.infer<typeof ExecuteStepSchema>;
export type TriggerScenarioId = z.infer<typeof TriggerScenarioSchema>;
