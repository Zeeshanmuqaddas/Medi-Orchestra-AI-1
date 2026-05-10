import { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

export default function TelemetryViewer({ simulationActive, emergencyLevel }: { simulationActive: boolean, emergencyLevel: string }) {
  const [data, setData] = useState<{time: number, hr: number, spo2: number, map: number}[]>(Array.from({length: 40}, (_, i) => ({
    time: i,
    hr: 72 + Math.random() * 5,
    spo2: 98 + Math.random() * 2,
    map: 85 + Math.random() * 4
  })));

  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const last = newData[newData.length - 1];
        
        let hrBase = 72;
        let spo2Base = 98;
        let mapBase = 85;

        if (emergencyLevel === 'YELLOW') {
          hrBase = 95;
          spo2Base = 94;
          mapBase = 70;
        } else if (emergencyLevel === 'RED') {
          hrBase = 130;
          spo2Base = 88;
          mapBase = 55;
        }

        newData.push({
          time: last.time + 1,
          hr: hrBase + (Math.random() * 10 - 5),
          spo2: spo2Base + (Math.random() * 4 - 2),
          map: mapBase + (Math.random() * 8 - 4)
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationActive, emergencyLevel]);

  const lastVitals = data[data.length - 1];

  const hrColor = lastVitals.hr > 110 ? 'var(--color-red-neon)' : 'var(--color-cyan-neon)';
  const spo2Color = lastVitals.spo2 < 90 ? 'var(--color-red-neon)' : lastVitals.spo2 < 95 ? 'var(--color-yellow-neon)' : 'var(--color-cyan-neon)';
  const mapColor = lastVitals.map < 65 ? 'var(--color-red-neon)' : 'var(--color-cyan-neon)';

  return (
    <div className="flex h-full gap-4">
       <div className="flex flex-col justify-between w-24">
         <div className="bg-black/50 p-2 rounded border border-cyan-neon/20 h-[30%] flex flex-col justify-center">
            <div className="text-[10px] text-cyan-neon font-mono mb-1">HR (BPM)</div>
            <div className="text-3xl font-bold font-mono" style={{ color: hrColor }}>{lastVitals.hr.toFixed(0)}</div>
         </div>
         <div className="bg-black/50 p-2 rounded border border-cyan-neon/20 h-[30%] flex flex-col justify-center">
            <div className="text-[10px] text-cyan-neon font-mono mb-1">SpO2 (%)</div>
            <div className="text-3xl font-bold font-mono" style={{ color: spo2Color }}>{lastVitals.spo2.toFixed(0)}</div>
         </div>
         <div className="bg-black/50 p-2 rounded border border-cyan-neon/20 h-[30%] flex flex-col justify-center">
            <div className="text-[10px] text-cyan-neon font-mono mb-1">MAP (mmHg)</div>
            <div className="text-3xl font-bold font-mono" style={{ color: mapColor }}>{lastVitals.map.toFixed(0)}</div>
         </div>
       </div>

       <div className="flex-1 flex flex-col justify-between relative">
         <div className="absolute inset-0 grid grid-rows-3 gap-2 opacity-20 pointer-events-none">
           <div className="border-b border-dashed border-cyan-neon"></div>
           <div className="border-b border-dashed border-cyan-neon"></div>
           <div></div>
         </div>

         <div className="h-[30%] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <YAxis domain={[40, 160]} hide />
                <Line type="monotone" dataKey="hr" stroke={hrColor} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
         </div>
         
         <div className="h-[30%] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <YAxis domain={[80, 100]} hide />
                <Line type="monotone" dataKey="spo2" stroke={spo2Color} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
         </div>

         <div className="h-[30%] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <YAxis domain={[30, 120]} hide />
                <Line type="monotone" dataKey="map" stroke={mapColor} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
         </div>
       </div>
    </div>
  )
}
