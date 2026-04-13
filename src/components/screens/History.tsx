import ScreenWrapper from '@/components/shared/ScreenWrapper';


const sessions = [
  { date: 'Mar 16, 2026', state: 'Anxious Vigilance', type: 'State Capture' },
  { date: 'Mar 14, 2026', state: 'Focused Tension', type: 'Decision Capture' },
  { date: 'Mar 12, 2026', state: 'Anxious Vigilance', type: 'State Capture' },
  { date: 'Mar 10, 2026', state: 'Calm Readiness', type: 'State Capture' },
  { date: 'Mar 8, 2026', state: 'Cognitive Depletion', type: 'High-Pressure' },
  { date: 'Mar 6, 2026', state: 'Focused Tension', type: 'State Capture' },
];

export default function History() {
  return (
      <ScreenWrapper padBottom>
        <div className="text-label mt-4">SESSION HISTORY</div>
        <div className="divider mt-3" />

        <div className="space-y-0 mt-2">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-am-border">
              <div>
                <div className="text-micro">{s.date}</div>
                <div className="font-mono text-[11px] text-am-text-primary mt-1">{s.state}</div>
              </div>
              <span className="text-micro">{s.type}</span>
            </div>
          ))}
        </div>
      </ScreenWrapper>
  );
}
