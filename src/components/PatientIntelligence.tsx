import { Activity, Clock, FileText, HeartPulse, History, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function PatientIntelligence({ emergencyLevel }: { emergencyLevel: string }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-black/40 border border-cyan-neon/20 p-3 rounded">
          <div className="text-[10px] font-mono text-cyan-neon mb-2 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-3 h-3" /> Demographics & Status
          </div>
          <div className="text-sm font-bold mb-1">JOHN DOE (JD-88902)</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono opacity-80 mt-2">
            <div className="flex justify-between"><span>DOB:</span> <span className="text-cyan-neon">1960-05-12</span></div>
            <div className="flex justify-between"><span>BLOOD:</span> <span className="text-red-400">O-Negative</span></div>
            <div className="flex justify-between"><span>CODE:</span> <span className="text-green-neon">FULL CODE</span></div>
            <div className="flex justify-between"><span>ALLERGIES:</span> <span className="text-yellow-neon">Penicillin</span></div>
          </div>
        </div>

        <div className="flex-1 bg-black/40 border border-cyan-neon/20 p-3 rounded">
          <div className="text-[10px] font-mono text-cyan-neon mb-2 uppercase tracking-widest flex items-center gap-2">
            <HeartPulse className="w-3 h-3" /> Current Admission
          </div>
          <div className="text-xs font-mono space-y-2">
            <div>
              <span className="opacity-60">PRIMARY DX:</span>
              <div className="text-cyan-neon font-bold">Community Acquired Pneumonia</div>
            </div>
            <div>
              <span className="opacity-60">COMORBIDITIES:</span>
              <div className="text-yellow-neon">Type II Diabetes, Hypertension</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-black/20 border border-cyan-neon/10 rounded">
        <div className="p-2 border-b border-cyan-neon/20 bg-black/40 flex items-center justify-between">
          <div className="text-[10px] font-mono text-cyan-neon uppercase tracking-widest flex items-center gap-2">
            <History className="w-3 h-3" /> Longitudinal Memory Agent (FHIR Analysis)
          </div>
          <Badge variant="outline" className="text-[10px] border-cyan-neon text-cyan-neon bg-cyan-neon/10 rounded-sm">AI SYNTHESIZED</Badge>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4 font-mono text-xs">
            
            <div className="border-l-2 border-cyan-neon/50 pl-3 relative">
              <div className="absolute w-2 h-2 bg-cyan-neon rounded-full -left-[5px] top-1"></div>
              <div className="opacity-50 text-[10px] mb-1">CURRENT ADMISSION (Day 2)</div>
              <div className="text-cyan-50">Patient admitted with acute respiratory distress. Receiving O2 therapy and standard empirical antibiotics.</div>
              {emergencyLevel !== 'GREEN' && (
                <div className="mt-2 text-yellow-neon bg-yellow-neon/10 p-2 text-[10px] rounded border border-yellow-neon/20">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Warning: Early signs of systemic inflammatory response extending beyond pulmonary involvement. 
                  {emergencyLevel === 'RED' ? ' SEVERE DETERIORATION CONFIRMED.' : ' HIGH RISK OF DETERIORATION.'}
                </div>
              )}
            </div>

            <div className="border-l-2 border-cyan-neon/30 pl-3 relative">
              <div className="absolute w-2 h-2 bg-cyan-neon/50 rounded-full -left-[5px] top-1"></div>
              <div className="opacity-50 text-[10px] mb-1">3 MONTHS AGO (Admission)</div>
              <div className="text-cyan-50/80">Admitted for DKA (Diabetic Ketoacidosis). Resolved after 4 days. HbA1c at 9.2%.</div>
              <div className="mt-1 flex gap-2 text-[10px]">
                <Badge variant="outline" className="border-cyan-neon/30 text-cyan-neon/70">ICD-10: E11.10</Badge>
                <Badge variant="outline" className="border-cyan-neon/30 text-cyan-neon/70">Resolved</Badge>
              </div>
            </div>

            <div className="border-l-2 border-cyan-neon/30 pl-3 relative">
              <div className="absolute w-2 h-2 bg-gray-500 rounded-full -left-[5px] top-1"></div>
              <div className="opacity-50 text-[10px] mb-1">1 YEAR AGO (Clinical Visit)</div>
              <div className="text-cyan-50/70">Routine nephrology followup. Mild decline in kidney function noted (eGFR ~58).</div>
            </div>

            <Separator className="bg-cyan-neon/20" />

            <div>
              <div className="text-yellow-neon text-[10px] mb-2 uppercase tracking-widest flex items-center gap-1">
                <Activity className="w-3 h-3" /> Agent Deterioration Analysis
              </div>
              <p className="text-[10px] text-cyan-50/80 leading-relaxed pr-2">
                Longitudinal analysis indicates progressive compromised renal clearance and brittle glycemic control. 
                Combined with current acute respiratory infection, patient has a mathematically elevated risk of acute kidney injury (AKI) if sepsis protocols are required. 
                Suggest avoiding nephrotoxic antibiotics if possible.
              </p>
            </div>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
