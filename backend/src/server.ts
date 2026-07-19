import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';

// Load env vars before importing modules that depend on them
dotenv.config();

import { env } from './config/env.js';
import { SimulationEngine } from './simulation/SimulationEngine.js';
import { createLogger } from './utils/logger.js';
import {
  SimulationControlSchema,
  ScrubTimelineSchema,
  ExecuteStepSchema,
  TriggerScenarioSchema,
} from './validation/socket.schemas.js';

const logger = createLogger('Server');

const fastify = Fastify({ logger: true });

// ---------------------------------------------------------------------------
// Health Endpoints
// ---------------------------------------------------------------------------

let simEngine: SimulationEngine | null = null;
let io: SocketServer;

fastify.get('/health', async () => ({
  status: 'healthy',
  uptime: Math.round(process.uptime()),
  timestamp: new Date().toISOString(),
  version: process.env.npm_package_version ?? '1.0.0',
}));

fastify.get('/ready', async (_, reply) => {
  if (!simEngine) {
    return reply.code(503).send({ ready: false, reason: 'Simulation engine not initialized' });
  }
  return { ready: true, simulationRunning: simEngine.isPlaying };
});

fastify.get('/metrics', async (_, reply) => {
  if (!simEngine) {
    return reply.code(503).send({ error: 'Engine not initialized' });
  }
  const state = simEngine.getState();
  return {
    connectedClients: io?.engine.clientsCount ?? 0,
    currentMinute: simEngine.currentElapsedMinute,
    safetyScore: state.state?.globalSafetyScore ?? 0,
    activeIncidents: state.events?.filter((e) => !e.resolved).length ?? 0,
    isPlaying: simEngine.isPlaying,
    timestamp: new Date().toISOString(),
  };
});

// Existing REST endpoints — unchanged
fastify.post('/api/simulation/reset', async () => {
  if (simEngine) {
    simEngine.reset();
    return { status: 'reset' };
  }
  return { error: 'engine not initialized' };
});

fastify.get('/api/simulation/state', async () => {
  if (simEngine) {
    return simEngine.getState();
  }
  return { error: 'engine not initialized' };
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

const start = async () => {
  try {
    // Register plugins inside async function — top-level await not supported in NodeNext
    await fastify.register(helmet, { contentSecurityPolicy: false });
    await fastify.register(compress);
    await fastify.register(cors, { origin: env.CORS_ORIGIN });
    await fastify.register(rateLimit, {
      max: 120,
      timeWindow: '1 minute',
      errorResponseBuilder: () => ({
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please slow down.',
      }),
    });

    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });

    io = new SocketServer(fastify.server, {
      cors: { origin: env.CORS_ORIGIN, methods: ['GET', 'POST'] },
      maxHttpBufferSize: 1e5, // 100 KB max payload per socket message
    });

    simEngine = new SimulationEngine(io);
    simEngine.start();

    io.on('connection', (socket) => {
      logger.info('Client connected', { socketId: socket.id });

      // Push current state immediately on connect
      socket.emit('telemetry_tick', simEngine!.getState());

      // ------------------------------------------------------------------
      // simulation_control
      // ------------------------------------------------------------------
      socket.on('simulation_control', (payload: unknown) => {
        const parsed = SimulationControlSchema.safeParse(payload);
        if (!parsed.success) {
          logger.warn('Invalid simulation_control payload', {
            socketId: socket.id,
            error: parsed.error.message,
          });
          return;
        }
        const action = parsed.data;
        try {
          if (action === 'play') simEngine!.resume();
          else if (action === 'pause') simEngine!.pause();
          else if (action === 'reset') simEngine!.reset();
        } catch (err: unknown) {
          logger.error('simulation_control handler error', {
            action,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

      // ------------------------------------------------------------------
      // scrub_timeline
      // ------------------------------------------------------------------
      socket.on('scrub_timeline', (payload: unknown) => {
        const parsed = ScrubTimelineSchema.safeParse(payload);
        if (!parsed.success) {
          logger.warn('Invalid scrub_timeline payload', {
            socketId: socket.id,
            error: parsed.error.message,
          });
          return;
        }
        try {
          simEngine!.scrub(parsed.data);
        } catch (err: unknown) {
          logger.error('scrub_timeline handler error', {
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

      // ------------------------------------------------------------------
      // execute_step
      // ------------------------------------------------------------------
      socket.on('execute_step', (payload: unknown) => {
        const parsed = ExecuteStepSchema.safeParse(payload);
        if (!parsed.success) {
          logger.warn('Invalid execute_step payload', {
            socketId: socket.id,
            error: parsed.error.message,
          });
          return;
        }
        try {
          simEngine!.executePlaybookStep(parsed.data.eventId, parsed.data.stepId);
        } catch (err: unknown) {
          logger.error('execute_step handler error', {
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

      // ------------------------------------------------------------------
      // trigger_scenario
      // ------------------------------------------------------------------
      socket.on('trigger_scenario', (payload: unknown) => {
        const parsed = TriggerScenarioSchema.safeParse(payload);
        if (!parsed.success) {
          logger.warn('Invalid trigger_scenario payload', {
            socketId: socket.id,
            error: parsed.error.message,
          });
          return;
        }
        simEngine!.triggerScenario(parsed.data).catch((err: unknown) => {
          logger.error('trigger_scenario handler error', {
            scenarioId: parsed.data,
            error: err instanceof Error ? err.message : String(err),
          });
        });
      });

      // ------------------------------------------------------------------
      // request_briefing
      // ------------------------------------------------------------------
      socket.on('request_briefing', () => {
        simEngine!
          .generateExecutiveBriefing()
          .then((briefing) => socket.emit('briefing_generated', briefing))
          .catch((err: unknown) => {
            logger.error('request_briefing handler error', {
              error: err instanceof Error ? err.message : String(err),
            });
          });
      });

      socket.on('disconnect', (reason) => {
        logger.info('Client disconnected', { socketId: socket.id, reason });
      });
    });

    logger.info('Server ready', { port: env.PORT, corsOrigin: env.CORS_ORIGIN });
  } catch (err: unknown) {
    logger.error('Startup failed', { error: err instanceof Error ? err.message : String(err) });
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// Graceful Shutdown
// ---------------------------------------------------------------------------

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal} — shutting down gracefully`);
  try {
    simEngine?.stop();
    await fastify.close();
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (err: unknown) {
    logger.error('Error during shutdown', {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }
};

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

start();
