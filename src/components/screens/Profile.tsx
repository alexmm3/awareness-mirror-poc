import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleToggleAccelerated = async () => {
    if (!user || !profile) return;
    await supabase
      .from('profiles')
      .update({ pilot_accelerated_timers: !profile.pilot_accelerated_timers })
      .eq('id', user.id);
    await refreshProfile();
  };

  return (
    <ScreenWrapper padBottom>
      <div className="text-label mt-4">PROFILE & SETTINGS</div>
      <div className="divider mt-3" />

      <div className="mt-4">
        <div className="text-micro">ACCOUNT</div>
        <div className="text-body text-am-text-primary mt-2">{user?.email ?? '—'}</div>
      </div>

      <div className="divider mt-6" />

      <div className="mt-4">
        <div className="text-micro">YOUR DATA</div>
        <div className="space-y-3 mt-3">
          <button className="ghost-link block">View my data →</button>
          <button className="ghost-link block">Export (JSON + CSV) →</button>
          <button className="ghost-link block !text-am-red">Delete account →</button>
        </div>
      </div>

      <div className="divider mt-6" />

      <div className="mt-4">
        <div className="text-micro">HRV INTEGRATION</div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-small">Apple Health HRV</span>
          <div className="w-10 h-5 bg-am-bg-tertiary rounded-full flex items-center px-0.5">
            <div className="w-4 h-4 bg-am-text-tertiary rounded-full" />
          </div>
        </div>
        <p className="text-micro mt-1">Enables biometric grounding in a future update</p>
      </div>

      <div className="divider mt-6" />

      <div className="mt-4">
        <div className="text-micro">PILOT SETTINGS</div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-small">Accelerated Timers</span>
            <p className="text-micro mt-1">Outcome signal in 2 min instead of 48 hours</p>
          </div>
          <button
            onClick={handleToggleAccelerated}
            className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
              profile?.pilot_accelerated_timers ? 'bg-am-teal justify-end' : 'bg-am-bg-tertiary'
            }`}
            aria-label="Toggle accelerated timers"
          >
            <div className={`w-4 h-4 rounded-full transition-colors ${
              profile?.pilot_accelerated_timers ? 'bg-white' : 'bg-am-text-tertiary'
            }`} />
          </button>
        </div>
      </div>

      <div className="divider mt-6" />

      <div className="mt-4 space-y-2">
        <button className="ghost-link block text-[12px]">Terms of Service</button>
        <button className="ghost-link block text-[12px]">Privacy Policy</button>
      </div>

      <button
        onClick={handleSignOut}
        className="ghost-link block mt-6 !text-am-red text-[12px]"
      >
        Sign out →
      </button>

      <div className="text-micro mt-6 mb-8">v1.0.0-prototype</div>
    </ScreenWrapper>
  );
}
