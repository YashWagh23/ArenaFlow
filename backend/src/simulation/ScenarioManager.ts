import { StadiumState, PredictionEvent } from 'shared';
import { generatePlaybook, PlaybookContext } from '../services/ai/playbookGenerator.js';
import { IncidentManager } from './IncidentManager.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ScenarioManager');

/** Cooldown between repeated triggers of the same scenario */
const TRIGGER_COOLDOWN_MS = 5_000;
/** Auto-approve delay — allows operator time to intervene before AI self-executes */
const AUTO_APPROVE_DELAY_MS = 60_000;

/**
 * Manages scenario triggers, applies state mutations, and fires AI playbook generation.
 * Has no knowledge of the tick loop or broadcaster.
 */
export class ScenarioManager {
  private lastTriggerTimes: Record<string, number> = {};
  /** Track pending auto-approve timeouts so they can be cleared on reset */
  private pendingAutoApprove = new Set<NodeJS.Timeout>();

  constructor(private readonly incidents: IncidentManager) {}

  clearPendingApprovals(): void {
    for (const id of this.pendingAutoApprove) {
      clearTimeout(id);
    }
    this.pendingAutoApprove.clear();
  }

  isRateLimited(scenarioId: string): boolean {
    const now = Date.now();
    const last = this.lastTriggerTimes[scenarioId] ?? 0;
    return now - last < TRIGGER_COOLDOWN_MS;
  }

  recordTrigger(scenarioId: string): void {
    this.lastTriggerTimes[scenarioId] = Date.now();
  }

  /**
   * Applies scenario state mutations. Returns the modified state and new event.
   * All mutations are immutable — we work on a deep-cloned copy.
   */
  applyScenario(
    scenarioId: string,
    currentState: StadiumState
  ): { newState: StadiumState; title: string; reasoning: string; severity: 'warning' | 'critical'; targetZone: string } | null {
    const newState = JSON.parse(JSON.stringify(currentState)) as StadiumState;

    switch (scenarioId) {
      case 'heavy-rain':
        newState.globalSafetyScore = 85;
        newState.zones['parking-lot'].status = 'warning';
        newState.zones['parking-lot'].currentLoad = 2500;
        Object.values(newState.zones).forEach((z) => {
          if (z.type === 'gate') z.waitTime += 5;
        });
        return {
          newState,
          title: 'Heavy Rain / Weather Warning',
          reasoning: 'Heavy rain is slowing pedestrian flow. Parking lot entry queues backing up.',
          severity: 'warning',
          targetZone: 'parking-lot',
        };

      case 'metro-delay':
        newState.zones['transit-station'].status = 'critical';
        newState.zones['transit-station'].currentLoad = 4800;
        newState.zones['transit-station'].waitTime = 25;
        newState.zones['gate-c'].status = 'critical';
        newState.zones['gate-c'].currentLoad = 1480;
        newState.zones['gate-c'].waitTime = 40;
        return {
          newState,
          title: 'Metro Delay & Transit Lock',
          reasoning: 'Metro rail delay causing a passenger surge at outer gates.',
          severity: 'critical',
          targetZone: 'transit-station',
        };

      case 'medical-emergency':
        newState.zones['medical-center'].status = 'warning';
        newState.zones['medical-center'].currentLoad = 12;
        newState.zones['stand-east'].status = 'warning';
        return {
          newState,
          title: 'Medical Dispatch - Section 104',
          reasoning: 'Cardiac emergency call received in Stand East Section 104.',
          severity: 'critical',
          targetZone: 'medical-center',
        };

      case 'gate-scanner-failure':
        newState.zones['gate-c'].status = 'critical';
        newState.zones['gate-c'].waitTime = 50;
        newState.zones['gate-c'].risk = 'High';
        return {
          newState,
          title: 'Gate C Scanner Outage',
          reasoning: 'Hardware failure has taken out multiple turnstiles at Gate C.',
          severity: 'critical',
          targetZone: 'gate-c',
        };

      case 'vip-arrival':
        newState.zones['vip-area'].status = 'warning';
        newState.zones['vip-area'].currentLoad = 420;
        return {
          newState,
          title: 'VIP Delegation Arrival',
          reasoning: 'VIP motorcade entering VIP Lounge. Perimeter security established.',
          severity: 'warning',
          targetZone: 'vip-area',
        };

      case 'security-threat':
        newState.zones['security-office'].status = 'warning';
        newState.zones['food-court-b'].status = 'critical';
        newState.globalSafetyScore = 65;
        return {
          newState,
          title: 'Security Incident - Suspicious Bag',
          reasoning:
            'Unattended parcel reported in Food Court B corridor. Perimeter isolation required.',
          severity: 'critical',
          targetZone: 'food-court-b',
        };

      case 'fire-alarm':
        newState.globalSafetyScore = 40;
        newState.zones['food-court-b'].status = 'critical';
        newState.zones['stand-east'].status = 'critical';
        return {
          newState,
          title: 'Evacuation: Smoke Alarm in Food Court B',
          reasoning: 'Smoke detector triggered in concession zone. Initiating evacuations.',
          severity: 'critical',
          targetZone: 'food-court-b',
        };

      case 'match-end':
        newState.globalSafetyScore = 80;
        Object.values(newState.zones).forEach((z) => {
          if (z.type === 'gate') {
            z.status = 'warning';
            z.currentLoad = 1100;
            z.waitTime = 15;
          }
        });
        newState.zones['transit-station'].status = 'critical';
        newState.zones['transit-station'].currentLoad = 4900;
        return {
          newState,
          title: 'Match Final Whistle - Exit Surge',
          reasoning: 'Match complete. Spectators departing toward gates and transit lines.',
          severity: 'warning',
          targetZone: 'transit-station',
        };

      default:
        logger.warn('Unknown scenario ID — ignoring', { scenarioId });
        return null;
    }
  }

  scheduleAutoApprove(
    event: PredictionEvent,
    onApprove: (eventId: string, stepId: string) => void
  ): void {
    const timeoutId = setTimeout(() => {
      this.pendingAutoApprove.delete(timeoutId);
      if (!event.resolved && event.currentPhase === 'playbook_generated') {
        logger.info('Auto-approving playbook', { eventId: event.id });
        event.playbook.steps.forEach((step) => {
          onApprove(event.id, step.id);
        });
      }
    }, AUTO_APPROVE_DELAY_MS);

    this.pendingAutoApprove.add(timeoutId);
  }

  async generatePlaybookForEvent(
    event: PredictionEvent,
    scenarioId: string,
    context: PlaybookContext,
    onBroadcast: () => void,
    onApprove: (eventId: string, stepId: string) => void
  ): Promise<void> {
    event.currentPhase = 'prediction';

    const aiPlaybook = await generatePlaybook(scenarioId, context);

    event.currentPhase = 'playbook_generated';
    event.title = aiPlaybook.title;
    event.severity = aiPlaybook.severity;
    event.probability = aiPlaybook.confidence;
    event.reasoning = aiPlaybook.reasoning;
    event.estimatedImpact = aiPlaybook.estimatedImpact;
    event.departments = aiPlaybook.departments;
    event.playbook.steps = aiPlaybook.recommendedActions.map((action, index) => ({
      id: `step-${index}`,
      department: aiPlaybook.departments[index % aiPlaybook.departments.length],
      action,
      target: scenarioId,
      status: 'pending' as const,
    }));

    this.incidents.addNotification(
      'AI Playbook Generated',
      `Orchestrated runbook for ${event.title}.`,
      'low',
      'Sparkles'
    );
    this.incidents.addTimelineItem('AI Prediction Generated', 'info', undefined, 'Sparkles');

    onBroadcast();
    this.scheduleAutoApprove(event, onApprove);
  }
}
