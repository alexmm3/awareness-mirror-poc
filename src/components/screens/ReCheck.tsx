import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

const options = [
  { label: 'CLEARER', value: 'clearer' as const, sub: 'The quality of my thinking has improved.' },
  { label: 'SAME', value: 'same' as const, sub: 'No significant shift in internal clarity.' },
  { label: 'CLOUDIER', value: 'cloudier' as const, sub: 'My thinking feels more activated or constrained.' },
];

export default function ReCheck() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (selected === null || saving) return;
    setSaving(true);
    const clarity = options[selected].value;

    dispatch({ type: 'SET_RECHECK', payload: clarity });

    // Persist to DB
    if (state.activeSession?.id) {
      await supabase
        .from('sessions')
        .update({ recheck_clarity: clarity })
        .eq('id', state.activeSession.id);
    }

    navigate('/session-close');
  };

  return (
    <ScreenWrapper showBack padBottom={false}>
      <div className="text-label mt-4">RE-CHECK</div>
      <h2 className="font-sans font-medium text-[16px] text-am-text-primary mt-4">
        How has your internal clarity shifted?
      </h2>

      <div className="flex flex-col gap-3 mt-8 stagger-children">
        {options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => setSelected(i)}
            className={`card-surface p-4 text-left transition-all duration-150 ${
              selected === i ? 'border-am-border-active border-l-[3px] border-l-am-teal' : 'border-l-[3px] border-l-transparent'
            }`}
            aria-label={opt.label}
          >
            <div className="font-mono font-medium text-[18px] text-am-text-primary">{opt.label}</div>
            <p className="text-small mt-1">{opt.sub}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        disabled={selected === null || saving}
        className={`btn-primary btn-teal mt-6 mb-8 ${selected === null ? 'opacity-40 pointer-events-none' : ''}`}
        aria-label="Continue"
      >
        {saving ? 'SAVING...' : 'CONTINUE →'}
      </button>
    </ScreenWrapper>
  );
}
