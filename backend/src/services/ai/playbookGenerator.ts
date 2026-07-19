import { callGemini } from './gemini.js';
import { buildPlaybookPrompt, buildBriefingPrompt, PlaybookContext, BriefingContext } from './promptBuilder.js';
import { parsePlaybookResponse, PlaybookPayload } from './responseParser.js';
import { createLogger } from '../../utils/logger.js';

const logger = createLogger('PlaybookGenerator');

// ---------------------------------------------------------------------------
// Mock fallback data — used when no API key is set or Gemini call fails
// ---------------------------------------------------------------------------
const MOCK_PLAYBOOKS: Record<string, PlaybookPayload> = {
  'heavy-rain': {
    title: 'Adverse Weather Operational Adjustments',
    severity: 'warning',
    confidence: 90,
    summary: 'Heavy downpour leading to slick surfaces and outdoor transit delays.',
    reasoning:
      'Inbound crowd movement has slowed by 35% due to slippery stairs and open plazas. Parking congestion is increasing as more fans seek shelter in pick-up zones.',
    estimatedImpact:
      'Safety score drop to 85% due to slip hazards; entry bottleneck delays of 15 minutes at open gates.',
    recommendedActions: [
      'Deploy traction mats at all concourse staircases',
      'Extend turnstile entry buffer limits by 10 minutes',
      'Establish traffic control lanes for passenger shuttle service',
    ],
    departments: ['Operations', 'Security'],
  },
  'metro-delay': {
    title: 'Metro Transit Congestion Mitigation Plan',
    severity: 'critical',
    confidence: 94,
    summary: 'Metro breakdown at Transit East causes passenger aggregation.',
    reasoning:
      'A 20-minute rail interruption has backed up 3,500 commuters on the boarding platform, creating pressure towards Gate C.',
    estimatedImpact: 'Crowd density risk Level 4 at East transit exit ramps within 8 minutes.',
    recommendedActions: [
      'Halt boarding escalators to transit platform level',
      'Activate smart signage directing foot traffic to shuttle lanes',
      'Coordinate with regional bus dispatch to deploy 6 emergency transport buses',
    ],
    departments: ['Transit', 'Security', 'Operations'],
  },
  'medical-emergency': {
    title: 'Cardiac Emergency Response Protocol',
    severity: 'critical',
    confidence: 98,
    summary: 'Medical assistance requested in Section 104.',
    reasoning:
      'Emergency beacon activated for a spectator experiencing chest pain and breathing difficulties.',
    estimatedImpact:
      'Critical incident response time must stay below 4 minutes to ensure safety.',
    recommendedActions: [
      'Dispatch Rapid Response Team 3 to Section 104, Seat Row G',
      'Authorize security detail to clear Medical Evacuation Corridor West',
      'Prepare Medical Bay Alpha for emergency patient intake',
    ],
    departments: ['Medical', 'Security'],
  },
  'gate-failure': {
    title: 'Scanner Outage Response Playbook',
    severity: 'critical',
    confidence: 92,
    summary: 'Scanner network outage at Gate C.',
    reasoning:
      'Local fiber connection loss has disabled turnstiles C1 through C6, trapping incoming spectator queues.',
    estimatedImpact:
      'Inflow backlog wait time rising to 45 minutes; potential crowd crushing at outer barriers.',
    recommendedActions: [
      'Deploy portable backup scanning devices to Gate C staff',
      'Divert Gate C inbound lines to adjacent Gate B portals',
      'Manually override security gate locks to allow stewarded access',
    ],
    departments: ['Operations', 'Security'],
  },
  'vip-arrival': {
    title: 'VIP Arrival Security Allocation',
    severity: 'warning',
    confidence: 86,
    summary: 'High-profile delegation arriving at VIP gate.',
    reasoning: 'Official motorcade has entered VIP Parking, requiring security path isolation.',
    estimatedImpact: 'Temporary 5-minute pedestrian delay in North Concourse corridors.',
    recommendedActions: [
      'Establish temporary VIP security corridor from gate to lounge',
      'Reallocate 4 guest relations stewards to guide VIP queues',
      'Coordinate gate access with federal security officers',
    ],
    departments: ['Security', 'Operations'],
  },
  'security-threat': {
    title: 'Suspicious Package Isolation Strategy',
    severity: 'critical',
    confidence: 95,
    summary: 'Unattended bag detected near Concession B.',
    reasoning:
      'Security patrol has flagged a suspicious container left near the main food court corridor.',
    estimatedImpact:
      'Localized evacuation required. Corridor closure could create exit path delays.',
    recommendedActions: [
      'Cordon off Concession B corridor (30-meter radius)',
      'Direct fans away from East Concourse toward West routes',
      'Dispatch Security HQ K9 sweep unit to investigate',
    ],
    departments: ['Security', 'Operations'],
  },
  'fire-alarm': {
    title: 'Localized Evacuation Directive',
    severity: 'critical',
    confidence: 99,
    summary: 'Smoke sensor activated in Food Court B kitchen.',
    reasoning:
      'Thermal detection alarm triggered, indicating localized hazard in kitchen vent exhaust.',
    estimatedImpact:
      'Safety score drops to 40% if evacuation routes are not dynamically adjusted.',
    recommendedActions: [
      'Activate localized fire suppression system at food court B',
      'Initiate zoned evacuation announcement for East Stand sectors',
      'Open emergency exit routes 4, 5, and 6 to clear the plaza',
    ],
    departments: ['Security', 'Medical', 'Operations'],
  },
  'match-end': {
    title: 'Match-End Evacuation Optimization',
    severity: 'warning',
    confidence: 93,
    summary: 'Final whistle blown. Mass exit phase initiated.',
    reasoning: '80,000 spectators exiting stands towards transport hubs simultaneously.',
    estimatedImpact:
      'Heavy transit congestion and wait times exceeding 45 minutes at Metro platforms.',
    recommendedActions: [
      'Open all exit gates A, B, C, and D to maximum width',
      'Activate transit hub platform gating to control queue density',
      'Synchronize outer traffic signals to prioritize departing shuttles',
    ],
    departments: ['Operations', 'Transit', 'Security'],
  },
};

const DEFAULT_PLAYBOOK: PlaybookPayload = {
  title: 'General Anomaly Control Protocol',
  severity: 'warning',
  confidence: 85,
  summary: 'Localized traffic density surge observed.',
  reasoning:
    'Crowd movement tracking indicates temporary bottleneck in pedestrian pathing.',
  estimatedImpact:
    'Localized delays. Safety threshold remains inside normal parameter bounds.',
  recommendedActions: ['Open overflow bypass queues', 'Deploy guest stewards to direct traffic'],
  departments: ['Operations'],
};

function getFallbackPlaybook(lookupKey: string): PlaybookPayload {
  const key = lookupKey.toLowerCase();
  if (key.includes('heavy-rain')) return MOCK_PLAYBOOKS['heavy-rain'];
  if (key.includes('metro-delay')) return MOCK_PLAYBOOKS['metro-delay'];
  if (key.includes('medical-emergency')) return MOCK_PLAYBOOKS['medical-emergency'];
  if (key.includes('gate-failure') || key.includes('gate-c')) return MOCK_PLAYBOOKS['gate-failure'];
  if (key.includes('vip-arrival')) return MOCK_PLAYBOOKS['vip-arrival'];
  if (key.includes('security-threat')) return MOCK_PLAYBOOKS['security-threat'];
  if (key.includes('fire-alarm')) return MOCK_PLAYBOOKS['fire-alarm'];
  if (key.includes('match-end') || key.includes('gate-d')) return MOCK_PLAYBOOKS['match-end'];
  return DEFAULT_PLAYBOOK;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generatePlaybook(
  zoneId: string,
  context: PlaybookContext
): Promise<PlaybookPayload> {
  const lookupKey = context.scenarioId ?? zoneId;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.debug('No GEMINI_API_KEY — using mock playbook', { lookupKey });
    return getFallbackPlaybook(lookupKey);
  }

  try {
    const prompt = buildPlaybookPrompt(zoneId, context);
    const rawText = await callGemini(prompt, apiKey);
    const payload = parsePlaybookResponse(rawText);
    logger.info('Playbook generated via Gemini', { lookupKey });
    return payload;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('Gemini call failed — falling back to mock', { lookupKey, error: message });
    return getFallbackPlaybook(lookupKey);
  }
}

export async function generateBriefing(context: BriefingContext): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  const fallback = `Overall situation is moderately stable with a Safety Index at ${context.safetyScore} percent. Currently, there are ${context.unresolvedCount} active incidents under monitoring, primarily Gate C which has an elevated queue time of ${context.avgGateWait} minutes. AI predicts crowd density risks near Transit East. Recommended actions include activating redirect signs and deploying 4 steward teams to re-route spectators. Expected outcome is crowd dispersion within 10 minutes.`;

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = buildBriefingPrompt(context);
    const text = await callGemini(prompt, apiKey);
    logger.info('Executive briefing generated via Gemini');
    return text;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('Briefing generation failed — using fallback', { error: message });
    return fallback;
  }
}

export type { PlaybookContext, PlaybookPayload };
