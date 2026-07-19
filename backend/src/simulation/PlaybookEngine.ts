import { PredictionEvent, StadiumState } from 'shared';
import { IncidentManager } from './IncidentManager.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('PlaybookEngine');

/**
 * Executes individual playbook steps and manages incident resolution.
 * No knowledge of the tick loop, scenarios, or broadcaster.
 */
export class PlaybookEngine {
  constructor(private readonly incidents: IncidentManager) {}

  executeStep(
    eventId: string,
    stepId: string,
    events: PredictionEvent[],
    state: StadiumState
  ): void {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      logger.warn('executeStep called for unknown event', { eventId });
      return;
    }

    const step = event.playbook.steps.find((s) => s.id === stepId);
    if (!step) {
      logger.warn('executeStep called for unknown step', { eventId, stepId });
      return;
    }

    const isFirst = event.playbook.steps.indexOf(step) === 0;
    if (isFirst && step.status === 'pending') {
      event.currentPhase = 'operator_approval';
      this.incidents.addNotification(
        'Playbook Approved',
        `Mitigation runbook execution started for ${event.title}`,
        'low',
        'Play'
      );
      this.incidents.addTimelineItem('Playbook Approved', 'info', step.target, 'Check');
    }

    step.status = 'completed';
    event.currentPhase = 'execution';

    const allDone = event.playbook.steps.every((s) => s.status === 'completed');
    if (allDone) {
      this.resolveIncident(event, eventId, state);
    }
  }

  private resolveIncident(
    event: PredictionEvent,
    eventId: string,
    state: StadiumState
  ): void {
    event.resolved = true;
    event.currentPhase = 'resolved';

    // Derive zone from event ID — same logic as original engine
    let zoneId = 'gate-c';
    if (eventId.includes('food-b')) zoneId = 'food-court-b';
    if (eventId.includes('gate-d')) zoneId = 'gate-d';

    const zone = state.zones[zoneId];
    if (zone) {
      zone.status = 'optimal';
      zone.waitTime = Math.max(1, Math.floor(zone.waitTime / 4));
      zone.risk = 'Low';
    }

    // Special resolution for security/fire scenarios
    if (eventId.includes('scenario-security-threat') || eventId.includes('scenario-fire-alarm')) {
      state.globalSafetyScore = 98;
      state.zones['food-court-b'].status = 'optimal';
      state.zones['stand-east'].status = 'optimal';
    }

    logger.info('Incident resolved', { eventId });
    this.incidents.addNotification(
      'Incident Resolved',
      `Resolution parameters achieved for ${event.title}`,
      'medium',
      'CheckCircle'
    );
    this.incidents.addTimelineItem('Incident Resolved', 'info', zoneId, 'CheckCircle');
  }
}
