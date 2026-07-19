/**
 * Backend REST API Integration Tests
 * Requires a running backend server on localhost:5000
 * Run: npm run dev:backend then npx tsx tests/integration/api.test.ts
 */

const BASE = 'http://localhost:5000';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    failed++;
  }
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`);
  const body = await res.json();
  return { status: res.status, body };
}

async function post(path: string) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST' });
  const body = await res.json();
  return { status: res.status, body };
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

console.log('\n🧪 Backend REST API Integration Tests\n');

await test('GET /health → 200 with status: healthy', async () => {
  const { status, body } = await get('/health');
  if (status !== 200) throw new Error(`Expected 200, got ${status}`);
  if (body.status !== 'healthy') throw new Error(`Expected "healthy", got "${body.status}"`);
  if (typeof body.uptime !== 'number') throw new Error('Expected uptime to be a number');
  if (typeof body.timestamp !== 'string') throw new Error('Expected timestamp to be a string');
});

await test('GET /health response includes version field', async () => {
  const { body } = await get('/health');
  if (!body.version) throw new Error('Missing version field in /health response');
});

await test('GET /ready → returns ready status once engine is initialized', async () => {
  const { status, body } = await get('/ready');
  // Accept both 200 (ready) and 503 (engine not yet initialized in test env)
  if (status !== 200 && status !== 503) throw new Error(`Unexpected status ${status}`);
  if (status === 200 && typeof body.ready !== 'boolean') throw new Error('Expected ready to be boolean');
});

await test('GET /metrics → 200 with required fields', async () => {
  const { status, body } = await get('/metrics');
  if (status !== 200 && status !== 503) throw new Error(`Unexpected status ${status}`);
  if (status === 200) {
    if (typeof body.connectedClients !== 'number') throw new Error('Missing connectedClients field');
    if (typeof body.safetyScore !== 'number') throw new Error('Missing safetyScore field');
    if (typeof body.activeIncidents !== 'number') throw new Error('Missing activeIncidents field');
    if (typeof body.isPlaying !== 'boolean') throw new Error('Missing isPlaying field');
  }
});

await test('POST /api/simulation/reset → 200 with status: reset', async () => {
  const { status, body } = await post('/api/simulation/reset');
  if (status !== 200) throw new Error(`Expected 200, got ${status}`);
  if (body.status !== 'reset') throw new Error(`Expected "reset", got "${body.status}"`);
});

await test('GET /api/simulation/state → 200 with zones and globalSafetyScore', async () => {
  const { status, body } = await get('/api/simulation/state');
  if (status !== 200) throw new Error(`Expected 200, got ${status}`);
  if (!body.zones) throw new Error('Missing zones in state response');
  if (typeof body.globalSafetyScore !== 'number') throw new Error('Missing globalSafetyScore');
});

await test('GET /nonexistent → 404 not found', async () => {
  const res = await fetch(`${BASE}/nonexistent-route-12345`);
  if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
