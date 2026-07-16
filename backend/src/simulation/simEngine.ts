import { Server as SocketServer } from 'socket.io';
import { StadiumState, PredictionEvent, StadiumAnalytics, AppNotification, TimelineItem, DecisionPhase } from 'shared';
import { initialZones, updateTimelineState } from './scenarioData.js';
import { generatePlaybook } from '../ai/geminiService.js';

export class SimulationEngine {
  private io: SocketServer;
  private currentMinute: number = 0;
  private isPlaying: boolean = true;
  private intervalId: NodeJS.Timeout | null = null;
  
  // Rate-limiting scenario triggers
  private lastTriggerTimes: Record<string, number> = {};
  private readonly TRIGGER_COOLDOWN_MS = 5000; // 5-second cooldown

  private state: StadiumState = {
    timestamp: '19:00',
    elapsedMinutes: 0,
    globalSafetyScore: 100,
    zones: JSON.parse(JSON.stringify(initialZones)),
  };

  private events: PredictionEvent[] = [];
  private notifications: AppNotification[] = [];
  private timeline: TimelineItem[] = [];

  constructor(io: SocketServer) {
    this.io = io;
  }

  private addNotification(title: string, description: string, priority: 'low' | 'medium' | 'high' = 'low', icon: string = 'Bell') {
    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: this.state.timestamp,
      icon,
      priority,
      title,
      description,
      unread: true
    };
    this.notifications.unshift(notif);
    this.io.emit('new_notification', notif);
  }

  private addTimelineItem(title: string, severity: 'info' | 'warning' | 'critical' = 'info', zoneId?: string, icon: string = 'Info') {
    const item: TimelineItem = {
      id: `timeline-${Date.now()}`,
      timestamp: this.state.timestamp,
      icon,
      title,
      severity,
      status: 'active',
      zoneId
    };
    this.timeline.unshift(item);
    this.io.emit('incident_added', item);
  }

  private logEvent(level: 'INFO' | 'WARN' | 'ERROR', moduleName: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({
      timestamp,
      level,
      module: `SimulationEngine:${moduleName}`,
      message,
      ...(meta && { meta })
    }));
  }

  public start() {
    this.isPlaying = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.logEvent('INFO', 'start', 'Simulation engine started');
    this.addNotification('Simulation Init', 'ArenaFlow live operations telemetry linked.', 'low', 'Shield');
    this.addTimelineItem('Simulation Started', 'info', undefined, 'Play');

    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.tick();
      }
    }, 1000);
  }

  public pause() {
    this.isPlaying = false;
    this.logEvent('INFO', 'pause', 'Simulation engine paused');
    this.broadcastState();
  }

  public resume() {
    this.isPlaying = true;
    this.logEvent('INFO', 'resume', 'Simulation engine resumed');
    this.broadcastState();
  }

  public reset() {
    this.currentMinute = 0;
    this.events = [];
    this.notifications = [];
    this.timeline = [];
    this.state = {
      timestamp: '19:00',
      elapsedMinutes: 0,
      globalSafetyScore: 100,
      zones: JSON.parse(JSON.stringify(initialZones)),
    };
    this.logEvent('INFO', 'reset', 'Simulation engine reset to baseline');
    this.addNotification('Simulation Reset', 'Telemetry baseline restored.', 'low', 'RotateCcw');
    this.addTimelineItem('Simulation Started', 'info', undefined, 'Play');
    this.broadcastState();
  }

  public scrub(minute: number) {
    if (minute < 0 || minute > 95) return;
    this.currentMinute = minute;
    
    this.events = this.events.filter(e => {
      const [h, m] = e.triggerTime.split(':').map(Number);
      const triggerMinutes = (h * 60 + m) - (19 * 60);
      return triggerMinutes <= minute;
    });

    const result = updateTimelineState(this.currentMinute, this.state, this.events);
    this.state = result.state;
    this.events = result.events;
    this.logEvent('INFO', 'scrub', `Scrubbed simulation timeline to minute ${minute}`);
    this.broadcastState();
  }

  // Scenario Manager Hook with Rate Limiting
  public async triggerScenario(scenarioId: string) {
    const now = Date.now();
    const lastTrigger = this.lastTriggerTimes[scenarioId] || 0;

    if (now - lastTrigger < this.TRIGGER_COOLDOWN_MS) {
      this.logEvent('WARN', 'triggerScenario', `Scenario trigger rate-limited for: ${scenarioId}`);
      return;
    }
    
    this.lastTriggerTimes[scenarioId] = now;
    this.isPlaying = false; // Pause standard timeline
    
    this.logEvent('INFO', 'triggerScenario', `Scenario triggered: ${scenarioId}`);

    const newState = JSON.parse(JSON.stringify(this.state)) as StadiumState;
    const newEventId = `scenario-${scenarioId}-${Date.now()}`;
    
    let title = '';
    let reasoning = '';
    let severity: 'warning' | 'critical' = 'warning';
    let targetZone = 'gate-c';

    switch (scenarioId) {
      case 'heavy-rain':
        title = 'Heavy Rain / Weather Warning';
        severity = 'warning';
        targetZone = 'parking-lot';
        reasoning = 'Heavy rain is slowing pedestrian flow. Parking lot entry queues backing up.';
        newState.globalSafetyScore = 85;
        newState.zones['parking-lot'].status = 'warning';
        newState.zones['parking-lot'].currentLoad = 2500;
        Object.keys(newState.zones).forEach(k => {
          if (newState.zones[k].type === 'gate') {
            newState.zones[k].waitTime += 5;
          }
        });
        break;

      case 'metro-delay':
        title = 'Metro Delay & Transit Lock';
        severity = 'critical';
        targetZone = 'transit-station';
        reasoning = 'Metro rail delay causing a passenger surge at outer gates.';
        newState.zones['transit-station'].status = 'critical';
        newState.zones['transit-station'].currentLoad = 4800;
        newState.zones['transit-station'].waitTime = 25;
        newState.zones['gate-c'].status = 'critical';
        newState.zones['gate-c'].currentLoad = 1480;
        newState.zones['gate-c'].waitTime = 40;
        break;

      case 'medical-emergency':
        title = 'Medical Dispatch - Section 104';
        severity = 'critical';
        targetZone = 'medical-center';
        reasoning = 'Cardiac emergency call received in Stand East Section 104.';
        newState.zones['medical-center'].status = 'warning';
        newState.zones['medical-center'].currentLoad = 12;
        newState.zones['stand-east'].status = 'warning';
        break;

      case 'gate-scanner-failure':
        title = 'Gate C Scanner Outage';
        severity = 'critical';
        targetZone = 'gate-c';
        reasoning = 'Hardware failure has taken out multiple turnstiles at Gate C.';
        newState.zones['gate-c'].status = 'critical';
        newState.zones['gate-c'].waitTime = 50;
        newState.zones['gate-c'].risk = 'High';
        break;

      case 'vip-arrival':
        title = 'VIP Delegation Arrival';
        severity = 'warning';
        targetZone = 'vip-area';
        reasoning = 'VIP motorcade entering VIP Lounge. Perimeter security established.';
        newState.zones['vip-area'].status = 'warning';
        newState.zones['vip-area'].currentLoad = 420;
        break;

      case 'security-threat':
        title = 'Security Incident - Suspicious Bag';
        severity = 'critical';
        targetZone = 'food-court-b';
        reasoning = 'Unattended parcel reported in Food Court B corridor. Perimeter isolation required.';
        newState.zones['security-office'].status = 'warning';
        newState.zones['food-court-b'].status = 'critical';
        newState.globalSafetyScore = 65;
        break;

      case 'fire-alarm':
        title = 'Evacuation: Smoke Alarm in Food Court B';
        severity = 'critical';
        targetZone = 'food-court-b';
        reasoning = 'Smoke detector triggered in concession zone. Initiating evacuations.';
        newState.globalSafetyScore = 40;
        newState.zones['food-court-b'].status = 'critical';
        newState.zones['stand-east'].status = 'critical';
        break;

      case 'match-end':
        title = 'Match Final Whistle - Exit Surge';
        severity = 'warning';
        targetZone = 'transit-station';
        reasoning = 'Match complete. Spectators departing toward gates and transit lines.';
        newState.globalSafetyScore = 80;
        Object.keys(newState.zones).forEach(k => {
          const z = newState.zones[k];
          if (z.type === 'gate') {
            z.status = 'warning';
            z.currentLoad = 1100;
            z.waitTime = 15;
          }
        });
        newState.zones['transit-station'].status = 'critical';
        newState.zones['transit-station'].currentLoad = 4900;
        break;

      default:
        this.logEvent('ERROR', 'triggerScenario', `Invalid scenario ID: ${scenarioId}`);
        return;
    }

    const newEvent: PredictionEvent = {
      id: newEventId,
      title,
      triggerTime: newState.timestamp,
      timeOffset: 0,
      severity,
      probability: 95,
      reasoning,
      currentPhase: 'detection', // Start decision timeline
      playbook: { steps: [] },
      resolved: false,
    };

    this.events.unshift(newEvent);
    this.state = newState;

    this.addNotification(`Incident: ${title}`, reasoning, severity === 'critical' ? 'high' : 'medium', 'AlertTriangle');
    this.addTimelineItem(title, severity, targetZone, 'Warning');

    this.broadcastState();

    // Trigger AI Playbook Generation
    try {
      this.logEvent('INFO', 'triggerScenario', `Requesting AI Playbook for: ${newEventId}`);
      newEvent.currentPhase = 'prediction'; // Move to prediction phase
      
      const aiPlaybook = await generatePlaybook(newEvent.id, {
        scenarioId,
        timestamp: this.state.timestamp,
        elapsedMinutes: this.state.elapsedMinutes,
        crowd: 8000,
        capacity: 20000,
        waitTime: 15,
        safetyScore: this.state.globalSafetyScore,
        nearby: ['security-office', 'medical-center'],
        events: this.events
      });

      this.logEvent('INFO', 'triggerScenario', `AI Playbook generated successfully for: ${newEventId}`);
      newEvent.currentPhase = 'playbook_generated'; // Move to playbook generated

      newEvent.title = aiPlaybook.title;
      newEvent.severity = aiPlaybook.severity as any;
      newEvent.probability = aiPlaybook.confidence;
      newEvent.reasoning = aiPlaybook.reasoning;
      newEvent.estimatedImpact = aiPlaybook.estimatedImpact;
      newEvent.departments = aiPlaybook.departments;
      newEvent.playbook.steps = aiPlaybook.recommendedActions.map((action, index) => ({
        id: `step-${index}`,
        department: aiPlaybook.departments[index % aiPlaybook.departments.length],
        action,
        target: scenarioId,
        status: 'pending'
      }));

      this.addNotification('AI Playbook Generated', `Orchestrated runbook for ${newEvent.title}.`, 'low', 'Sparkles');
      this.addTimelineItem('AI Prediction Generated', 'info', targetZone, 'Sparkles');

      this.broadcastState();

      // Auto-approve after 60 seconds to guarantee demo progression if left idle
      setTimeout(() => {
        const currentEvent = this.events.find(e => e.id === newEvent.id);
        if (currentEvent && !currentEvent.resolved && currentEvent.currentPhase === 'playbook_generated') {
          this.logEvent('INFO', 'autoApprove', `Auto-approving scenario playbook for: ${currentEvent.id}`);
          currentEvent.playbook.steps.forEach(step => {
            this.executePlaybookStep(currentEvent.id, step.id);
          });
        }
      }, 60000);
    } catch (err: any) {
      this.logEvent('ERROR', 'triggerScenario', `Playbook generation failed: ${err.message}`);
    }
  }

  private async tick() {
    this.currentMinute++;
    if (this.currentMinute > 95) {
      this.reset();
      return;
    }

    const prevSafety = this.state.globalSafetyScore;
    const result = updateTimelineState(this.currentMinute, this.state, this.events);
    this.state = result.state;
    this.events = result.events;

    if (Math.abs(prevSafety - this.state.globalSafetyScore) > 3) {
      this.addNotification('Safety Index Changed', `Global safety factor shifted to ${this.state.globalSafetyScore}%.`, 'medium', 'Shield');
    }

    for (const event of this.events) {
      if (event.playbook.steps.length === 0 && !event.resolved) {
        let zoneId = 'gate-c';
        if (event.id.includes('food-b')) zoneId = 'food-court-b';
        if (event.id.includes('gate-d')) zoneId = 'gate-d';
        
        const zone = this.state.zones[zoneId];
        
        try {
          event.currentPhase = 'prediction';
          this.logEvent('INFO', 'tick', `Requesting AI Playbook for tick anomaly: ${event.id}`);
          
          const aiPlaybook = await generatePlaybook(zoneId, {
            timestamp: this.state.timestamp,
            elapsedMinutes: this.state.elapsedMinutes,
            crowd: zone?.currentLoad || 0,
            capacity: zone?.capacity || 1000,
            waitTime: zone?.waitTime || 0,
            safetyScore: this.state.globalSafetyScore,
            nearby: ['vip-area', 'security-office', 'medical-center'],
            events: this.events
          });
          
          event.currentPhase = 'playbook_generated';
          event.title = aiPlaybook.title;
          event.severity = aiPlaybook.severity as any;
          event.probability = aiPlaybook.confidence;
          event.reasoning = aiPlaybook.reasoning;
          event.estimatedImpact = aiPlaybook.estimatedImpact;
          event.departments = aiPlaybook.departments;
          event.playbook.steps = aiPlaybook.recommendedActions.map((action, index) => ({
            id: `step-${index}`,
            department: aiPlaybook.departments[index % aiPlaybook.departments.length],
            action,
            target: zoneId,
            status: 'pending'
          }));
          
          this.addNotification('AI Anomaly Forecasted', `AI predicted crowd choke risk at ${zone?.name || zoneId}`, 'medium', 'Brain');
          this.addTimelineItem(`AI Prediction: ${zone?.name || zoneId}`, 'warning', zoneId, 'Brain');
          this.broadcastState();

          // Auto-approve after 60 seconds
          setTimeout(() => {
            const currentEvent = this.events.find(e => e.id === event.id);
            if (currentEvent && !currentEvent.resolved && currentEvent.currentPhase === 'playbook_generated') {
              this.logEvent('INFO', 'autoApprove', `Auto-approving tick playbook for: ${currentEvent.id}`);
              currentEvent.playbook.steps.forEach(step => {
                this.executePlaybookStep(currentEvent.id, step.id);
              });
            }
          }, 60000);
        } catch (err: any) {
          this.logEvent('ERROR', 'tick', `Playbook trigger failed for tick: ${err.message}`);
        }
      }
    }

    this.broadcastState();
  }

  public executePlaybookStep(eventId: string, stepId: string) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;
    
    const step = event.playbook.steps.find(s => s.id === stepId);
    if (step) {
      const isFirst = event.playbook.steps.indexOf(step) === 0;
      if (isFirst && step.status === 'pending') {
        event.currentPhase = 'operator_approval'; // Operator approved
        this.addNotification('Playbook Approved', `Mitigation runbook execution started for ${event.title}`, 'low', 'Play');
        this.addTimelineItem('Playbook Approved', 'info', step.target, 'Check');
      }

      step.status = 'completed';
      event.currentPhase = 'execution'; // Execution running
    }

    const allDone = event.playbook.steps.every(s => s.status === 'completed');
    if (allDone) {
      event.resolved = true;
      event.currentPhase = 'resolved'; // Incident resolved
      
      let zoneId = 'gate-c';
      if (eventId.includes('food-b')) zoneId = 'food-court-b';
      if (eventId.includes('gate-d')) zoneId = 'gate-d';
      
      const zone = this.state.zones[zoneId];
      if (zone) {
        zone.status = 'optimal';
        zone.waitTime = Math.max(1, Math.floor(zone.waitTime / 4));
        zone.risk = 'Low';
      }
      
      if (eventId.includes('scenario-security-threat') || eventId.includes('scenario-fire-alarm')) {
        this.state.globalSafetyScore = 98;
        this.state.zones['food-court-b'].status = 'optimal';
        this.state.zones['stand-east'].status = 'optimal';
      }

      this.logEvent('INFO', 'executePlaybookStep', `Playbook completed. Incident resolved: ${eventId}`);
      this.addNotification('Incident Resolved', `Resolution parameters achieved for ${event.title}`, 'medium', 'CheckCircle');
      this.addTimelineItem('Incident Resolved', 'info', zoneId, 'CheckCircle');
    }

    this.broadcastState();
  }

  public async generateExecutiveBriefing(): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const unresolvedCount = this.events.filter(e => !e.resolved).length;
    const avgWait = this.calculateAnalytics().avgGateWait;

    this.logEvent('INFO', 'generateExecutiveBriefing', 'AI Briefing requested by operator console');

    if (!apiKey) {
      return `Overall situation is moderately stable with a Safety Index at ${this.state.globalSafetyScore} percent. Currently, there are ${unresolvedCount} active incidents under monitoring, primarily Gate C which has an elevated queue time of ${avgWait} minutes. AI predicts crowd density risks near Transit East. Recommended actions include activating redirect signs and deploying 4 steward teams to re-route spectators. Expected outcome is crowd dispersion within 10 minutes.`;
    }

    try {
      const prompt = `
        You are the Stadium Operations Director reporting a briefing for Azteca Stadium operations.
        Current Stats:
        - Safety Index: ${this.state.globalSafetyScore}%
        - Active Incidents count: ${unresolvedCount}
        - Average Gate Wait time: ${avgWait} mins
        - Active Events details: ${JSON.stringify(this.events.filter(e => !e.resolved).map(e => e.title))}
        
        Generate a concise, professional executive briefing matching this exact structure:
        - Overall Situation: [1 sentence summarizing status]
        - Active Incidents: [1 sentence summarizing active warnings]
        - Predicted Risks: [1 sentence predicting crowd flow risk]
        - Recommended Actions: [1 sentence outlining coordinated redirects]
        - Expected Outcome: [1 sentence stating final resolution time]
        
        Write it as a cohesive paragraph to be read aloud (length: 80-100 words).
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Briefing unavailable.";
    } catch (err) {
      return `Briefing fallback activated. Overall situation stands at ${this.state.globalSafetyScore}% safety index. Concession stands and Gate C remain under warning states. AI recommendations are executing, expecting resolution in 10 minutes.`;
    }
  }

  private calculateAnalytics(): StadiumAnalytics {
    const zones = this.state.zones;
    
    const gates = Object.values(zones).filter(z => z.type === 'gate');
    const avgGateWait = Math.round(gates.reduce((sum, g) => sum + g.waitTime, 0) / gates.length);

    const parking = zones['parking-lot'];
    const transit = zones['transit-station'];
    const parkingCapacityPercent = Math.round((parking.currentLoad / parking.capacity) * 100);
    const transitLoadPercent = Math.round((transit.currentLoad / transit.capacity) * 100);

    const food = Object.values(zones).filter(z => z.id.includes('food-court'));
    const avgFoodQueue = Math.round(food.reduce((sum, f) => sum + f.waitTime, 0) / food.length);

    const total = this.events.length;
    const critical = this.events.filter(e => e.severity === 'critical' && !e.resolved).length;
    const warning = this.events.filter(e => e.severity === 'warning' && !e.resolved).length;
    const resolved = this.events.filter(e => e.resolved).length;

    const unresolvedEvents = this.events.filter(e => !e.resolved);
    const current = unresolvedEvents.length > 0 ? unresolvedEvents[0].probability : 94;
    const successRate = total > 0 ? Math.round((resolved / total) * 100) : 98;

    const gatesLoad = gates.reduce((sum, g) => sum + g.currentLoad, 0);
    const seatingLoad = Object.values(zones).filter(z => z.type === 'stand').reduce((sum, s) => sum + s.currentLoad, 0);
    const concessionsLoad = food.reduce((sum, f) => sum + f.currentLoad, 0);
    
    const volunteersAvailable = Math.max(0, 12 - unresolvedEvents.reduce((sum, e) => sum + e.playbook.steps.length, 0));

    let executiveSummary = "Overall stadium operations remain within stable parameters. Telemetry lines are green.";
    const activeCritical = unresolvedEvents.find(e => e.severity === 'critical');
    const activeWarning = unresolvedEvents.find(e => e.severity === 'warning');

    if (activeCritical) {
      executiveSummary = `CRITICAL ALERT: ${activeCritical.title}. ${activeCritical.reasoning} AI recommends immediate playbook approval.`;
    } else if (activeWarning) {
      executiveSummary = `WARNING: ${activeWarning.title}. ${activeWarning.reasoning} Operational guidelines deployed.`;
    }

    return {
      avgGateWait,
      parkingCapacityPercent,
      transitLoadPercent,
      avgFoodQueue,
      medicalRequests: this.events.filter(e => e.id.includes('medical') && !e.resolved).length,
      securityCalls: this.events.filter(e => (e.id.includes('security') || e.id.includes('fire')) && !e.resolved).length,
      volunteersAvailable,
      activeIncidents: { total, critical, warning, resolved },
      aiConfidence: { current, average: 92, successRate },
      crowdDistribution: {
        gates: gatesLoad,
        seating: seatingLoad,
        concessions: concessionsLoad,
        parking: parking.currentLoad,
        transit: transit.currentLoad
      },
      executiveSummary
    };
  }

  public broadcastState() {
    this.io.emit('telemetry_tick', {
      state: this.state,
      events: this.events,
      isPlaying: this.isPlaying,
      analytics: this.calculateAnalytics(),
      notifications: this.notifications,
      timeline: this.timeline
    });
  }

  public getState() {
    return {
      state: this.state,
      events: this.events,
      isPlaying: this.isPlaying,
      analytics: this.calculateAnalytics(),
      notifications: this.notifications,
      timeline: this.timeline
    };
  }
}
