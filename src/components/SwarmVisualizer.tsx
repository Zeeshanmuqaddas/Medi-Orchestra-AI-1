import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivitySquare, BrainCircuit, Activity, Stethoscope, Dna, FileImageIcon, Pill, Database } from 'lucide-react';

const AGENTS = [
  { id: 'supervisor', label: 'Supervisor AI', icon: BrainCircuit, x: 50, y: 50, color: 'var(--color-cyan-neon)' },
  { id: 'triage', label: 'ER Triage', icon: ActivitySquare, x: 20, y: 20, color: 'var(--color-green-neon)' },
  { id: 'icu', label: 'ICU Monitor', icon: Activity, x: 80, y: 20, color: 'var(--color-yellow-neon)' },
  { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope, x: 15, y: 80, color: 'var(--color-cyan-neon)' },
  { id: 'lab', label: 'Labs/FHIR', icon: Dna, x: 35, y: 85, color: '#ff00ff' },
  { id: 'radiology', label: 'Vision/Rad', icon: FileImageIcon, x: 65, y: 85, color: '#0055ff' },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill, x: 85, y: 80, color: 'var(--color-green-neon)' },
  { id: 'memory', label: 'Memory DB', icon: Database, x: 50, y: 15, color: '#aaa' }
];

export default function SwarmVisualizer({ simulationActive, emergencyLevel }: { simulationActive: boolean, emergencyLevel: string }) {
  const [activeLinks, setActiveLinks] = useState<{source: string, target: string, id: number}[]>([]);
  const [pulseNodes, setPulseNodes] = useState<string[]>([]);
  const [linkCounter, setLinkCounter] = useState(0);

  useEffect(() => {
    if (!simulationActive) return;

    let intervalId: any;
    
    const triggerCommunications = () => {
      // Create random communication links based on priority
      let pairs = [];
      if (emergencyLevel === 'GREEN') {
        pairs = [['icu', 'supervisor'], ['lab', 'diagnosis']];
      } else if (emergencyLevel === 'YELLOW') {
        pairs = [['icu', 'triage'], ['triage', 'supervisor'], ['supervisor', 'lab']];
      } else {
        pairs = [['icu', 'supervisor'], ['supervisor', 'diagnosis'], ['lab', 'supervisor'], ['supervisor', 'pharmacy'], ['radiology', 'diagnosis']];
      }

      const activePair = pairs[Math.floor(Math.random() * pairs.length)];
      
      const newId = Date.now();
      setActiveLinks(prev => [...prev, { source: activePair[0], target: activePair[1], id: newId }]);
      setPulseNodes([activePair[0], activePair[1]]);

      setTimeout(() => {
        setActiveLinks(prev => prev.filter(l => l.id !== newId));
        setPulseNodes([]);
      }, 800);
    };

    intervalId = setInterval(triggerCommunications, emergencyLevel === 'RED' ? 400 : 1200);

    return () => clearInterval(intervalId);
  }, [simulationActive, emergencyLevel]);

  return (
    <div className="w-full h-full relative">
       {/* Connections */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
         {AGENTS.map(source => 
           AGENTS.map(target => {
             if (source.id === target.id) return null;
             // Draw base lines linking supervisor to everyone
             if (source.id !== 'supervisor' && target.id !== 'supervisor') return null;
             return (
               <line 
                 key={`${source.id}-${target.id}`}
                 x1={`${source.x}%`} y1={`${source.y}%`}
                 x2={`${target.x}%`} y2={`${target.y}%`}
                 stroke="rgba(0, 240, 255, 0.1)"
                 strokeWidth="1"
               />
             )
           })
         )}
         
         <AnimatePresence>
            {activeLinks.map(link => {
              const source = AGENTS.find(a => a.id === link.source);
              const target = AGENTS.find(a => a.id === link.target);
              if (!source || !target) return null;

              return (
                <motion.line
                  key={link.id}
                  x1={`${source.x}%`} y1={`${source.y}%`}
                  x2={`${target.x}%`} y2={`${target.y}%`}
                  stroke={source.color}
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: [1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
         </AnimatePresence>
       </svg>

       {/* Agents */}
       {AGENTS.map(agent => (
         <div 
           key={agent.id}
           className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
           style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
         >
           <motion.div
              animate={{ 
                boxShadow: pulseNodes.includes(agent.id) 
                  ? `0 0 20px 5px ${agent.color}80` 
                  : agent.id === 'supervisor' ? `0 0 10px ${agent.color}40` : 'none',
                scale: pulseNodes.includes(agent.id) ? 1.2 : 1
              }}
              className="p-3 rounded-full bg-black/80 border z-10"
              style={{ borderColor: agent.color }}
           >
             <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
           </motion.div>
           <div className="mt-2 text-[10px] font-mono tracking-wider font-bold whitespace-nowrap bg-black/50 px-1 rounded" style={{ color: agent.color }}>
             {agent.label}
           </div>
         </div>
       ))}
    </div>
  )
}
