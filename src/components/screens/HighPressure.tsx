import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function HighPressure() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    setLogged(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (logged) {
    return (
      <ScreenWrapper padBottom={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="font-mono font-medium text-[14px] text-am-text-primary">
            Noted. Your system registered the moment.
          </p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper showBack backPath="/" padBottom={false}>
      <h1 className="font-mono-display text-[22px] text-am-text-primary mt-6">HIGH-PRESSURE MOMENT</h1>
      <p className="text-body text-am-text-secondary mt-2">Log it in under 30 seconds. No analysis. No follow-up.</p>

      <textarea
        className="textarea-am mt-6"
        style={{ minHeight: 80 }}
        placeholder="Optional — what happened?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="High-pressure moment description"
      />

      <button onClick={handleLog} className="btn-primary btn-red mt-6 mb-8" aria-label="Log it">
        LOG IT →
      </button>
    </ScreenWrapper>
  );
}
