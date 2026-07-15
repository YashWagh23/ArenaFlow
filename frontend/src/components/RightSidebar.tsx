import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Sliders, Check, Loader2, ChevronRight, Cloud, Landmark, Activity, Cpu, Crown, AlertOctagon, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../context/SocketContext';
import { motion } from 'framer-motion';

const scenariosList = [
  { id: 'heavy-rain', title: 'Heavy Rain', desc: 'Slowing crowd movement & parking overload.', severity: 'warning', icon: Cloud },
  { id: 'metro-delay', title: 'Metro Delay', desc: 'Spikes Transit crowd, overloading Gate C.', severity: 'critical', icon: Landmark },
  { id: 'medical-emergency', title: 'Medical Alert', desc: 'Medical Bay response inside Section 104.', severity: 'critical', icon: Activity },
  { id: 'gate-scanner-failure', title: 'Gate Outage', desc: 'Closes Gate C scanners, causing backup.', severity: 'critical', icon: Cpu },
  { id: 'vip-arrival', title: 'VIP Arrival', desc: 'Motorcade path security reallocation.', severity: 'warning', icon: Crown },
  { id: 'security-threat', title: 'Security Threat', desc: 'Concourse corridor lock, reroutes fans.', severity: 'critical', icon: AlertOctagon },
  { id: 'fire-alarm', title: 'Fire Alarm', desc: 'Evacuations & emergency exit routes active.', severity: 'critical', icon: ShieldAlert },
  { id: 'match-end', title: 'Match End', desc: 'Mass whistle exit surge, transit overloaded.', severity: 'warning', icon: AlertTriangle },
];

export default function RightSidebar() {
  const { events, executeStep, triggerScenario } = useTelemetry();
  
  // Track execution states
  const [executingEventId, setExecutingEventId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState(false);

  // Find the first unresolved event to focus the playbook on
  const activeEvent = events.find(e => !e.resolved) || null;

  // Reset execution status if the active event changes
  useEffect(() => {
    if (activeEvent?.id !== executingEventId) {
      setExecutingEventId(null);
      setCurrentStepIndex(-1);
      setIsComplete(false);
    }
  }, [activeEvent, executingEventId]);

  const handleAuthorize = async () => {
    if (!activeEvent) return;
    
    setExecutingEventId(activeEvent.id);
    setCurrentStepIndex(0);
    setIsComplete(false);

    const steps = activeEvent.playbook.steps;
    
    // Simulate step execution queue animation
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800));
      executeStep(activeEvent.id, steps[i].id);
    }
    
    setCurrentStepIndex(steps.length);
    setIsComplete(true);
  };

  return (
    <div className="w-[400px] p-6 flex flex-col h-[calc(100vh-5rem)] border-l border-slate-200 bg-white overflow-y-auto space-y-6 scrollbar-none">
      
      {/* Playbook Orchestrator (Top Card) */}
      <div className="rounded-2xl border border-slate-200 bg-[#FAFAFA] p-6 relative overflow-hidden shadow-sm">
        
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[8px] font-bold tracking-widest text-slate-400 uppercase font-mono">COORDINATED RUNBOOK</span>
            <h3 className="text-xs font-bold text-slate-900">
              {activeEvent ? 'AI Mitigation Playbook' : 'System Ready State'}
            </h3>
          </div>
        </div>

        {activeEvent ? (
          <>
            {/* AI Insight details - ChatGPT Bubble style */}
            <div className="mb-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  AI Prediction Anomaly
                </span>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  {activeEvent.probability}% CONFIDENCE
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {activeEvent.title}
              </p>
              {activeEvent.estimatedImpact && (
                <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-100 pt-2.5 mt-2.5">
                  <span className="font-bold text-slate-800">Projected Impact:</span> {activeEvent.estimatedImpact}
                </div>
              )}
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2.5 mb-6">
              {activeEvent.playbook.steps.map((step, idx) => {
                const isExecuted = step.status === 'completed';
                const isExecuting = executingEventId === activeEvent.id && idx === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3.5 bg-white p-3.5 rounded-xl border transition-all duration-350 shadow-sm ${
                      isExecuted 
                        ? 'border-emerald-250 bg-emerald-50/10' 
                        : isExecuting 
                        ? 'border-slate-350 bg-slate-50/20' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isExecuted 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                        : isExecuting 
                        ? 'border-slate-800 text-slate-800 animate-spin' 
                        : 'border-slate-300 text-slate-400'
                    }`}>
                      {isExecuted ? (
                        <Check className="h-3 w-3" />
                      ) : isExecuting ? (
                        <Loader2 className="h-2.5 w-2.5" />
                      ) : (
                        <span className="text-[8px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold font-mono tracking-widest text-slate-400 uppercase">
                        {step.department} Dispatch
                      </span>
                      <p className={`text-[11px] font-medium leading-relaxed transition-all ${isExecuted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {step.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Execution status display */}
            {executingEventId === activeEvent.id && (
              <div className="text-center py-2.5 mb-4 text-[9px] font-bold font-mono tracking-wider rounded-xl bg-slate-50 border border-slate-200">
                {isComplete ? (
                  <span className="text-emerald-600">✓ DEPLOYMENT COMPLETE</span>
                ) : (
                  <span className="text-slate-700 flex items-center justify-center">
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin text-slate-600" />
                    EXECUTING PLAYBOOK...
                  </span>
                )}
              </div>
            )}

            {/* Action Button */}
            {!isComplete && (
              <button
                onClick={handleAuthorize}
                disabled={executingEventId !== null}
                className="w-full flex items-center justify-center py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all"
              >
                <span>Approve & Deploy Playbook</span>
              </button>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <Check className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="text-xs text-slate-600 font-bold">No active anomalies detected.</p>
            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider mt-1">Telemetry link: GREEN</p>
          </div>
        )}
      </div>

      {/* Explainable AI Card - Conversational Bubble style */}
      {activeEvent && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="h-4 w-4 text-slate-700" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Neural Explanation</h4>
          </div>
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl relative mb-4">
            <p className="text-[11px] text-slate-600 leading-normal font-medium">
              "{activeEvent.reasoning}"
            </p>
          </div>

          <div className="space-y-3.5 pt-4 border-t border-slate-100 font-mono">
            <div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                <span>INFLOW SURGE RATIO</span>
                <span>88%</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 w-[88%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                <span>LATENCY COEFFICIENT</span>
                <span>72%</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-950/40 w-[72%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Control Center - Animate on hover */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
        <div className="flex items-center space-x-2.5 mb-5">
          <Sliders className="h-4 w-4 text-slate-800" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Scenario Command Center</h4>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
          {scenariosList.map((scen) => {
            const IconComponent = scen.icon;
            return (
              <motion.div
                key={scen.id}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group relative overflow-hidden flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-350 transition duration-200"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{scen.title}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        scen.severity === 'critical' ? 'bg-rose-500 shadow-sm' : 'bg-amber-500 shadow-sm'
                      }`} />
                    </div>
                    <span className="block text-[9px] text-slate-400 font-medium leading-normal pr-2">
                      {scen.desc}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerScenario(scen.id)}
                  className="px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 rounded-lg transition"
                >
                  Trigger
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
