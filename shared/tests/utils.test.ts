import assert from 'node:assert/strict';
import {
  getSeverityFromScore,
  formatSimTimestamp,
  formatProbability,
  calculateSafetyOffset,
} from '../src/utils.js';

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
// Test Suite: getSeverityFromScore
// ---------------------------------------------------------------------------

console.log('\n🧪 Shared Utilities Unit Tests\n');
console.log('  getSeverityFromScore');

test('returns optimal for score >= 85', () => {
  assert.equal(getSeverityFromScore(95), 'optimal');
});

test('returns optimal at exact boundary of 85', () => {
  assert.equal(getSeverityFromScore(85), 'optimal');
});

test('returns warning for score in [60, 84]', () => {
  assert.equal(getSeverityFromScore(70), 'warning');
});

test('returns warning at exact boundary of 60', () => {
  assert.equal(getSeverityFromScore(60), 'warning');
});

test('returns critical for score below 60', () => {
  assert.equal(getSeverityFromScore(50), 'critical');
});

test('returns critical at score 0', () => {
  assert.equal(getSeverityFromScore(0), 'critical');
});

// ---------------------------------------------------------------------------
// Test Suite: formatSimTimestamp
// ---------------------------------------------------------------------------

console.log('\n  formatSimTimestamp');

test('minute 0 → 19:00 (kick-off)', () => {
  assert.equal(formatSimTimestamp(0), '19:00');
});

test('minute 90 → 20:30 (full time)', () => {
  assert.equal(formatSimTimestamp(90), '20:30');
});

test('minute 45 → 19:45 (half time)', () => {
  assert.equal(formatSimTimestamp(45), '19:45');
});

test('minute 1 → 19:01 (zero-padded minutes)', () => {
  assert.equal(formatSimTimestamp(1), '19:01');
});

// ---------------------------------------------------------------------------
// Test Suite: formatProbability
// ---------------------------------------------------------------------------

console.log('\n  formatProbability');

test('formats 94.6 as "95%"', () => {
  assert.equal(formatProbability(94.6), '95%');
});

test('formats 0 as "0%"', () => {
  assert.equal(formatProbability(0), '0%');
});

test('formats 100 as "100%"', () => {
  assert.equal(formatProbability(100), '100%');
});

// ---------------------------------------------------------------------------
// Test Suite: calculateSafetyOffset
// ---------------------------------------------------------------------------

console.log('\n  calculateSafetyOffset');

test('with 0 incidents, returns base score unchanged', () => {
  assert.equal(calculateSafetyOffset(90, 0), 90);
});

test('with 1 incident, deducts 12 from base score', () => {
  assert.equal(calculateSafetyOffset(90, 1), 78);
});

test('clamps to minimum of 10 when incidents push score below 10', () => {
  // 90 - 7*12 = 90 - 84 = 6, clamped to 10
  assert.equal(calculateSafetyOffset(90, 7), 10);
});

test('never returns less than 10', () => {
  const result = calculateSafetyOffset(10, 100);
  assert.ok(result >= 10, `Expected >= 10, got ${result}`);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
