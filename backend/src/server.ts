import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import { SimulationEngine } from './simulation/simEngine.js';

dotenv.config();

const fastify = Fastify({ logger: true });

// Register CORS
fastify.register(cors, {
  origin: '*',
});

let simEngine: SimulationEngine | null = null;

// Basic Health Check Endpoint
fastify.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Reset Endpoint
fastify.post('/api/simulation/reset', async () => {
  if (simEngine) {
    simEngine.reset();
    return { status: 'reset' };
  }
  return { error: 'engine not initialized' };
});

// Get Current State Endpoint
fastify.get('/api/simulation/state', async () => {
  if (simEngine) {
    return simEngine.getState();
  }
  return { error: 'engine not initialized' };
});

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    // Attach Socket.io to the Fastify HTTP server instance
    const io = new SocketServer(fastify.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    simEngine = new SimulationEngine(io);
    simEngine.start();

    io.on('connection', (socket) => {
      fastify.log.info(`Client connected: ${socket.id}`);
      
      // Push initial state immediately on connection
      if (simEngine) {
        socket.emit('telemetry_tick', simEngine.getState());
      }

      socket.on('simulation_control', (action: 'play' | 'pause' | 'reset') => {
        if (!simEngine) return;
        if (action === 'play') simEngine.resume();
        if (action === 'pause') simEngine.pause();
        if (action === 'reset') simEngine.reset();
      });

      socket.on('scrub_timeline', (minute: number) => {
        if (simEngine) {
          simEngine.scrub(minute);
        }
      });

      socket.on('execute_step', (data: { eventId: string; stepId: string }) => {
        if (simEngine) {
          simEngine.executePlaybookStep(data.eventId, data.stepId);
        }
      });

      socket.on('trigger_scenario', (scenarioId: string) => {
        if (simEngine) {
          simEngine.triggerScenario(scenarioId);
        }
      });

      socket.on('request_briefing', async () => {
        if (simEngine) {
          const briefing = await simEngine.generateExecutiveBriefing();
          socket.emit('briefing_generated', briefing);
        }
      });

      socket.on('disconnect', () => {
        fastify.log.info(`Client disconnected: ${socket.id}`);
      });
    });

    fastify.log.info(`Socket.io server attached to Fastify running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
