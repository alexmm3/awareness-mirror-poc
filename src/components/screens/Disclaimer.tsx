import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function Disclaimer() {
  const navigate = useNavigate();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) setScrolledToBottom(true);
  };

  return (
    <ScreenWrapper showBack backPath="/onboarding" padBottom={false}>
      <div className="text-label mt-4">MEDICAL & LEGAL DISCLAIMER</div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="mt-4 card-surface p-4 overflow-y-auto text-body text-am-text-secondary"
        style={{ maxHeight: 320 }}
      >
        <p>Awareness Mirror is a decision intelligence tool. It is not a medical device, therapeutic intervention, or substitute for professional medical or psychological advice.</p>
        <p className="mt-3">The classifications, patterns, and observations provided by Awareness Mirror are based on self-reported data and statistical models. They are not diagnoses.</p>
        <p className="mt-3">If you are experiencing a mental health crisis, please contact a qualified professional or your local emergency services immediately.</p>
        <p className="mt-3">By proceeding, you acknowledge that:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>This tool does not provide medical advice</li>
          <li>Classifications are observations, not diagnoses</li>
          <li>You will seek professional help if needed</li>
          <li>Your data is processed according to our privacy policy</li>
        </ul>
        <p className="mt-3">This tool is designed for cognitive self-observation in professional decision-making contexts. It should be used as one input among many in your decision-making process.</p>
        <p className="mt-3">Scroll to the bottom to acknowledge and continue.</p>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => setAgreed(!agreed)}
          disabled={!scrolledToBottom}
          className={`w-5 h-5 border rounded-sm flex items-center justify-center ${
            agreed ? 'bg-am-teal border-am-teal' : 'border-am-border'
          } ${!scrolledToBottom ? 'opacity-40' : ''}`}
          aria-label="I understand"
        >
          {agreed && <span className="text-[12px]">✓</span>}
        </button>
        <span className="text-small">I understand</span>
      </div>

      <button
        onClick={() => navigate('/privacy')}
        disabled={!agreed}
        className="btn-primary btn-teal mt-6 mb-8"
        aria-label="Continue"
      >
        CONTINUE →
      </button>
    </ScreenWrapper>
  );
}
