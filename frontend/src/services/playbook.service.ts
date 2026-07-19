import { socketService } from './socket.service';

/**
 * Playbook and scenario operations.
 * Event names unchanged: 'execute_step', 'trigger_scenario', 'request_briefing'.
 */
export const playbookService = {
  executeStep(eventId: string, stepId: string): void {
    socketService.emit('execute_step', { eventId, stepId });
  },
  triggerScenario(scenarioId: string): void {
    socketService.emit('trigger_scenario', scenarioId);
  },
  requestBriefing(): void {
    socketService.emit('request_briefing');
  },
};
