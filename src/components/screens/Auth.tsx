import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function Auth() {
  const navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);

  const handleSignIn = () => navigate('/');

  return (
    <ScreenWrapper showBack backPath="/privacy" padBottom={false}>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="font-mono-display text-[22px] text-am-text-primary">Sign in</h1>

        <button
          onClick={handleSignIn}
          className="btn-primary mt-8 max-w-[320px] flex items-center justify-center gap-2"
          style={{ backgroundColor: 'hsl(var(--text-primary))', color: 'hsl(var(--bg-primary))' }}
          aria-label="Sign in with Apple"
        >
          <span className="text-[18px]"></span> SIGN IN WITH APPLE
        </button>

        <button onClick={() => setShowEmail(true)} className="ghost-link mt-4">
          Sign in with email
        </button>

        {showEmail && (
          <div className="w-full max-w-[320px] mt-6 space-y-3 screen-enter">
            <input
              type="email"
              placeholder="Email"
              className="textarea-am h-10 !min-h-0 !p-3 text-[14px]"
              aria-label="Email address"
            />
            <input
              type="password"
              placeholder="Password"
              className="textarea-am h-10 !min-h-0 !p-3 text-[14px]"
              aria-label="Password"
            />
            <button onClick={handleSignIn} className="btn-primary btn-teal btn-40" aria-label="Sign in">
              SIGN IN →
            </button>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}
