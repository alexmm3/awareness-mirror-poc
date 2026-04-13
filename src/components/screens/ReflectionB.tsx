import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { MOCK_DATA } from '@/context/AppContext';

const subPrompts = [
  'What did you notice about how you were feeling in the lead-up?',
  'Looking back, what would you do differently — if anything?',
  'What does this tell you about how you make decisions under pressure?',
];

export default function ReflectionB() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState<number[]>([]);
  const [showIAS, setShowIAS] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const toggleExpand = (i: number) => {
    setExpanded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleAction = () => setShowIAS(true);
  const handleIAS = () => {
    setTimeout(() => navigate('/'), 400);
  };

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <div className="flex items-center justify-between mt-4">
        <div className="text-label">REFLECTION</div>
        <div className="font-mono text-[11px] text-am-purple italic">post_pattern</div>
      </div>

      {/* Pattern detection header */}
      <div className="mt-4 p-4 rounded" style={{ backgroundColor: 'hsl(270, 18%, 11%)' }}>
        <div className="font-mono font-medium text-[10px] tracking-[0.08em] uppercase text-am-purple">PATTERN DETECTED</div>
        <p className="font-mono text-[14px] text-am-text-primary mt-2">{MOCK_DATA.detectedPattern}</p>
        <div className="text-micro mt-2">Based on {MOCK_DATA.patternDecisions} decisions — early signal</div>
      </div>

      <div className="divider mt-4" />

      {/* Context header */}
      <div className="border-l-2 border-am-amber pl-3 py-2 mt-4">
        <div className="font-mono text-[12px] text-am-text-primary">
          ANXIOUS VIGILANCE → HARDER THAN EXPECTED
        </div>
      </div>

      <p className="font-sans text-[17px] text-am-text-primary leading-[1.7] mt-4">
        {MOCK_DATA.reflectionPromptB}
      </p>

      <textarea
        className="textarea-am mt-4"
        style={{ minHeight: 120 }}
        placeholder="Write freely. 100 words max."
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Reflection response"
      />
      <div className="text-micro text-right mt-1">{wordCount} / 100</div>

      {/* Sub-prompts */}
      <div className="mt-4 space-y-1">
        {subPrompts.map((prompt, i) => (
          <div key={i} className="border-b border-am-border">
            <button
              onClick={() => toggleExpand(i)}
              className="w-full flex items-center gap-2 py-3 text-left"
              aria-label={`Expand: ${prompt}`}
            >
              <span className="font-mono text-[14px] text-am-text-secondary">{expanded.includes(i) ? '−' : '+'}</span>
              <span className="text-small">{prompt.slice(0, 50)}...</span>
            </button>
            {expanded.includes(i) && (
              <p className="text-small italic pb-3 pl-5">{prompt}</p>
            )}
          </div>
        ))}
      </div>

      {!showIAS ? (
        <div className="grid grid-cols-2 gap-3 mt-6 mb-8">
          <button onClick={handleAction} className="btn-primary btn-ghost btn-40" aria-label="Skip">SKIP →</button>
          <button onClick={handleAction} className="btn-primary btn-purple btn-40" aria-label="Submit">SUBMIT →</button>
        </div>
      ) : (
        <div className="animate-slide-up mt-6">
          <p className="font-sans text-[15px] text-am-text-primary">Did what you noticed feel accurate?</p>
          <div className="flex gap-2 mt-3 mb-8">
            {['YES', 'PARTIALLY', 'NO'].map((opt) => (
              <button key={opt} onClick={handleIAS} className="chip flex-1 justify-center" aria-label={opt}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
}
