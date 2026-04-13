import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function Privacy() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [hrvConsent, setHrvConsent] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!user) return;
    setSaving(true);

    await supabase
      .from('profiles')
      .update({
        hrv_consent_given: hrvConsent,
        onboarding_complete: true,
      })
      .eq('id', user.id);

    await refreshProfile();
    setSaving(false);
    navigate('/');
  };

  return (
    <ScreenWrapper showBack backPath="/disclaimer" padBottom={false}>
      <div className="text-label mt-4">DATA & PRIVACY CONSENT</div>

      <div className="mt-6">
        <div className="text-label">YOUR RIGHTS</div>
        <div className="flex gap-2 mt-3">
          {['View', 'Export', 'Delete'].map((right) => (
            <div key={right} className="chip flex-1 justify-center cursor-default">{right}</div>
          ))}
        </div>
      </div>

      <div className="divider mt-6" />

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-small">Apple Health HRV</span>
            <p className="text-micro mt-1">Enables biometric grounding in a future update</p>
          </div>
          <button
            onClick={() => setHrvConsent(!hrvConsent)}
            className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
              hrvConsent ? 'bg-am-teal justify-end' : 'bg-am-bg-tertiary'
            }`}
            aria-label="Toggle HRV consent"
          >
            <div className={`w-4 h-4 rounded-full transition-colors ${
              hrvConsent ? 'bg-white' : 'bg-am-text-tertiary'
            }`} />
          </button>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={saving}
        className="btn-primary btn-teal mt-8 mb-8"
        aria-label="Continue"
      >
        {saving ? 'SAVING...' : 'CONTINUE →'}
      </button>
    </ScreenWrapper>
  );
}
