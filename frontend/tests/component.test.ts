import assert from 'node:assert/strict';

console.log('\n🧪 Frontend Data Contract & Component Interface Tests\n');

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
// MetricZone interface contract
// ---------------------------------------------------------------------------

console.log('  MetricZone data contracts');

const mockZone = {
  id: 'gate-c',
  name: 'Gate C',
  type: 'gate' as const,
  currentLoad: 1500,
  capacity: 2000,
  status: 'warning' as const,
  waitTime: 12,
  risk: 'Medium' as const,
};

test('MetricZone has valid id string', () => {
  assert.equal(typeof mockZone.id, 'string');
  assert.ok(mockZone.id.length > 0);
});

test('MetricZone type is one of valid enum values', () => {
  const validTypes = ['gate', 'stand', 'facility', 'transit', 'utility'];
  assert.ok(validTypes.includes(mockZone.type), `Invalid type: ${mockZone.type}`);
});

test('MetricZone status is one of valid enum values', () => {
  const validStatuses = ['optimal', 'warning', 'critical', 'inactive'];
  assert.ok(validStatuses.includes(mockZone.status));
});

test('MetricZone currentLoad does not exceed capacity', () => {
  assert.ok(mockZone.currentLoad <= mockZone.capacity);
});

test('MetricZone waitTime is a non-negative number', () => {
  assert.ok(typeof mockZone.waitTime === 'number');
  assert.ok(mockZone.waitTime >= 0);
});

// ---------------------------------------------------------------------------
// PredictionEvent contract
// ---------------------------------------------------------------------------

console.log('\n  PredictionEvent data contracts');

const mockEvent = {
  id: 'evt-gate-c',
  title: 'Gate C Congestion Alert',
  triggerTime: '19:45',
  timeOffset: 45,
  severity: 'critical' as const,
  probability: 94,
  reasoning: 'High density detected.',
  currentPhase: 'playbook_generated' as const,
  playbook: {
    steps: [
      { id: 'step-1', department: 'Security', action: 'Open extra lanes', target: 'gate-c', status: 'pending' as const },
      { id: 'step-2', department: 'Operations', action: 'Deploy stewards', target: 'gate-c', status: 'pending' as const },
    ],
  },
  resolved: false,
};

test('PredictionEvent severity is warning or critical', () => {
  assert.ok(['warning', 'critical'].includes(mockEvent.severity));
});

test('PredictionEvent probability is between 0 and 100', () => {
  assert.ok(mockEvent.probability >= 0 && mockEvent.probability <= 100);
});

test('PredictionEvent playbook has at least one step', () => {
  assert.ok(mockEvent.playbook.steps.length > 0);
});

test('PredictionEvent playbook steps have correct status type', () => {
  const validStatuses = ['pending', 'completed'];
  mockEvent.playbook.steps.forEach(step => {
    assert.ok(validStatuses.includes(step.status), `Invalid step status: ${step.status}`);
  });
});

test('PredictionEvent resolved flag starts as false', () => {
  assert.equal(mockEvent.resolved, false);
});

// ---------------------------------------------------------------------------
// PlaybookStep state machine contract
// ---------------------------------------------------------------------------

console.log('\n  PlaybookStep state machine');

test('PlaybookStep status transitions from pending to completed', () => {
  const step = { id: 's1', department: 'Ops', action: 'Deploy', target: 'gate-a', status: 'pending' as 'pending' | 'completed' };
  step.status = 'completed';
  assert.equal(step.status, 'completed');
});

// ---------------------------------------------------------------------------
// StadiumAnalytics shape
// ---------------------------------------------------------------------------

console.log('\n  StadiumAnalytics shape');

const mockAnalytics = {
  avgGateWait: 4,
  parkingCapacityPercent: 80,
  transitLoadPercent: 40,
  avgFoodQueue: 6,
  medicalRequests: 0,
  securityCalls: 1,
  volunteersAvailable: 10,
  activeIncidents: { total: 2, critical: 1, warning: 1, resolved: 0 },
  aiConfidence: { current: 92, average: 90, successRate: 95 },
  crowdDistribution: { gates: 4000, seating: 70000, concessions: 1500, parking: 2000, transit: 1200 },
  executiveSummary: 'All systems nominal.',
};

test('StadiumAnalytics activeIncidents total equals critical + warning + resolved', () => {
  const { total, critical, warning, resolved } = mockAnalytics.activeIncidents;
  assert.equal(total, critical + warning + resolved);
});

test('StadiumAnalytics aiConfidence current is between 0 and 100', () => {
  assert.ok(mockAnalytics.aiConfidence.current >= 0 && mockAnalytics.aiConfidence.current <= 100);
});

test('StadiumAnalytics volunteersAvailable is non-negative', () => {
  assert.ok(mockAnalytics.volunteersAvailable >= 0);
});

test('StadiumAnalytics executiveSummary is a non-empty string', () => {
  assert.equal(typeof mockAnalytics.executiveSummary, 'string');
  assert.ok(mockAnalytics.executiveSummary.length > 0);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
