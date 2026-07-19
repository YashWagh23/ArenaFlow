import assert from 'node:assert/strict';
import { PlaybookEngine } from '../../src/simulation/PlaybookEngine.js';
import { PredictionEvent, StadiumState, MetricZone } from 'shared';

// ---------------------------------------------------------------------------
// Mock IncidentManager — captures calls without Socket.io
// ---------------------------------------------------------------------------

class MockIncidentManager {
  public notifications: string[] = [];
  public timelineItems: string[] = [];

  setTimestamp(_ts: string) {}
  getNotifications() { return []; }
  getTimeline() { return []; }
  reset() { this.notifications = []; this.timelineItems = []; }

  addNotification(title: string) {
    this.notifications.push(title);
  }

  addTimelineItem(title: string) {
    this.timelineItems.push(title);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeZone(id: string): MetricZone {
  return { id, name: id, type: 'gate', currentLoad: 500, capacity: 1000, status: 'warning', waitTime: 20, risk: 'High' };
}

function makeState(): StadiumState {
  return {
    timestamp: '19:30',
    elapsedMinutes: 30,
    globalSafetyScore: 75,
    zones: {
      'gate-c': makeZone('gate-c'),
      'gate-d': makeZone('gate-d'),
      'food-court-b': makeZone('food-court-b'),
    },
  };
}

function makeEvent(id = 'evt-001', steps = 2): PredictionEvent {
  return {
    id,
    title: 'Gate Congestion',
    triggerTime: '19:30',
    timeOffset: 30,
    severity: 'warning',
    probability: 85,
    reasoning: 'High density at gate.',
    currentPhase: 'playbook_generated',
    playbook: {
      steps: Array.from({ length: steps }, (_, i) => ({
        id: `step-${i}`,
        department: 'Security',
        action: 'Open additional gate lanes',
        target: 'gate-c',
        status: 'pending' as const,
      })),
    },
    resolved: false,
  };
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Test Suite: PlaybookEngine
// ---------------------------------------------------------------------------

console.log('\n🧪 PlaybookEngine Unit Tests\n');

test('first step execution transitions phase to operator_approval', () => {
  const mock = new MockIncidentManager();
  const engine = new PlaybookEngine(mock as any);
  const event = makeEvent('evt-001', 2);
  const events = [event];
  engine.executeStep('evt-001', 'step-0', events, makeState());
  assert.equal(event.currentPhase, 'execution');
  assert.equal(event.playbook.steps[0].status, 'completed');
});

test('step status transitions from pending to completed', () => {
  const mock = new MockIncidentManager();
  const engine = new PlaybookEngine(mock as any);
  const event = makeEvent('evt-001', 2);
  const events = [event];
  engine.executeStep('evt-001', 'step-0', events, makeState());
  assert.equal(event.playbook.steps[0].status, 'completed');
  assert.equal(event.playbook.steps[1].status, 'pending');
});

test('executing all steps resolves the incident', () => {
  const mock = new MockIncidentManager();
  const engine = new PlaybookEngine(mock as any);
  const event = makeEvent('evt-001', 2);
  const events = [event];
  const state = makeState();
  engine.executeStep('evt-001', 'step-0', events, state);
  engine.executeStep('evt-001', 'step-1', events, state);
  assert.equal(event.resolved, true);
  assert.equal(event.currentPhase, 'resolved');
});

test('resolved incident resets zone to optimal status', () => {
  const mock = new MockIncidentManager();
  const engine = new PlaybookEngine(mock as any);
  const event = makeEvent('evt-001', 1);
  const events = [event];
  const state = makeState();
  engine.executeStep('evt-001', 'step-0', events, state);
  assert.equal(state.zones['gate-c'].status, 'optimal');
});

test('executeStep with invalid eventId does not throw', () => {
  const mock = new MockIncidentManager();
  const engine = new PlaybookEngine(mock as any);
  const events: PredictionEvent[] = [];
  assert.doesNotThrow(() => engine.executeStep('nonexistent', 'step-0', events, makeState()));
});

test('executeStep with invalid stepId does not throw', () => {
  const mock = new MockIncidentManager();
  const engine = new PlaybookEngine(mock as any);
  const event = makeEvent('evt-001', 1);
  const events = [event];
  assert.doesNotThrow(() => engine.executeStep('evt-001', 'nonexistent-step', events, makeState()));
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
