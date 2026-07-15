import React, { useState, useEffect, useRef } from 'react';
import { useTelemetry } from '../context/SocketContext';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AICopilot() {
  const { events, executeStep, briefingText, briefingLoading, requestBriefing, clearBriefing } = useTelemetry();

  const [executingEventId, setExecutingEventId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    if (briefingText) {
      let index = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(prev => prev + briefingText.charAt(index));
        index++;
        if (index >= briefingText.length) clearInterval(interval);
      }, 12);
      return () => clearInterval(interval);
    } else {
      setTypedText('');
    }
  }, [briefingText]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [events]);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(briefingText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeEvent = events.find(e => !e.resolved) || null;

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
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800));
      executeStep(activeEvent.id, steps[i].id);
    }
    setCurrentStepIndex(steps.length);
    setIsComplete(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] p-10 overflow-hidden grid grid-cols-12 gap-8">
      {/* Left: AI Chat Interface */}
      <section className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col h-full glass-card rounded-3xl border border-white/40 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-pearl/20 flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">ArenaFlow Copilot</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Intelligent Operations Assistant</p>
          </div>
          <div className="flex items-center gap-2">
            {speechSupported && briefingText && (
              <button onClick={handleSpeak} className="p-2 rounded-lg hover:bg-white/20">
                {isSpeaking ? <VolumeX className="h-4 w-4 text-critical-red" /> : <Volume2 className="h-4 w-4 text-on-surface-variant" />}
              </button>
            )}
            {briefingText && (
              <button onClick={clearBriefing} className="font-label-caps text-[10px] text-on-surface-variant hover:text-on-surface">Clear</button>
            )}
            <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
          {/* Static briefing / events feed */}
          {briefingText ? (
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl rounded-tl-none shadow-sm font-body-md text-sm">
                {typedText}
                <span className="inline-block w-1.5 h-3.5 bg-primary/60 ml-0.5 animate-pulse" />
              </div>
              <span className="font-label-caps text-[10px] text-on-surface-variant opacity-60 px-1">CO-PILOT • EXECUTIVE BRIEF</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl rounded-tl-none shadow-sm font-body-md text-sm">
                  Good afternoon, Director. I've detected a significant congestion surge at Gate 4 following the match conclusion. Predictive modeling suggests a 15-minute delay threshold breach within the next 4 minutes.
                </div>
                <span className="font-label-caps text-[10px] text-on-surface-variant opacity-60 px-1">CO-PILOT • 14:02:45</span>
              </div>
              <div className="flex flex-col gap-2 max-w-[85%] ml-auto items-end">
                <div className="bg-white text-on-surface p-4 rounded-2xl rounded-tr-none border border-pearl shadow-sm font-body-md text-sm">
                  Understood. Run analysis for crowd dispersal optimization.
                </div>
                <span className="font-label-caps text-[10px] text-on-surface-variant opacity-60 px-1">DIRECTOR • 14:03:12</span>
              </div>
              {activeEvent && (
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl rounded-tl-none shadow-sm font-body-md text-sm">
                    "{activeEvent.reasoning}"
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant opacity-60 px-1">CO-PILOT • NOW</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/40 border-t border-pearl/20">
          <div className="relative flex items-center">
            <input
              className="w-full bg-white/80 border border-pearl/30 rounded-full px-6 py-4 pr-16 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-body-md text-sm"
              placeholder="Inquire about stadium logistics..."
              type="text"
              readOnly
            />
            <button className="absolute right-2 p-2 bg-primary text-white rounded-full hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </section>

      {/* Right: Action Playbooks & Reasoning */}
      <section className="col-span-12 lg:col-span-7 xl:col-span-8 overflow-y-auto scrollbar-thin space-y-8 pr-1">
        {/* Generate Briefing button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Action Playbooks</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">AI-generated response strategies for active alerts</p>
          </div>
          <button
            onClick={requestBriefing}
            disabled={briefingLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-60"
          >
            {briefingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="material-symbols-outlined text-sm">mic</span>}
            <span className="font-body-md text-sm">{briefingLoading ? 'Synthesizing...' : 'Generate Executive Briefing'}</span>
          </button>
        </div>

        {/* Playbook Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeEvent ? (
            activeEvent.playbook.steps.slice(0, 3).map((step, idx) => {
              const isExecuted = step.status === 'completed';
              const isExecuting = executingEventId === activeEvent.id && idx === currentStepIndex;
              return (
                <div
                  key={step.id}
                  className={`glass-card p-6 rounded-3xl border-l-4 hover:-translate-y-1 transition-all cursor-pointer shadow-lg ${
                    isExecuted ? 'border-l-primary' : isExecuting ? 'border-l-warning-amber' : 'border-l-primary'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-2 rounded-xl ${isExecuted ? 'bg-primary/10' : 'bg-primary/10'}`}>
                      <span className="material-symbols-outlined text-primary">
                        {idx === 0 ? 'emergency_share' : idx === 1 ? 'traffic' : 'groups_3'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-stats-numeric text-stats-numeric text-primary">{activeEvent.probability}%</span>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">Success Pred.</p>
                    </div>
                  </div>
                  <h3 className={`font-title-md text-title-md mb-2 transition-colors ${isExecuted ? 'text-primary' : 'text-on-surface'}`}>
                    {step.action}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-4">{step.department} department response step.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/50 rounded-md text-[10px] font-label-caps border border-pearl/20">
                      {isExecuted ? 'Completed' : isExecuting ? 'In Progress' : 'Pending'}
                    </span>
                    <span className="px-2 py-1 bg-white/50 rounded-md text-[10px] font-label-caps border border-pearl/20">
                      {step.department}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {[
                { icon: 'emergency_share', title: 'Evacuation Plan 7B', desc: 'Activation of auxiliary exit corridors 3 and 9. Dynamic signage routing through the North Plaza.', pct: '98', tags: ['High Priority', 'Low Latency'], color: 'border-l-primary' },
                { icon: 'traffic', title: 'Traffic Rerouting', desc: 'Signal timing adjustment for Perimeter Road A. 120s green light cycle to flush underground parking.', pct: '84', tags: ['External Ops', 'Mod-Impact'], color: 'border-l-warning-amber' },
                { icon: 'groups_3', title: 'Staff Reallocation', desc: 'Moving 15 security personnel from Zone A-3 (Low Activity) to Gate 4 Bottleneck point.', pct: '92', tags: ['Immediate', 'Human-Centric'], color: 'border-l-primary' },
              ].map((card, i) => (
                <div key={i} className={`glass-card p-6 rounded-3xl border-l-4 ${card.color} hover:-translate-y-1 transition-all cursor-pointer shadow-lg group`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <span className="material-symbols-outlined text-primary">{card.icon}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-stats-numeric text-stats-numeric text-primary">{card.pct}%</span>
                      <p className="font-label-caps text-[10px] text-on-surface-variant">Success Pred.</p>
                    </div>
                  </div>
                  <h3 className="font-title-md text-title-md mb-2 text-on-surface group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-on-surface-variant text-sm mb-4">{card.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/50 rounded-md text-[10px] font-label-caps border border-pearl/20">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Reasoning Architecture Timeline */}
        <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Reasoning Architecture</h2>
          </div>
          <div className="relative pl-8 border-l-2 border-pearl">
            {[
              { title: 'Sensor Data Ingestion', desc: 'LiDAR and computer vision detected crowd density of 4.2 people/m² at Gate 4. Ingress-Egress parity loss identified.', time: 'T-Minus 120s', src: 'IoT Hub-B' },
              { title: 'Simulation Run #412', desc: `Digital Twin executed 1,000 dispersal simulations. ${activeEvent ? activeEvent.title : 'Plan 7B'} achieved the lowest 'Time-to-Clear' with zero secondary bottlenecks.`, time: 'T-Minus 45s', src: `Confidence: ${activeEvent ? activeEvent.probability + '%' : '98.2%'}` },
              { title: 'Final Tactical Projection', desc: 'Verifying resource availability. Personnel at Zone A-3 confirmed idle. Dynamic signage server pre-staged for routing update.', time: 'Present Time', src: 'Status: Ready for Execution', active: true },
            ].map((step, i) => (
              <div key={i} className={`mb-10 relative ${i === 2 ? '' : ''}`}>
                <div className={`absolute -left-[41px] top-0 w-4 h-4 rounded-full border-4 border-titanium-white ring-4 ring-primary/20 ${step.active ? 'bg-primary pulse-emerald' : 'bg-primary'}`} />
                <h4 className="font-title-md text-title-md text-primary mb-2">{step.title}</h4>
                <p className="text-on-surface-variant mb-3 text-sm">{step.desc}</p>
                <div className="flex items-center gap-4 text-[10px] font-label-caps text-on-surface-variant opacity-60">
                  <span>{step.time}</span>
                  <span>{step.src}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-4">
            {activeEvent && !isComplete ? (
              <button
                onClick={handleAuthorize}
                disabled={executingEventId !== null}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-headline-lg-mobile text-headline-lg-mobile flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-60"
              >
                <span className="material-symbols-outlined">play_circle</span>
                {executingEventId ? 'Executing...' : 'Execute Recommended Playbook'}
              </button>
            ) : (
              <button className="flex-1 bg-primary text-white py-4 rounded-xl font-headline-lg-mobile text-headline-lg-mobile flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-95">
                <span className="material-symbols-outlined">play_circle</span>
                Execute Recommended Playbook
              </button>
            )}
            <button className="px-8 py-4 bg-white border border-pearl text-on-surface-variant rounded-xl font-title-md hover:bg-pearl transition-all">
              Modify Strategy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
