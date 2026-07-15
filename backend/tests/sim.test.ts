import { SimulationEngine } from '../src/simulation/simEngine';
import { Server as SocketServer } from 'socket.io';
import assert from 'assert';

console.log('🧪 Running Backend Simulation Engine tests...');

try {
  // Mock SocketServer
  const mockIo = {
    emit: (event: string, data: any) => {},
  } as any as SocketServer;

  const engine = new SimulationEngine(mockIo);

  // Test 1: Reset Engine State
  engine.reset();
  const initial = engine.getState();
  assert.strictEqual(initial.state.elapsedMinutes, 0);
  assert.strictEqual(initial.state.globalSafetyScore, 100);
  console.log('✓ Test 1: Engine initialization passed.');

  // Test 2: Scrub Simulation Timeline
  engine.scrub(15);
  const scrubbed = engine.getState();
  assert.strictEqual(scrubbed.state.elapsedMinutes, 15);
  assert.strictEqual(scrubbed.state.zones['transit-station'].status, 'warning');
  console.log('✓ Test 2: Timeline scrubbing and zone state transitions passed.');

  // Test 3: Scenario Triggering
  engine.reset();
  engine.triggerScenario('fire-alarm');
  const scenarioState = engine.getState();
  assert.strictEqual(scenarioState.state.globalSafetyScore, 40);
  assert.strictEqual(scenarioState.state.zones['food-court-b'].status, 'critical');
  console.log('✓ Test 3: Custom scenario triggering passed.');

  console.log('🎉 All Backend Simulation tests completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Backend Simulation test failed:', error);
  process.exit(1);
}
