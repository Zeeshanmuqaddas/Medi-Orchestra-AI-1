import { useState, useEffect } from 'react';
import { Activity, HeartPulse, BrainCircuit, ActivitySquare, AlertTriangle, Play, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TelemetryViewer from './TelemetryViewer';
import SwarmVisualizer from './SwarmVisualizer';
import AgentReasoningFeed from './AgentReasoningFeed';
import PatientIntelligence from './PatientIntelligence';

export default function Dashboard() {
  const [simulationActive, setSimulationActive] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState<'GREEN' | 'YELLOW' | 'RED'>('GREEN');
  
  const startSimulation = () => {
    setSimulationActive(true);
    setEmergencyLevel('YELLOW');
    setTimeout(() => setEmergencyLevel('RED'), 5000); // Escalate after 5s
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background bg-dot-pattern">
      {/* TopBar */}
      <header className="h-16 border-b border-cyan-neon/30 cyber-panel flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-cyan-neon" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-cyan-neon uppercase">Medi-Orchestra AI</h1>
            <div className="text-[10px] uppercase font-mono tracking-widest opacity-70">Autonomous Hospital OS • v9.4.2</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-cyan-neon">SYS.STAT:</span>
            <span className="text-green-neon">NOMINAL</span>
          </div>
          <Button 
            variant="outline" 
            className={`border-cyan-neon text-cyan-neon hover:bg-cyan-neon/20 ${simulationActive ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={startSimulation}
          >
            <Play className="w-4 h-4 mr-2" />
            SIMULATE EMERGENCY
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Minor info */}
        <aside className="w-64 border-r border-cyan-neon/30 cyber-panel p-4 flex flex-col gap-6 overflow-y-auto z-10">
          <div>
            <div className="text-xs text-cyan-neon font-mono uppercase mb-4 tracking-widest">Active Ward</div>
            <div className="flex items-center gap-3 mb-2 p-2 rounded bg-cyan-neon/10 border border-cyan-neon/20">
              <ActivitySquare className="w-5 h-5 text-cyan-neon" />
              <div>
                <div className="text-sm font-bold">ICU - BED 04</div>
                <div className="text-[10px] font-mono opacity-70">PATIENT: JD-88902</div>
              </div>
            </div>
            <div className="text-xs font-mono opacity-80 space-y-1 p-2">
              <div className="flex justify-between"><span>AGE:</span> <span className="text-cyan-neon">64</span></div>
              <div className="flex justify-between"><span>SEX:</span> <span className="text-cyan-neon">M</span></div>
              <div className="flex justify-between"><span>WT:</span> <span className="text-cyan-neon">82 KG</span></div>
            </div>
          </div>
          
          <div className="mt-auto">
             <div className="text-xs text-cyan-neon font-mono uppercase mb-4 tracking-widest">System Load</div>
             <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span>AGENTS_ACTIVE</span>
                    <span className="text-cyan-neon">12/12</span>
                  </div>
                  <Progress value={100} className="h-1 bg-cyan-neon/20"  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span>A2A_LATENCY</span>
                    <span className="text-green-neon">12ms</span>
                  </div>
                  <Progress value={12} className="h-1 bg-cyan-neon/20" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span>FHIR_SYNC</span>
                    <span className="text-green-neon">OK</span>
                  </div>
                  <Progress value={100} className="h-1 bg-cyan-neon/20" />
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden z-10">
          
          <div className="flex gap-4 h-[40%]">
            {/* Vitals Telemetry */}
            <div className={`flex-1 rounded-xl p-4 flex flex-col ${emergencyLevel === 'RED' ? 'cyber-panel-red' : 'cyber-panel'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-neon flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> Live Telemetry
                </h2>
                {emergencyLevel !== 'GREEN' && (
                  <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> {emergencyLevel} ALERT
                  </Badge>
                )}
              </div>
              <div className="flex-1">
                <TelemetryViewer simulationActive={simulationActive} emergencyLevel={emergencyLevel} />
              </div>
            </div>

            {/* Agent Swarm Visualizer */}
            <div className="flex-1 cyber-panel rounded-xl p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-neon flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Orchestration Network
                </h2>
              </div>
              <div className="flex-1 bg-black/40 rounded border border-cyan-neon/20 relative overflow-hidden">
                <SwarmVisualizer simulationActive={simulationActive} emergencyLevel={emergencyLevel} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 h-[60%]">
             {/* Clinical Intelligence / AI Reasoning Feed & Patient Context */}
             <div className="flex-[2] cyber-panel rounded-xl flex flex-col overflow-hidden">
               <Tabs defaultValue="patient" className="flex-1 flex flex-col w-full data-[state=active]:outline-none">
                 <div className="px-4 pt-4 pb-2 border-b border-cyan-neon/20 flex items-center justify-between shrink-0">
                   <div className="flex items-center gap-2">
                     <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-neon hidden sm:block">AI Intelligence Node</h2>
                   </div>
                   <TabsList className="bg-black/60 border border-cyan-neon/30 h-auto p-1">
                     <TabsTrigger value="patient" className="text-[10px] sm:text-xs font-mono uppercase tracking-wider data-[state=active]:bg-cyan-neon/20 data-[state=active]:text-cyan-neon py-1.5 px-3">Patient Context</TabsTrigger>
                     <TabsTrigger value="reasoning" className="text-[10px] sm:text-xs font-mono uppercase tracking-wider data-[state=active]:bg-cyan-neon/20 data-[state=active]:text-cyan-neon py-1.5 px-3">Agent Swarm Log</TabsTrigger>
                   </TabsList>
                 </div>
                 
                 <div className="flex-1 relative min-h-0">
                   <TabsContent value="patient" className="h-full m-0 data-[state=active]:flex flex-col outline-none p-4 w-full">
                     <PatientIntelligence emergencyLevel={emergencyLevel} />
                   </TabsContent>
                   <TabsContent value="reasoning" className="h-full m-0 data-[state=active]:flex flex-col outline-none p-4 w-full">
                     <AgentReasoningFeed simulationActive={simulationActive} emergencyLevel={emergencyLevel} />
                   </TabsContent>
                 </div>
               </Tabs>
             </div>

             {/* Digital Twin / Longitudinal Data */}
             <div className="flex-[1] cyber-panel rounded-xl p-4 flex flex-col">
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-neon mb-4">Risk Prediction</h2>
              
              <div className="flex-1 space-y-4">
                <div className="p-3 bg-black/40 border border-cyan-neon/20 rounded">
                  <div className="text-[10px] font-mono text-cyan-neon mb-1">MORTALITY RISK (48H)</div>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${emergencyLevel === 'RED' ? 'text-red-neon' : 'text-cyan-neon'}`}>
                      {emergencyLevel === 'RED' ? '42%' : emergencyLevel === 'YELLOW' ? '18%' : '4%'}
                    </span>
                    <span className="text-xs mb-1 font-mono opacity-70">↑ OVER baseline</span>
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-cyan-neon/20 rounded">
                  <div className="text-[10px] font-mono text-cyan-neon mb-2">LONGITUDINAL MEMORY</div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-cyan-neon/20 pb-1">
                      <span className="opacity-70">PREV ADMISSIONS</span>
                      <span className="text-cyan-neon">3</span>
                    </div>
                    <div className="flex justify-between border-b border-cyan-neon/20 pb-1">
                      <span className="opacity-70">KIDNEY TREND (3Y)</span>
                      <span className="text-red-neon shadow-red-neon drop-shadow-md">-14% eGFR</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="opacity-70">SEPSIS HX</span>
                      <span className="text-cyan-neon">NEGATIVE</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-cyan-neon/20 rounded">
                   <div className="text-xs mb-2 text-yellow-neon flex items-center gap-1">
                     <AlertTriangle className="w-3 h-3" /> AI DISCLAIMER
                   </div>
                   <div className="text-[10px] font-mono opacity-70 leading-relaxed">
                     Autonomous orchestration recommendations require attending physician override or approval. System operates at Level 4 Autonomy under human supervision.
                   </div>
                </div>
              </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}
