import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogEntry {
  id: number;
  agent: string;
  action: string;
  reasoning: string;
  confidence: number;
  time: string;
  type: 'info' | 'warn' | 'critical';
}

const GREEN_LOGS = [
  { agent: 'ICU Monitor', action: 'Vitals logged', reasoning: 'All parameters within normal limits.', type: 'info' as const, confidence: 99 },
  { agent: 'Labs/FHIR', action: 'CBC Analyzed', reasoning: 'WBC count stable. No signs of infection.', type: 'info' as const, confidence: 95 },
  { agent: 'Supervisor', action: 'State updated', reasoning: 'Patient maintaining homeostasis.', type: 'info' as const, confidence: 98 },
];

const YELLOW_LOGS = [
  { agent: 'ICU Monitor', action: 'Tachycardia detected', reasoning: 'Heart rate elevated above 95 BPM baseline for 5 mins.', type: 'warn' as const, confidence: 92 },
  { agent: 'ER Triage', action: 'Risk Escalation', reasoning: 'Vitals showing early signs of decomposition.', type: 'warn' as const, confidence: 85 },
  { agent: 'Supervisor', action: 'A2A Query: Labs', reasoning: 'Requesting recent Lactate and Procalcitonin.', type: 'info' as const, confidence: 99 },
  { agent: 'Labs/FHIR', action: 'FHIR Search', reasoning: 'Resource: Observation. Found Lactate: 2.1 mmol/L (Elevated).', type: 'warn' as const, confidence: 99 },
];

const RED_LOGS = [
  { agent: 'ICU Monitor', action: 'CRITICAL HOT-ALERT', reasoning: 'MAP < 65mmHg, SpO2 88%. Hemodynamic instability.', type: 'critical' as const, confidence: 99 },
  { agent: 'Diagnosis', action: 'Differential Update', reasoning: 'Sepsis probability increased 42% -> 78% due to elevated lactate and persistent hypotension.', type: 'critical' as const, confidence: 88 },
  { agent: 'Pharmacy', action: 'Med Recommendation', reasoning: 'Recommend Norepinephrine 0.05 mcg/kg/min & Broad-spectrum antibiotics.', type: 'warn' as const, confidence: 91 },
  { agent: 'Supervisor', action: 'EMERGENCY OVERRIDE', reasoning: 'Activating Rapid Response Team. Initiating Sepsis Protocol.', type: 'critical' as const, confidence: 99 },
];


export default function AgentReasoningFeed({ simulationActive, emergencyLevel }: { simulationActive: boolean, emergencyLevel: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!simulationActive) return;

    let possibleLogs: Omit<LogEntry, 'id' | 'time'>[] = GREEN_LOGS;
    if (emergencyLevel === 'YELLOW') possibleLogs = YELLOW_LOGS;
    if (emergencyLevel === 'RED') possibleLogs = RED_LOGS;

    const interval = setInterval(() => {
      const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
      
      const newEntry: LogEntry = {
        ...randomLog,
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" })
      };

      setLogs(prev => [...prev.slice(-49), newEntry]);
    }, emergencyLevel === 'RED' ? 1500 : 3000);

    return () => clearInterval(interval);
  }, [simulationActive, emergencyLevel]);

  // Auto-scroll Down
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex-1 bg-black/60 border border-cyan-neon/30 rounded overflow-hidden relative">
      <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
      
      <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-3 font-mono text-[10px] sm:text-xs">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-2 border-l-2 ${
                log.type === 'critical' ? 'border-red-neon bg-red-neon/10 text-red-100' :
                log.type === 'warn' ? 'border-yellow-neon bg-yellow-neon/10 text-yellow-100' :
                'border-cyan-neon bg-cyan-neon/5 text-cyan-50'
              }`}
            >
              <div className="flex justify-between font-bold mb-1 opacity-80">
                <span className="flex gap-2">
                  <span>[{log.time}]</span>
                  <span className={
                    log.type === 'critical' ? 'text-red-neon' :
                    log.type === 'warn' ? 'text-yellow-neon' :
                    'text-cyan-neon'
                  }>
                    {log.agent}
                  </span>
                </span>
                <span>CONF: {log.confidence}%</span>
              </div>
              <div className="flex gap-2">
                <span className="opacity-50">►</span>
                <span className="font-bold opacity-90">{log.action}:</span>
                <span className="opacity-80">{log.reasoning}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="text-center opacity-50 mt-10">AWAITING SYSTEM INITIALIZATION...</div>
        )}
      </div>

      <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  )
}
