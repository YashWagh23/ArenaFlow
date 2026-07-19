import { Server as SocketServer } from 'socket.io';
import { StadiumState, PredictionEvent } from 'shared';
import { initialZones, updateTimelineState } from './scenarioData.js';
import { SimulationClock } from './SimulationClock.js';
import { IncidentManager } from './IncidentManager.js';
import { ScenarioManager } from './ScenarioManager.js';
import { PlaybookEngine } from './PlaybookEngine.js';
import { Broadcaster } from './Broadcaster.js';
import { generatePlaybook, generateBriefing } from '../services/ai/playbookGenerator.js';
import { createLogger } from '../utils/logger.js';


const logger = createLogger('SimulationEngine');

function createInitialState(): StadiumState {
  return {
    timestamp: '19:00',
    elapsedMinutes: 0,
    globalSafetyScore: 100,
    zones: JSON.parse(JSON.stringify(initialZones)) as StadiumState['zones'],
  };
}

/**
 * Orchestrates all simulation sub-engines.
 * Public API is unchanged — server.ts calls are identical.
 */
export class SimulationEngine {
  private currentMinute = 0;
  private state: StadiumState = createInitialState();
  private events: PredictionEvent[] = [];

  private readonly clock: SimulationClock;
  private readonly incidents: IncidentManager;
  private readonly scenarios: ScenarioManager;
  private readonly playbooks: PlaybookEngine;
  private readonly broadcaster: Broadcaster;

  constructor(private readonly io: SocketServer) {
    this.clock = new SimulationClock(1000);
    this.incidents = new IncidentManager(io);
    this.scenarios = new ScenarioManager(this.incidents);
    this.playbooks = new PlaybookEngine(this.incidents);
    this.broadcaster = new Broadcaster(io, this.incidents);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public start(): void {
    this.incidents.addNotification(
      'Simulation Init',
      'ArenaFlow live operations telemetry linked.',
      'low',
      'Shield'
    );
    this.incidents.addTimelineItem('Simulation Started', 'info', undefined, 'Play');
    this.clock.start(() => this.tick());
    logger.info('Simulation engine started');
  }

  public pause(): void {
    this.clock.pause();
    this.broadcastState();
    logger.info('Simulation paused');
  }

  public resume(): void {
    this.clock.resume();
    this.broadcastState();
    logger.info('Simulation resumed');
  }

  public reset(): void {
    this.scenarios.clearPendingApprovals();
    this.currentMinute = 0;
    this.events = [];
    this.state = createInitialState();
    this.incidents.reset();
    this.incidents.addNotification('Simulation Reset', 'Telemetry baseline restored.', 'low', 'RotateCcw');
    this.incidents.addTimelineItem('Simulation Started', 'info', undefined, 'Play');
    this.broadcastState();
    logger.info('Simulation reset to baseline');
  }

  public scrub(minute: number): void {
    if (minute < 0 || minute > 95) return;
    this.currentMinute = minute;

    this.events = this.events.filter((e) => {
      const [h, m] = e.triggerTime.split(':').map(Number);
      const triggerMinutes = h * 60 + m - 19 * 60;
      return triggerMinutes <= minute;
    });

    const result = updateTimelineState(this.currentMinute, this.state, this.events);
    this.state = result.state;
    this.events = result.events;
    logger.info(`Scrubbed to minute ${minute}`);
    this.broadcastState();
  }

  // ---------------------------------------------------------------------------
  // Scenario + Playbook
  // ---------------------------------------------------------------------------

  public async triggerScenario(scenarioId: string): Promise<void> {
    if (this.scenarios.isRateLimited(scenarioId)) {
      logger.warn('Scenario trigger rate-limited', { scenarioId });
      return;
    }

    this.scenarios.recordTrigger(scenarioId);
    this.clock.pause();

    const applied = this.scenarios.applyScenario(scenarioId, this.state);
    if (!applied) return;

    const { newState, title, reasoning, severity, targetZone } = applied;
    const newEventId = `scenario-${scenarioId}-${Date.now()}`;

    const newEvent: PredictionEvent = {
      id: newEventId,
      title,
      triggerTime: newState.timestamp,
      timeOffset: 0,
      severity,
      probability: 95,
      reasoning,
      currentPhase: 'detection',
      playbook: { steps: [] },
      resolved: false,
    };

    this.events.unshift(newEvent);
    this.state = newState;

    this.incidents.setTimestamp(newState.timestamp);
    this.incidents.addNotification(
      `Incident: ${title}`,
      reasoning,
      severity === 'critical' ? 'high' : 'medium',
      'AlertTriangle'
    );
    this.incidents.addTimelineItem(title, severity, targetZone, 'Warning');
    this.broadcastState();

    logger.info('Scenario triggered', { scenarioId, eventId: newEventId });

    try {
      await this.scenarios.generatePlaybookForEvent(
        newEvent,
        scenarioId,
        {
          scenarioId,
          timestamp: this.state.timestamp,
          elapsedMinutes: this.state.elapsedMinutes,
          crowd: 8000,
          capacity: 20000,
          waitTime: 15,
          safetyScore: this.state.globalSafetyScore,
          nearby: ['security-office', 'medical-center'],
          events: this.events,
        },
        () => this.broadcastState(),
        (eId, sId) => this.executePlaybookStep(eId, sId)
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error('Playbook generation failed for scenario', { scenarioId, error: message });
    }
  }

  public executePlaybookStep(eventId: string, stepId: string): void {
    this.playbooks.executeStep(eventId, stepId, this.events, this.state);
    this.broadcastState();
  }

  // ---------------------------------------------------------------------------
  // Tick
  // ---------------------------------------------------------------------------

  private async tick(): Promise<void> {
    this.currentMinute++;
    if (this.currentMinute > 95) {
      this.reset();
      return;
    }

    const prevSafety = this.state.globalSafetyScore;
    const result = updateTimelineState(this.currentMinute, this.state, this.events);
    this.state = result.state;
    this.events = result.events;

    this.incidents.setTimestamp(this.state.timestamp);

    if (Math.abs(prevSafety - this.state.globalSafetyScore) > 3) {
      this.incidents.addNotification(
        'Safety Index Changed',
        `Global safety factor shifted to ${this.state.globalSafetyScore}%.`,
        'medium',
        'Shield'
      );
    }

    // Fire AI playbook for newly detected events
    for (const event of this.events) {
      if (event.playbook.steps.length === 0 && !event.resolved) {
        let zoneId = 'gate-c';
        if (event.id.includes('food-b')) zoneId = 'food-court-b';
        if (event.id.includes('gate-d')) zoneId = 'gate-d';

        const zone = this.state.zones[zoneId];

        try {
          event.currentPhase = 'prediction';
          logger.info('Requesting AI playbook for tick anomaly', { eventId: event.id });

          const aiPlaybook = await generatePlaybook(zoneId, {
            timestamp: this.state.timestamp,
            elapsedMinutes: this.state.elapsedMinutes,
            crowd: zone?.currentLoad ?? 0,
            capacity: zone?.capacity ?? 1000,
            waitTime: zone?.waitTime ?? 0,
            safetyScore: this.state.globalSafetyScore,
            nearby: ['vip-area', 'security-office', 'medical-center'],
            events: this.events,
          });

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
            target: zoneId,
            status: 'pending' as const,
          }));

          this.incidents.addNotification(
            'AI Anomaly Forecasted',
            `AI predicted crowd choke risk at ${zone?.name ?? zoneId}`,
            'medium',
            'Brain'
          );
          this.incidents.addTimelineItem(
            `AI Prediction: ${zone?.name ?? zoneId}`,
            'warning',
            zoneId,
            'Brain'
          );
          this.broadcastState();

          this.scenarios.scheduleAutoApprove(event, (eId, sId) =>
            this.executePlaybookStep(eId, sId)
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          logger.error('Playbook trigger failed for tick anomaly', { eventId: event.id, error: message });
        }
      }
    }

    this.broadcastState();
  }

  // ---------------------------------------------------------------------------
  // Executive Briefing
  // ---------------------------------------------------------------------------

  public async generateExecutiveBriefing(): Promise<string> {
    const unresolvedCount = this.events.filter((e) => !e.resolved).length;
    const lastAnalytics = this.broadcaster.getLastAnalytics();
    const avgGateWait = lastAnalytics?.avgGateWait ?? 0;

    logger.info('Executive briefing requested');

    return generateBriefing({
      safetyScore: this.state.globalSafetyScore,
      unresolvedCount,
      avgGateWait,
      activeEventTitles: this.events
        .filter((e) => !e.resolved)
        .map((e) => e.title),
    });
  }

  // ---------------------------------------------------------------------------
  // State Access (for REST endpoints)
  // ---------------------------------------------------------------------------

  public broadcastState(): void {
    this.broadcaster.broadcast(this.state, this.events, this.clock.isPlaying);
  }

  public getState() {
    const lastAnalytics = this.broadcaster.getLastAnalytics();
    return {
      state: this.state,
      events: this.events,
      isPlaying: this.clock.isPlaying,
      analytics: lastAnalytics,
      notifications: this.incidents.getNotifications(),
      timeline: this.incidents.getTimeline(),
    };
  }

  public get isPlaying(): boolean {
    return this.clock.isPlaying;
  }

  public get currentElapsedMinute(): number {
    return this.currentMinute;
  }

  public stop(): void {
    this.clock.stop();
    this.scenarios.clearPendingApprovals();
    logger.info('Simulation engine stopped');
  }
}
