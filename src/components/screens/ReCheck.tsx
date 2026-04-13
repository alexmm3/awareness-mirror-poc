import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

const options = [
  { label: 'CLEARER', sub: 'The quality of my thinking has improved.' },
  { label: 'SAME', sub: 'No significant shift in internal clarity.' },
  { label: 'CLOUDIER', sub: 'My thinking feels more activated or constrained.' },
];

export default function ReCheck() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (i: number) => {
    setSelected(i);
    setTimeout(() => navigate('/session-close'), 300);
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
            onClick={() => handleSelect(i)}
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
    </ScreenWrapper>
  );
}
