import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const roles = ['Founder', 'Executive', 'Operator', 'Investor', 'Other'];
const decisionTypes = ['People', 'Strategy', 'Money', 'Operations'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [decisionType, setDecisionType] = useState('');
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!user || !decisionType) return;
    setSaving(true);

    await supabase
      .from('profiles')
      .update({
        role,
        decision_type: decisionType,
      })
      .eq('id', user.id);

    await refreshProfile();
    setSaving(false);
    navigate('/disclaimer');
  };

  return (
    <ScreenWrapper showBack backPath="/waitlist" padBottom={false}>
      <div className="text-micro mt-4">{step} / 2</div>

      {step === 1 ? (
        <div className="mt-8 screen-enter" key="step1">
          <h1 className="font-mono-display text-[22px] text-am-text-primary">What is your primary role?</h1>
          <div className="mt-6 space-y-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`w-full text-left card-surface p-3 font-mono text-[14px] transition-all duration-150 ${
                  role === r ? 'border-am-border-active text-am-text-primary' : 'text-am-text-secondary'
                }`}
                aria-label={r}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!role}
            className="btn-primary btn-teal mt-8"
            aria-label="Continue"
          >
            CONTINUE →
          </button>
        </div>
      ) : (
        <div className="mt-8 screen-enter" key="step2">
          <h1 className="font-mono-display text-[22px] text-am-text-primary">What type of decisions do you face most often?</h1>
          <div className="mt-6 space-y-2">
            {decisionTypes.map((d) => (
              <button
                key={d}
                onClick={() => setDecisionType(d)}
                className={`w-full text-left card-surface p-3 font-mono text-[14px] transition-all duration-150 ${
                  decisionType === d ? 'border-am-border-active text-am-text-primary' : 'text-am-text-secondary'
                }`}
                aria-label={d}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={handleFinish}
            disabled={!decisionType || saving}
            className="btn-primary btn-teal mt-8"
            aria-label="Continue"
          >
            {saving ? 'SAVING...' : 'CONTINUE →'}
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
