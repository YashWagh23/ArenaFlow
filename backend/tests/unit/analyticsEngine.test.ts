import assert from 'node:assert/strict';
import { calculateAnalytics } from '../../src/simulation/AnalyticsEngine.js';
import { StadiumState, PredictionEvent, MetricZone } from 'shared';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeZone(id: string, type: MetricZone['type'], waitTime = 0, load = 500, capacity = 1000): MetricZone {
  return { id, name: id, type, currentLoad: load, capacity, status: 'optimal', waitTime, risk: 'Low' };
}

function makeBaseState(): StadiumState {
  return {
    timestamp: '19:00',
    elapsedMinutes: 0,
    globalSafetyScore: 95,
    zones: {
      'gate-a': makeZone('gate-a', 'gate', 3),
      'gate-b': makeZone('gate-b', 'gate', 5),
      'parking-lot': makeZone('parking-lot', 'utility', 0, 800, 1000),
      'transit-station': makeZone('transit-station', 'transit', 0, 600, 1500),
      'food-court-a': makeZone('food-court-a', 'facility', 8),
    },
  };
}

function makeEvent(id: string, severity: PredictionEvent['severity'], resolved: boolean, steps = 1): PredictionEvent {
  return {
    id,
    title: `Event ${id}`,
    triggerTime: '19:30',
    timeOffset: 30,
    severity,
    probability: 85,
    reasoning: 'Test reasoning.',
    currentPhase: 'detection',
    playbook: {
      steps: Array.from({ length: steps }, (_, i) => ({
        id: `s${i}`,
        department: 'Security',
        action: 'Deploy',
        target: 'gate-c',
        status: 'pending' as const,
      })),
    },
    resolved,
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
// Test Suite: AnalyticsEngine
// ---------------------------------------------------------------------------

console.log('\n🧪 AnalyticsEngine Unit Tests\n');

test('calculates avgGateWait correctly from two gates (avg of 3 and 5 = 4)', () => {
  const result = calculateAnalytics(makeBaseState(), []);
  assert.equal(result.avgGateWait, 4);
});

test('calculates parkingCapacityPercent: 800 / 1000 = 80%', () => {
  const result = calculateAnalytics(makeBaseState(), []);
  assert.equal(result.parkingCapacityPercent, 80);
});

test('calculates transitLoadPercent: 600 / 1500 = 40%', () => {
  const result = calculateAnalytics(makeBaseState(), []);
  assert.equal(result.transitLoadPercent, 40);
});

test('avgFoodQueue: food-court-a waitTime 8 → result is 8', () => {
  const result = calculateAnalytics(makeBaseState(), []);
  assert.equal(result.avgFoodQueue, 8);
});

test('counts incidents correctly (1 critical, 1 warning, 1 resolved)', () => {
  const events = [
    makeEvent('e1', 'critical', false),
    makeEvent('e2', 'warning', false),
    makeEvent('e3', 'warning', true),
  ];
  const result = calculateAnalytics(makeBaseState(), events);
  assert.equal(result.activeIncidents.total, 3);
  assert.equal(result.activeIncidents.critical, 1);
  assert.equal(result.activeIncidents.warning, 1);
  assert.equal(result.activeIncidents.resolved, 1);
});

test('executiveSummary is stable/green when no events', () => {
  const result = calculateAnalytics(makeBaseState(), []);
  const lower = result.executiveSummary.toLowerCase();
  const isStable = lower.includes('stable') || lower.includes('nominal') || lower.includes('green');
  assert.ok(isStable, `Expected stable summary, got: "${result.executiveSummary}"`);
});

test('executiveSummary contains CRITICAL for unresolved critical event', () => {
  const events = [makeEvent('e1', 'critical', false)];
  const result = calculateAnalytics(makeBaseState(), events);
  assert.ok(result.executiveSummary.includes('CRITICAL'), `Got: "${result.executiveSummary}"`);
});

test('executiveSummary contains WARNING for unresolved warning event', () => {
  const events = [makeEvent('e1', 'warning', false)];
  const result = calculateAnalytics(makeBaseState(), events);
  assert.ok(result.executiveSummary.includes('WARNING'), `Got: "${result.executiveSummary}"`);
});

test('volunteersAvailable decrements by total unresolved playbook steps', () => {
  // 2 steps in event → 12 - 2 = 10
  const events = [makeEvent('e1', 'warning', false, 2)];
  const result = calculateAnalytics(makeBaseState(), events);
  assert.equal(result.volunteersAvailable, 10);
});

test('handles empty zones and empty events without throwing', () => {
  const empty: StadiumState = { timestamp: '19:00', elapsedMinutes: 0, globalSafetyScore: 100, zones: {} };
  assert.doesNotThrow(() => calculateAnalytics(empty, []));
  const result = calculateAnalytics(empty, []);
  assert.equal(result.avgGateWait, 0);
  assert.equal(result.parkingCapacityPercent, 0);
  assert.equal(result.transitLoadPercent, 0);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
